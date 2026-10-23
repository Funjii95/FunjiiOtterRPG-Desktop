using Velopack;
using Velopack.Sources;

namespace FunjiiOtterDesktop;

public enum UpdatePhase { Idle, Unmanaged, Checking, Downloading, Ready, Current, Offline }
public sealed record UpdateState(UpdatePhase Phase,string Message,int Progress=0);
public interface IDesktopUpdateClient
{
    bool IsInstalled { get; }
    string? PendingVersion { get; }
    Task<string?> FindAsync();
    Task DownloadAsync(Action<int> progress,CancellationToken ct);
    void PrepareRestart();
}
public sealed class VelopackUpdateClient : IDesktopUpdateClient
{
    public const string RepositoryUrl = "https://github.com/Funjii95/FunjiiOtterRPG-Desktop";
    private readonly UpdateManager manager = new(new GithubSource(RepositoryUrl,accessToken:null,prerelease:false));
    private UpdateInfo? found;
    public bool IsInstalled => manager.IsInstalled;
    public string? PendingVersion => manager.UpdatePendingRestart?.Version.ToString();
    public async Task<string?> FindAsync() { found=await manager.CheckForUpdatesAsync();return found?.TargetFullRelease.Version.ToString(); }
    public Task DownloadAsync(Action<int> progress,CancellationToken ct) => manager.DownloadUpdatesAsync(found??throw new InvalidOperationException("Kein Update gefunden."),progress,ct);
    public void PrepareRestart()
    {
        var pending=manager.UpdatePendingRestart??throw new InvalidOperationException("Das Update ist noch nicht vollständig heruntergeladen.");
        manager.WaitExitThenApplyUpdates(pending,silent:true,restart:true,restartArgs:[]);
    }
}
public sealed class AppUpdater(IDesktopUpdateClient client)
{
    private int checking;
    public UpdateState State { get; private set; } = new(UpdatePhase.Idle,"Updates werden automatisch geprüft.");
    public event Action<UpdateState>? Changed;
    private void Set(UpdateState next) { State=next;Changed?.Invoke(next); }
    public async Task CheckAsync(CancellationToken ct=default)
    {
        if(Interlocked.CompareExchange(ref checking,1,0)!=0)return;
        try
        {
            ct.ThrowIfCancellationRequested();
            if(!client.IsInstalled){Set(new(UpdatePhase.Unmanaged,"Für automatische Updates bitte den Windows-Installer verwenden."));return;}
            if(client.PendingVersion is {} pending){Set(new(UpdatePhase.Ready,$"Update {pending} ist bereit. Neustart zum Installieren."));return;}
            Set(new(UpdatePhase.Checking,"Suche nach Updates …"));
            var version=await client.FindAsync();ct.ThrowIfCancellationRequested();
            if(version==null){Set(new(UpdatePhase.Current,"Die App ist aktuell."));return;}
            Set(new(UpdatePhase.Downloading,$"Update {version} wird im Hintergrund geladen …"));
            await client.DownloadAsync(value=>{if(!ct.IsCancellationRequested)Set(new(UpdatePhase.Downloading,$"Update {version} wird geladen: {Math.Clamp(value,0,100)} %",Math.Clamp(value,0,100)));},ct);
            ct.ThrowIfCancellationRequested();
            if(client.PendingVersion==null)throw new InvalidOperationException("Das Update wurde nicht vollständig vorbereitet.");
            Set(new(UpdatePhase.Ready,$"Update {version} ist bereit. Neustart zum Installieren.",100));
        }
        catch(OperationCanceledException) when(ct.IsCancellationRequested) { }
        catch(Exception) { if(!ct.IsCancellationRequested)Set(new(UpdatePhase.Offline,"Update-Prüfung derzeit nicht möglich. Die App bleibt nutzbar.")); }
        finally { Interlocked.Exchange(ref checking,0); }
    }
    public void PrepareRestart()
    {
        if(State.Phase!=UpdatePhase.Ready)throw new InvalidOperationException("Es ist kein geprüftes Update bereit.");
        client.PrepareRestart();
    }
}
