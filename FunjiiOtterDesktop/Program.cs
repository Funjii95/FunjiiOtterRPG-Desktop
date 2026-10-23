namespace FunjiiOtterDesktop;

static class Program
{
    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main(string[] args)
    {
        Velopack.VelopackApp.Build().Run();
        if(args.Length==2 && args[0]=="--update-self-test")
        {
            try
            {
                var packages=Path.Combine(Path.GetTempPath(),"OtterUpdateProbe-"+Guid.NewGuid().ToString("N"));Directory.CreateDirectory(packages);
                var locator=new Velopack.Locators.TestVelopackLocator("FunjiiOtterRPGDesktop","0.0.1",packages);
                var manager=new Velopack.UpdateManager(new Velopack.Sources.GithubSource(VelopackUpdateClient.RepositoryUrl,null,false),new Velopack.UpdateOptions{ExplicitChannel="win"},locator);
                var update=manager.CheckForUpdatesAsync().GetAwaiter().GetResult()??throw new Exception("No GitHub update found.");
                manager.DownloadUpdatesAsync(update).GetAwaiter().GetResult();
                if(manager.UpdatePendingRestart==null)throw new Exception("Downloaded update not ready.");
                File.WriteAllText(args[1],$"PASS: public GitHub feed, newer release {update.TargetFullRelease.Version}, download and checksum verification, pending restart; no user installation changed");
            }
            catch(Exception ex){File.WriteAllText(args[1],ex.ToString());Environment.ExitCode=1;}
            return;
        }
        // To customize application configuration such as set high DPI settings or default font,
        // see https://aka.ms/applicationconfiguration.
        ApplicationConfiguration.Initialize();
        if(args.Length==2 && args[0]=="--connection-test")
        {
            try
            {
                using var gateway=new BackendGateway(DesktopSettings.ReadBackendUri(AppContext.BaseDirectory));
                var config=gateway.ConfigurationAsync().GetAwaiter().GetResult();
                File.WriteAllText(args[1],$"PASS: Windows HTTP client reached desktop backend; protocol={config.ProtocolVersion}; loginEnabled={config.Enabled}");
            }
            catch(Exception ex){File.WriteAllText(args[1],ex.ToString());Environment.ExitCode=1;}
            return;
        }
        Application.Run(new OtterWindow(args.Length == 2 && args[0] == "--smoke-test" ? args[1] : null));
    }    
}
