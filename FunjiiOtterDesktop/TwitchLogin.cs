using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text.Json;

namespace FunjiiOtterDesktop;

internal sealed record TwitchPlayer(string UserId, string DisplayName, string AccessToken, string ClientId, string RefreshToken = "");
internal sealed class TwitchLogin : IDisposable
{
    private readonly HttpClient http;
    internal TwitchLogin(HttpMessageHandler? handler=null){http=new(handler??new HttpClientHandler{AllowAutoRedirect=false}){Timeout=TimeSpan.FromSeconds(25)};}
    public async Task<TwitchPlayer> LoginAsync(string clientId, Action<string> status, CancellationToken ct)
    {
        using var response = await http.PostAsync("https://id.twitch.tv/oauth2/device", new FormUrlEncodedContent(new Dictionary<string, string> { ["client_id"] = clientId, ["scopes"] = "" }), ct);
        if (!response.IsSuccessStatusCode) throw new InvalidOperationException("Client-ID prüfen: Die Desktop-Anmeldung benötigt eine Twitch-App vom Typ Public.");
        using var device = JsonDocument.Parse(await response.Content.ReadAsStringAsync(ct));
        var d = device.RootElement;
        var uri = new Uri(d.GetProperty("verification_uri").GetString()!);
        if (uri.Scheme != "https" || uri.Host != "www.twitch.tv") throw new InvalidOperationException("Ungültige Twitch-Anmeldeadresse.");
        status("Im Browser bestätigen · Code: " + d.GetProperty("user_code").GetString());
        Process.Start(new ProcessStartInfo(uri.AbsoluteUri) { UseShellExecute = true });
        int interval = Math.Max(5, d.GetProperty("interval").GetInt32());
        using var expiry = CancellationTokenSource.CreateLinkedTokenSource(ct);
        expiry.CancelAfter(TimeSpan.FromSeconds(d.GetProperty("expires_in").GetInt32()));
        while (true)
        {
            await Task.Delay(TimeSpan.FromSeconds(interval), expiry.Token);
            using var tokenResponse = await http.PostAsync("https://id.twitch.tv/oauth2/token", new FormUrlEncodedContent(new Dictionary<string, string> { ["client_id"] = clientId, ["scopes"] = "", ["device_code"] = d.GetProperty("device_code").GetString()!, ["grant_type"] = "urn:ietf:params:oauth:grant-type:device_code" }), expiry.Token);
            using var token = JsonDocument.Parse(await tokenResponse.Content.ReadAsStringAsync(expiry.Token));
            if (tokenResponse.IsSuccessStatusCode) { var verified=await VerifyAsync(clientId, token.RootElement.GetProperty("access_token").GetString()!, expiry.Token);return verified with{RefreshToken=token.RootElement.TryGetProperty("refresh_token",out var refresh)?refresh.GetString()??"":""}; }
            string error = token.RootElement.TryGetProperty("message", out var message) ? message.GetString() ?? "" : token.RootElement.TryGetProperty("error", out var e) ? e.GetString() ?? "" : "";
            if (error == "authorization_pending") continue;
            if (error == "slow_down") { interval += 5; continue; }
            throw new InvalidOperationException("Twitch hat die Anmeldung abgelehnt oder der Code ist abgelaufen. Bitte erneut versuchen.");
        }
    }
    internal async Task<TwitchPlayer> ResumeAsync(TwitchPlayer saved,Action<TwitchPlayer> rotated,CancellationToken ct)
    {
        TwitchPlayer verified;
        try{verified=await VerifyAsync(saved.ClientId,saved.AccessToken,ct);}
        catch(UnauthorizedAccessException) when(!string.IsNullOrEmpty(saved.RefreshToken)){
            using var response=await http.PostAsync("https://id.twitch.tv/oauth2/token",new FormUrlEncodedContent(new Dictionary<string,string>{["grant_type"]="refresh_token",["refresh_token"]=saved.RefreshToken,["client_id"]=saved.ClientId}),ct);
            if(response.StatusCode is System.Net.HttpStatusCode.BadRequest or System.Net.HttpStatusCode.Unauthorized or System.Net.HttpStatusCode.Forbidden)throw new UnauthorizedAccessException("Gespeicherte Twitch-Anmeldung wurde widerrufen oder ist abgelaufen.");
            response.EnsureSuccessStatusCode();using var json=JsonDocument.Parse(await response.Content.ReadAsStringAsync(ct));
            saved=saved with{AccessToken=json.RootElement.GetProperty("access_token").GetString()!,RefreshToken=json.RootElement.GetProperty("refresh_token").GetString()!};
            // Public DCF refresh tokens rotate once. Persist the new pair before any further network request.
            rotated(saved);verified=await VerifyAsync(saved.ClientId,saved.AccessToken,ct);
        }
        if(verified.UserId!=saved.UserId)throw new UnauthorizedAccessException("Gespeicherte Twitch-Identität stimmt nicht überein.");
        return verified with{RefreshToken=saved.RefreshToken};
    }
    public async Task<TwitchPlayer> VerifyAsync(string clientId, string token, CancellationToken ct)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "https://id.twitch.tv/oauth2/validate"); request.Headers.Authorization = new("OAuth", token);
        using var response = await http.SendAsync(request, ct);
        if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized) throw new UnauthorizedAccessException("Twitch-Sitzung abgelaufen. Bitte erneut anmelden.");
        response.EnsureSuccessStatusCode();
        using var data = JsonDocument.Parse(await response.Content.ReadAsStringAsync(ct)); var u = data.RootElement;
        string id = u.GetProperty("user_id").GetString()!;
        if (u.GetProperty("client_id").GetString() != clientId || !System.Text.RegularExpressions.Regex.IsMatch(id, "^[0-9]{1,25}$")) throw new UnauthorizedAccessException("Twitch-Identität konnte nicht bestätigt werden.");
        string name = u.GetProperty("login").GetString()!;
        using var profileRequest = new HttpRequestMessage(HttpMethod.Get, "https://api.twitch.tv/helix/users"); profileRequest.Headers.Authorization = new("Bearer", token); profileRequest.Headers.Add("Client-Id", clientId);
        using var profile = await http.SendAsync(profileRequest, ct);
        if (profile.IsSuccessStatusCode) { using var p = JsonDocument.Parse(await profile.Content.ReadAsStringAsync(ct)); name = p.RootElement.GetProperty("data")[0].GetProperty("display_name").GetString() ?? name; }
        return new(id, name, token, clientId);
    }
    public void Dispose() => http.Dispose();
}
