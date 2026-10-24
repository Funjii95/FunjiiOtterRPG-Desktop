using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;
using System.Text.Json;

namespace FunjiiOtterDesktop;

internal sealed class OtterWindow : Form
{
    private const string Origin = "https://otter.local";
    private readonly WebView2 web = new() { Dock = DockStyle.Fill, DefaultBackgroundColor = Color.FromArgb(3, 11, 28) };
    private readonly Label identity = new() { Text = "Nicht angemeldet", AutoSize = true, Margin = new(12, 16, 16, 0) };
    private readonly Label status = new() { Dock = DockStyle.Bottom, Height = 30, TextAlign = ContentAlignment.MiddleLeft, Text = "Verbinde mit Funjii-Backend …" };
    private readonly Button login = new() { Text = "Mit Twitch anmelden", AutoSize = true, Height = 34, Margin = new(5, 8, 5, 0) };
    private readonly Button logout = new() { Text = "Abmelden", AutoSize = true, Height = 34, Margin = new(5, 8, 5, 0), Enabled = false };
    private readonly TwitchLogin twitch = new();
    private readonly System.Windows.Forms.Timer sessionTimer = new() { Interval = 3600000 };
    private readonly string dataDir;
    private readonly string? testDir;
    private TwitchPlayer? player;
    private readonly TwitchSession savedSession;
    private bool validating;
    private CancellationTokenSource? pendingLogin;
    private string? bootstrapId;
    private bool ready, switching, preparingLogin;
    private int identityVersion;
    private BackendGateway? gateway;
    private BackendConfiguration? backendConfig;
    private string backendStatus = "Bitte mit Twitch anmelden";
    private readonly CancellationTokenSource lifetime = new();
    private readonly System.Windows.Forms.Timer updateTimer = new() { Interval=60*60*1000 };
    private readonly Label updateText = new() { Dock=DockStyle.Fill,TextAlign=ContentAlignment.MiddleLeft,AutoEllipsis=true,Text="Automatische Updates" };
    private readonly Button updateButton = new() { Dock=DockStyle.Right,Width=200,Text="Updates prüfen" };
    private readonly Button versionButton = new() {Dock=DockStyle.Right,Width=110,Text="v"+Application.ProductVersion.Split('+')[0],AccessibleName="Version und Patchnotes"};
    private AppUpdater? updater;

    public OtterWindow(string? smokeTestDir = null)
    {
        testDir = smokeTestDir;
        using(var iconStream=typeof(OtterWindow).Assembly.GetManifestResourceStream("FunjiiOtterDesktop.Assets.otter.ico")){if(iconStream!=null)Icon=new Icon(iconStream);}
        dataDir = testDir ?? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "FunjiiOtterDesktop");
        savedSession=new(new TwitchSessionStore(dataDir),twitch);
        Text = $"Funjii Otter RPG · {Application.ProductVersion.Split('+')[0]}"; Size = new(1380, 960); MinimumSize = new(1024, 740); StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.FromArgb(6, 16, 36); ForeColor = Color.FromArgb(223, 240, 255); Font = new("Segoe UI", 10);
        var bar = new FlowLayoutPanel { Dock = DockStyle.Top, Height = 56, BackColor = Color.FromArgb(14, 30, 53), WrapContents = false };
        bar.Controls.Add(identity); bar.Controls.Add(login); bar.Controls.Add(logout);
        Controls.Add(web); Controls.Add(bar); Controls.Add(status);
        var updateBar = new Panel { Dock=DockStyle.Bottom,Height=38,Padding=new(12,2,8,2),BackColor=Color.FromArgb(14,30,53) };
        updateBar.Controls.Add(updateText);updateBar.Controls.Add(versionButton);updateBar.Controls.Add(updateButton);Controls.Add(updateBar);
        versionButton.Click+=(_,_)=>ShowPatchNotes();
        updateButton.Click += async(_,_)=>await UpdateClickedAsync();
        updateTimer.Tick += async(_,_)=>{if(updater!=null)await updater.CheckAsync(lifetime.Token);};
        login.Click += async (_, _) => await LoginAsync(); logout.Click += async (_, _) => await LogoutAsync();
        sessionTimer.Tick += async (_, _) => await ValidateAsync();
        Shown += async (_, _) => { await InitializeAsync();if(testDir==null&&!IsDisposed)StartUpdates(); };
        FormClosing += (_, _) => { pendingLogin?.Cancel(); lifetime.Cancel(); sessionTimer.Stop();updateTimer.Stop(); };
        FormClosed += (_, _) => { twitch.Dispose(); gateway?.Dispose(); lifetime.Dispose(); };
    }
    private void ShowPatchNotes()
    {
        using var notes=new Form{Text="Funjii Otter RPG · Patchnotes",Size=new(820,700),MinimumSize=new(480,400),StartPosition=FormStartPosition.CenterParent,BackColor=BackColor,ForeColor=ForeColor,Icon=Icon};
        var path=Path.Combine(AppContext.BaseDirectory,"RELEASE-NOTES.md");
        var text=File.Exists(path)?File.ReadAllText(path):"Für diese Version wurden keine Patchnotes mitgeliefert.";
        notes.Controls.Add(new TextBox{Multiline=true,ReadOnly=true,ScrollBars=ScrollBars.Vertical,Dock=DockStyle.Fill,Text=text.Replace("\n",Environment.NewLine),BackColor=Color.FromArgb(6,24,40),ForeColor=Color.FromArgb(229,245,255),Font=new("Segoe UI",11),BorderStyle=BorderStyle.None});notes.ShowDialog(this);
    }
    private void StartUpdates()
    {
        try
        {
            updater=new AppUpdater(new VelopackUpdateClient());
            updater.Changed+=state=>{if(IsDisposed||Disposing)return;if(InvokeRequired){BeginInvoke(new Action(()=>ShowUpdate(state)));}else ShowUpdate(state);};
            updateTimer.Start();_ = updater.CheckAsync(lifetime.Token);
        }
        catch(Exception){updateText.Text="Updates momentan nicht verfügbar. Die App bleibt nutzbar.";}
    }
    private void ShowUpdate(UpdateState state)
    {
        if(IsDisposed||Disposing)return;
        updateText.Text=state.Message;
        updateButton.Text=state.Phase switch {UpdatePhase.Ready=>"Update installieren",UpdatePhase.Unmanaged=>"Installer öffnen",_=>"Updates prüfen"};
        updateButton.Enabled=state.Phase is not (UpdatePhase.Checking or UpdatePhase.Downloading);
    }
    private async Task UpdateClickedAsync()
    {
        if(updater==null){StartUpdates();return;}
        if(updater.State.Phase==UpdatePhase.Unmanaged){System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo(VelopackUpdateClient.RepositoryUrl+"/releases/latest"){UseShellExecute=true});return;}
        if(updater.State.Phase!=UpdatePhase.Ready){await updater.CheckAsync(lifetime.Token);return;}
        if(switching||preparingLogin||pendingLogin!=null){updateText.Text="Bitte die laufende Anmeldung zuerst abschließen.";return;}
        try
        {
            if(ready && await web.ExecuteScriptAsync("window.otterCanRestart?.()===false")=="true"){updateText.Text="Bitte warten, bis die laufende Spielaktion bestätigt ist.";return;}
            updater.PrepareRestart();Close();
        }
        catch(Exception){updateText.Text="Update konnte nicht gestartet werden. Bitte später erneut versuchen.";}
    }
    private async Task InitializeAsync()
    {
        try
        {
            Directory.CreateDirectory(dataDir);
            var environment = await CoreWebView2Environment.CreateAsync(null, Path.Combine(dataDir, "WebView"));
            await web.EnsureCoreWebView2Async(environment);
            var webDirectory=Path.GetFullPath(Path.Combine(AppContext.BaseDirectory,"Web"));
            if(!File.Exists(Path.Combine(webDirectory,"desktop.html")))throw new FileNotFoundException("Der Web-Ordner ist unvollständig. Bitte die aktuelle Windows-Version über den vollständigen Installer installieren.");
            web.CoreWebView2.SetVirtualHostNameToFolderMapping("otter.local", webDirectory, CoreWebView2HostResourceAccessKind.DenyCors);
            web.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
            web.CoreWebView2.Settings.AreDevToolsEnabled = false;
            web.CoreWebView2.Settings.IsStatusBarEnabled = false;
            web.CoreWebView2.PermissionRequested += (_, e) => e.State = CoreWebView2PermissionState.Deny;
            web.CoreWebView2.NewWindowRequested += (_, e) => e.Handled = true;
            web.CoreWebView2.WebMessageReceived += async (_, e) => await HandleWebMessageAsync(e);
            web.CoreWebView2.NavigationStarting += (_, e) => { var uri = new Uri(e.Uri); if (uri.GetLeftPart(UriPartial.Authority) != Origin) e.Cancel = true; };
            web.CoreWebView2.NavigationCompleted += (_, e) => { ready = e.IsSuccess; if (!ready) status.Text = "Die lokale Spieloberfläche konnte nicht geladen werden: " + e.WebErrorStatus; };
            gateway = new BackendGateway(DesktopSettings.ReadBackendUri(AppContext.BaseDirectory));
            if(testDir == null) { await LoadBackendConfigurationAsync(); await RestoreSavedLoginAsync(); }
            await UpdateBootstrapAsync();
            web.CoreWebView2.Navigate(Origin + "/desktop.html");
            if (testDir != null) await SmokeTestAsync();
        }
        catch (Exception ex)
        {
            if (testDir != null) { File.WriteAllText(Path.Combine(testDir, "result.txt"), ex.ToString()); Environment.ExitCode = 1; Close(); return; }
            status.Text = "Start fehlgeschlagen.";
            MessageBox.Show("Die Spieloberfläche konnte nicht gestartet werden. Prüfe, ob der Web-Ordner neben der App liegt und Microsoft Edge WebView2 Runtime installiert ist.\n\n" + ex.Message, "Funjii Otter RPG");
        }
    }
    private async Task RestoreSavedLoginAsync()
    {
        if(backendConfig?.Enabled!=true||backendConfig.ClientId==null)return;
        try{
            status.Text="Gespeicherte Twitch-Anmeldung wird geprüft …";
            var restored=await savedSession.RestoreAsync(backendConfig.ClientId,lifetime.Token);if(restored==null)return;
            player=restored;identityVersion++;identity.Text=$"{restored.DisplayName} · Twitch-ID {restored.UserId}";logout.Enabled=true;
            backendStatus="Automatisch mit Twitch angemeldet · Live-Spielstand über das Funjii-Backend";status.Text=backendStatus;sessionTimer.Start();
        }catch(OperationCanceledException) when(lifetime.IsCancellationRequested){}
        catch(Exception){backendStatus="Gespeicherte Anmeldung bleibt erhalten · Twitch momentan nicht erreichbar";status.Text=backendStatus;}
    }
    private async Task UpdateBootstrapAsync()
    {
        if (bootstrapId != null) web.CoreWebView2.RemoveScriptToExecuteOnDocumentCreated(bootstrapId);
        var profile = new { userId = player?.UserId ?? "guest", displayName = player?.DisplayName ?? "Nicht angemeldet", channelId = backendConfig?.ChannelId, connected = player != null && backendConfig?.Enabled == true, backendStatus };
        bootstrapId = await web.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync("window.otterDesktopIdentity=" + JsonSerializer.Serialize(profile) + ";");
    }
    private async Task SwitchProfileAsync(TwitchPlayer? next)
    {
        if (switching) return;
        switching = true; web.Enabled = false; login.Enabled = false; logout.Enabled = false;
        try
        {
            await web.ExecuteScriptAsync("window.otterFlush?.()");
            player = next; identityVersion++;
            identity.Text = next == null ? "Nicht angemeldet" : $"{next.DisplayName} · Twitch-ID {next.UserId}";
            backendStatus = next == null ? "Bitte mit Twitch anmelden" : "Live-Spielstand über das Funjii-Backend";
            await UpdateBootstrapAsync(); ready = false; web.CoreWebView2.Reload();
            await WaitForAsync(async () => ready && await web.ExecuteScriptAsync("document.querySelector('h1')?.textContent.includes('Otter RPG')===true") == "true");
            status.Text = next == null ? "Abgemeldet · keine Spielaktionen möglich" : "Twitch-Identität bestätigt · Spielstand und Aktionen werden vom Backend geprüft";
        }
        finally { switching = false; web.Enabled = true; login.Enabled = true; logout.Enabled = player != null; }
    }
    private async Task LoginAsync()
    {
        if (pendingLogin != null) { pendingLogin.Cancel(); return; }
        if (!ready || switching || preparingLogin) return;
        if (player != null) { MessageBox.Show("Bitte zuerst abmelden, um den Spieler zu wechseln."); return; }
        try
        {
            preparingLogin = true;
            await LoadBackendConfigurationAsync();
            string? clientId = backendConfig?.Enabled == true ? backendConfig.ClientId : null;
            if (clientId == null) return;
            using var cancellation = new CancellationTokenSource(); pendingLogin = cancellation; login.Text = "Login abbrechen";
            var verified = await savedSession.RestoreAsync(clientId,cancellation.Token) ?? await twitch.LoginAsync(clientId, text => status.Text = text, cancellation.Token);
            await savedSession.SaveAsync(verified,cancellation.Token);
            cancellation.Token.ThrowIfCancellationRequested();
            await SwitchProfileAsync(verified); sessionTimer.Start();
        }
        catch (OperationCanceledException) { status.Text = "Anmeldung abgebrochen oder Zeit abgelaufen."; }
        catch (Exception ex) { status.Text = "Twitch-Anmeldung fehlgeschlagen."; MessageBox.Show(ex.Message, "Twitch Login"); }
        finally { pendingLogin = null; preparingLogin = false; login.Text = "Mit Twitch anmelden"; }
    }
    private async Task LogoutAsync()
    {
        pendingLogin?.Cancel(); sessionTimer.Stop();
        try { await savedSession.ClearAsync(lifetime.Token); await SwitchProfileAsync(null); } catch (Exception ex) { MessageBox.Show(ex.Message, "Profilwechsel"); }
    }
    private async Task LoadBackendConfigurationAsync()
    {
        try
        {
            backendConfig = await gateway!.ConfigurationAsync(lifetime.Token);
            backendStatus = backendConfig.Enabled ? "Backend erreichbar · bitte mit Twitch anmelden" : "Backend erreichbar · Desktop-Anmeldung noch nicht freigeschaltet";
        }
        catch (Exception ex) when (ex is HttpRequestException or OperationCanceledException or JsonException or InvalidOperationException)
        { backendConfig = null; backendStatus = "Desktop-Schnittstelle des Backends noch nicht verfügbar"; }
        status.Text = backendStatus;
    }
    private async Task HandleWebMessageAsync(CoreWebView2WebMessageReceivedEventArgs args)
    {
        if(args.Source != Origin + "/desktop.html" || switching || IsDisposed)return;
        try
        {
            using var json = JsonDocument.Parse(args.WebMessageAsJson);
            if(json.RootElement.GetProperty("type").GetString()=="login") { await LoginAsync(); return; }
            if(json.RootElement.GetProperty("type").GetString()!="api")return;
            var request = json.RootElement.Deserialize<GatewayRequest>(new JsonSerializerOptions(JsonSerializerDefaults.Web));
            if(request == null || gateway == null)return;
            int generation = identityVersion;
            var reply = await gateway.SendAsync(request,player,lifetime.Token);
            if(reply.Status==401&&player!=null){await ValidateAsync();if(generation==identityVersion&&player!=null)reply=await gateway.SendAsync(request,player,lifetime.Token);}
            if(generation!=identityVersion || switching || IsDisposed || lifetime.IsCancellationRequested)return;
            web.CoreWebView2.PostWebMessageAsJson(JsonSerializer.Serialize(reply,new JsonSerializerOptions(JsonSerializerDefaults.Web)));
        }
        catch(Exception ex) when(ex is JsonException or KeyNotFoundException or InvalidOperationException or ArgumentException) { /* Unrecognized web messages are ignored. */ }
    }
    private async Task ValidateAsync()
    {
        var current=player;int generation=identityVersion;if(current==null||validating||lifetime.IsCancellationRequested)return;validating=true;
        try{var verified=await savedSession.RestoreAsync(current.ClientId,lifetime.Token);if(generation!=identityVersion)return;
            if(verified==null){sessionTimer.Stop();await SwitchProfileAsync(null);status.Text="Twitch-Anmeldung wurde widerrufen oder ist abgelaufen. Bitte erneut anmelden.";}
            else if(verified.UserId==current.UserId)player=verified;
            else{sessionTimer.Stop();await SwitchProfileAsync(null);status.Text="Das gespeicherte Twitch-Konto wurde in einem anderen Fenster gewechselt. Bitte die Anmeldung erneut laden.";}
        }catch(OperationCanceledException) when(lifetime.IsCancellationRequested){}
        catch(Exception){if(generation==identityVersion)status.Text="Twitch momentan nicht erreichbar · gespeicherte Anmeldung bleibt erhalten";}
        finally{validating=false;}
    }
    private static async Task WaitForAsync(Func<Task<bool>> condition)
    {
        for (int i = 0; i < 100; i++) { if (await condition()) return; await Task.Delay(100); }
        throw new TimeoutException("Die lokale Oberfläche hat nicht rechtzeitig geantwortet.");
    }
    private async Task SmokeTestAsync()
    {
        var settingsDir = Path.Combine(testDir!, "config-check"); Directory.CreateDirectory(settingsDir);
        File.WriteAllText(Path.Combine(settingsDir, "appsettings.json"), "{\"Backend\":{\"Url\":\"https://backend.example\"}}");
        if (DesktopSettings.ReadBackendUri(settingsDir).Host != "backend.example") throw new Exception("Backend configuration failed");
        File.WriteAllText(Path.Combine(settingsDir, "appsettings.json"), "{\"Backend\":{\"Url\":\"http://backend.example\"}}");
        bool rejected=false;try{DesktopSettings.ReadBackendUri(settingsDir);}catch(InvalidOperationException){rejected=true;}
        if(!rejected)throw new Exception("Insecure backend URL accepted");
        await WaitForAsync(async () => ready && await web.ExecuteScriptAsync("document.querySelector('h1')?.textContent.includes('Otter RPG')===true") == "true");
        string result = await web.ExecuteScriptAsync("JSON.stringify({title:document.querySelector('h1').textContent,tabs:[...document.querySelectorAll('nav button')].map(b=>b.textContent),images:[...document.images].filter(i=>i.complete&&i.naturalWidth>0).length})");
        if (!result.Contains("Inventar") || !result.Contains("Materialien") || !result.Contains("Aufwertung") || !result.Contains("Sammlungen")) throw new Exception("Deep Sea Codex navigation missing: " + result);
        await web.ExecuteScriptAsync("[...document.querySelectorAll('nav button')].find(b=>b.textContent.includes('Inventar')).click()");
        await WaitForAsync(async () => await web.ExecuteScriptAsync("document.body.textContent.includes('Inventar')") == "true");
        await web.ExecuteScriptAsync("[...document.querySelectorAll('nav button')].find(b=>b.textContent.includes('Charakter')).click()");
        await Task.Delay(500);
        using (var file = File.Create(Path.Combine(testDir!, "Funjii-Otter-Windows.png"))) await web.CoreWebView2.CapturePreviewAsync(CoreWebView2CapturePreviewImageFormat.Png, file);
        await web.ExecuteScriptAsync("window.otterFlush()");
        string remote = await web.ExecuteScriptAsync("!document.body.textContent.includes('25.000') && document.querySelector('h1').textContent.includes('RPG') && !document.querySelector('h1').textContent.includes('DEMO')");
        if (remote != "true") throw new Exception("Live view must not contain demo progress");
        if(BackendGateway.Allowed(new("test","/api/v1/plugin/actions/session","POST",null,null)) || BackendGateway.Allowed(new("test","https://evil.example/api/v1/me","GET",null,null))) throw new Exception("API bridge scope failed");
        if(!BackendGateway.Allowed(new("test","/api/v1/me","GET",null,null)))throw new Exception("Profile route missing");
        var unauthenticated=await gateway!.SendAsync(new("test","/api/v1/me","GET",null,null),null);
        if(unauthenticated.Status!=401)throw new Exception("Anonymous bridge request accepted");
        await web.ExecuteScriptAsync("window.__nativeProbe=null;window.chrome.webview.addEventListener('message',e=>{if(e.data.id==='nativeprobe')window.__nativeProbe=e.data.status;});window.chrome.webview.postMessage({type:'api',id:'nativeprobe',path:'/api/v1/me',method:'GET',body:null,session:null});");
        await WaitForAsync(async()=>await web.ExecuteScriptAsync("window.__nativeProbe===401")=="true");
        using(var probeGateway=new BackendGateway(new Uri("https://backend.example"),new GatewayTestHandler()))
        {
            var reply=await probeGateway.SendAsync(new("test","/api/v1/me","GET",null,null),new TwitchPlayer("1001","Otter","testonlycredential","testclient12345"));
            if(reply.Status!=200)throw new Exception("Native authorization forwarding failed");
        }
        File.WriteAllText(Path.Combine(testDir!, "result.txt"), "PASS: bundled configuration, native startup, original Otter UI, remote mode without demo values, API bridge rejects anonymous/plugin/external requests\n" + result);
        Close();
    }
    private sealed class GatewayTestHandler:HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,CancellationToken ct)
        {
            if(request.RequestUri?.AbsoluteUri!="https://backend.example/api/v1/me" || request.Headers.Authorization?.Scheme!="Desktop" || request.Headers.Authorization.Parameter!="testonlycredential")throw new Exception("Invalid gateway transport");
            return Task.FromResult(new HttpResponseMessage(System.Net.HttpStatusCode.OK){Content=new StringContent("{}")});
        }
    }
}
