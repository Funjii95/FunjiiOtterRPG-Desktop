using FunjiiOtterDesktop;
public sealed class AppUpdaterTests
{
    [Fact] public async Task Automatically_downloads_but_does_not_interrupt_the_player()
    {
        var client=new FakeClient();var updater=new AppUpdater(client);await updater.CheckAsync();
        Assert.Equal(UpdatePhase.Ready,updater.State.Phase);Assert.Equal(1,client.Downloads);Assert.False(client.Restarted);
        updater.PrepareRestart();Assert.True(client.Restarted);
    }
    [Fact] public async Task Reuses_previously_verified_download_without_network()
    {
        var client=new FakeClient{PendingVersion="0.2.0"};var updater=new AppUpdater(client);await updater.CheckAsync();
        Assert.Equal(UpdatePhase.Ready,updater.State.Phase);Assert.Equal(0,client.Checks);Assert.Equal(0,client.Downloads);
    }
    [Fact] public async Task Offline_check_keeps_app_usable_and_can_retry()
    {
        var client=new FakeClient{Fail=true};var updater=new AppUpdater(client);await updater.CheckAsync();Assert.Equal(UpdatePhase.Offline,updater.State.Phase);
        client.Fail=false;await updater.CheckAsync();Assert.Equal(UpdatePhase.Ready,updater.State.Phase);
    }
    [Fact] public async Task Concurrent_checks_share_one_download()
    {
        var client=new FakeClient{Wait=new(TaskCreationOptions.RunContinuationsAsynchronously)};var updater=new AppUpdater(client);
        var first=updater.CheckAsync();await updater.CheckAsync();Assert.Equal(1,client.Checks);client.Wait.SetResult();await first;Assert.Equal(1,client.Downloads);
    }
    [Fact] public async Task Missing_installation_never_downloads_or_restarts()
    {
        var client=new FakeClient{IsInstalled=false};var updater=new AppUpdater(client);await updater.CheckAsync();Assert.Equal(UpdatePhase.Unmanaged,updater.State.Phase);Assert.Equal(0,client.Checks);Assert.Throws<InvalidOperationException>(()=>updater.PrepareRestart());
    }
    [Fact] public async Task Failed_or_cancelled_download_is_not_installable()
    {
        var client=new FakeClient{DownloadFails=true};var updater=new AppUpdater(client);await updater.CheckAsync();Assert.Equal(UpdatePhase.Offline,updater.State.Phase);Assert.Throws<InvalidOperationException>(()=>updater.PrepareRestart());
        using var cancellation=new CancellationTokenSource();cancellation.Cancel();await updater.CheckAsync(cancellation.Token);Assert.False(client.Restarted);
    }
    [Fact] public async Task Current_version_does_not_download()
    {
        var client=new FakeClient{Next=null};var updater=new AppUpdater(client);await updater.CheckAsync();Assert.Equal(UpdatePhase.Current,updater.State.Phase);Assert.Equal(0,client.Downloads);
    }
    private sealed class FakeClient:IDesktopUpdateClient
    {
        public bool IsInstalled{get;set;}=true;public string? PendingVersion{get;set;}
        public string? Next="0.2.0";public bool Fail,DownloadFails,Restarted;public int Checks,Downloads;public TaskCompletionSource? Wait;
        public async Task<string?> FindAsync(){Checks++;if(Fail)throw new IOException("offline");if(Wait!=null)await Wait.Task;return Next;}
        public Task DownloadAsync(Action<int> progress,CancellationToken ct){Downloads++;ct.ThrowIfCancellationRequested();if(DownloadFails)throw new IOException("checksum failed");progress(50);PendingVersion=Next;return Task.CompletedTask;}
        public void PrepareRestart()=>Restarted=true;
    }
}
