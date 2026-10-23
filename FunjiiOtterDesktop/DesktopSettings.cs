using System.Text.Json;

namespace FunjiiOtterDesktop;

internal static class DesktopSettings
{
    internal static Uri ReadBackendUri(string directory)
    {
        using var json=JsonDocument.Parse(File.ReadAllText(Path.Combine(directory,"appsettings.json")));
        string url=json.RootElement.GetProperty("Backend").GetProperty("Url").GetString()??"";
        if(!Uri.TryCreate(url,UriKind.Absolute,out var uri) || uri.Scheme!="https" || uri.UserInfo.Length>0 || uri.AbsolutePath!="/" || uri.Query.Length>0 || uri.Fragment.Length>0)
            throw new InvalidOperationException("Backend-Adresse muss eine HTTPS-Serveradresse sein.");
        return uri;
    }
}
