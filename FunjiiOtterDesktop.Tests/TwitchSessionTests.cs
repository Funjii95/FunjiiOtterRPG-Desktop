using System.Net;
using System.Text;
using System.Text.Json;
using FunjiiOtterDesktop;
public sealed class TwitchSessionTests:IDisposable
{
 private readonly string root=Path.Combine(Path.GetTempPath(),"otter-session-tests-"+Guid.NewGuid().ToString("N"));
 private const string Client="syntheticclient12345";
 private static TwitchPlayer Player()=>new("1001","Synthetic Otter","synthetic-access",Client,"synthetic-refresh&+=");
 private string FilePath=>Path.Combine(root,"twitch-session.dpapi");
 private static HttpResponseMessage Json(object value,HttpStatusCode status=HttpStatusCode.OK)=>new(status){Content=new StringContent(JsonSerializer.Serialize(value),Encoding.UTF8,"application/json")};
 private sealed class Handler(Func<HttpRequestMessage,Task<HttpResponseMessage>> send):HttpMessageHandler{protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage r,CancellationToken c)=>send(r);}
 private static HttpResponseMessage Valid(HttpRequestMessage r,string user="1001")=>r.RequestUri!.AbsolutePath.EndsWith("validate")?Json(new{user_id=user,client_id=Client,login="synthetic"}):Json(new{data=new[]{new{display_name="Synthetic Otter"}}});
 [Fact]public async Task Restart_restores_only_encrypted_windows_user_credentials()
 {
  var store=new TwitchSessionStore(root);store.Save(Player());var bytes=await File.ReadAllBytesAsync(FilePath);Assert.DoesNotContain(Player().AccessToken,Encoding.UTF8.GetString(bytes));Assert.DoesNotContain(Player().RefreshToken,Encoding.UTF8.GetString(bytes));
  using var login=new TwitchLogin(new Handler(r=>Task.FromResult(Valid(r))));var restored=await new TwitchSession(new TwitchSessionStore(root),login).RestoreAsync(Client,default);Assert.Equal(Player(),restored);
 }
 [Fact]public async Task Expired_access_refreshes_without_client_secret_and_persists_rotation()
 {
  var store=new TwitchSessionStore(root);store.Save(Player());string? form=null;
  using var login=new TwitchLogin(new Handler(async r=>{if(r.RequestUri!.AbsolutePath.EndsWith("token")){form=await r.Content!.ReadAsStringAsync();return Json(new{access_token="new-access",refresh_token="new-refresh"});}if(r.Headers.Authorization?.Parameter=="synthetic-access")return Json(new{},HttpStatusCode.Unauthorized);return Valid(r);}));
  var restored=await new TwitchSession(store,login).RestoreAsync(Client,default);Assert.Equal("new-access",restored!.AccessToken);Assert.Equal("new-refresh",new TwitchSessionStore(root).Load(Client)!.RefreshToken);Assert.Contains("grant_type=refresh_token",form);Assert.Contains("refresh_token=synthetic-refresh%26%2B%3D",form);Assert.DoesNotContain("client_secret",form);
 }
 [Fact]public async Task Rotation_survives_network_failure_during_subsequent_validation()
 {
  var store=new TwitchSessionStore(root);store.Save(Player());
  using var login=new TwitchLogin(new Handler(r=>Task.FromResult(r.RequestUri!.AbsolutePath.EndsWith("token")?Json(new{access_token="new-access",refresh_token="new-refresh"}):r.Headers.Authorization?.Parameter=="synthetic-access"?Json(new{},HttpStatusCode.Unauthorized):Json(new{},HttpStatusCode.ServiceUnavailable))));
  await Assert.ThrowsAsync<HttpRequestException>(()=>new TwitchSession(store,login).RestoreAsync(Client,default));Assert.Equal("new-refresh",new TwitchSessionStore(root).Load(Client)!.RefreshToken);
 }
 [Fact]public async Task Revoked_refresh_is_removed_and_never_trusted_as_identity()
 {
  var store=new TwitchSessionStore(root);store.Save(Player());using var login=new TwitchLogin(new Handler(r=>Task.FromResult(Json(new{},r.RequestUri!.AbsolutePath.EndsWith("token")?HttpStatusCode.BadRequest:HttpStatusCode.Unauthorized))));Assert.Null(await new TwitchSession(store,login).RestoreAsync(Client,default));Assert.False(File.Exists(FilePath));
 }
 [Fact]public async Task Transient_outage_preserves_session_for_the_next_attempt()
 {
  var store=new TwitchSessionStore(root);store.Save(Player());var before=await File.ReadAllBytesAsync(FilePath);using var unavailable=new TwitchLogin(new Handler(r=>Task.FromResult(Json(new{},HttpStatusCode.ServiceUnavailable))));await Assert.ThrowsAsync<HttpRequestException>(()=>new TwitchSession(store,unavailable).RestoreAsync(Client,default));Assert.Equal(before,await File.ReadAllBytesAsync(FilePath));using var retry=new TwitchLogin(new Handler(r=>Task.FromResult(Valid(r))));Assert.NotNull(await new TwitchSession(store,retry).RestoreAsync(Client,default));
 }
 [Fact]public async Task Logout_removes_remembered_login_and_restart_stays_logged_out()
 {
  var store=new TwitchSessionStore(root);store.Save(Player());using var login=new TwitchLogin(new Handler(r=>throw new Exception("Logged-out restore must not contact Twitch.")));var session=new TwitchSession(store,login);await session.ClearAsync(default);Assert.False(File.Exists(FilePath));Assert.Null(await session.RestoreAsync(Client,default));
 }
 [Fact]public async Task A_different_verified_user_cannot_reuse_the_saved_identity()
 {
  var store=new TwitchSessionStore(root);store.Save(Player());using var login=new TwitchLogin(new Handler(r=>Task.FromResult(Valid(r,"1002"))));Assert.Null(await new TwitchSession(store,login).RestoreAsync(Client,default));Assert.False(File.Exists(FilePath));
 }
 [Fact]public void Corrupted_or_wrong_client_session_never_logs_anyone_in()
 {
  var store=new TwitchSessionStore(root);store.Save(Player());Assert.Null(store.Load("otherclient12345"));File.WriteAllText(FilePath,"damaged protected bytes");Assert.Null(store.Load(Client));
 }
 [Fact]public async Task Concurrent_windows_rotate_the_public_refresh_token_only_once()
 {
  var store=new TwitchSessionStore(root);store.Save(Player());int refreshes=0;
  using var login=new TwitchLogin(new Handler(async r=>{if(r.RequestUri!.AbsolutePath.EndsWith("token")){Interlocked.Increment(ref refreshes);await Task.Delay(50);return Json(new{access_token="new-access",refresh_token="new-refresh"});}if(r.Headers.Authorization?.Parameter=="synthetic-access")return Json(new{},HttpStatusCode.Unauthorized);return Valid(r);}));
  var results=await Task.WhenAll(new TwitchSession(store,login).RestoreAsync(Client,default),new TwitchSession(new TwitchSessionStore(root),login).RestoreAsync(Client,default));Assert.Equal(1,refreshes);Assert.All(results,p=>Assert.Equal("new-access",p!.AccessToken));
 }
 public void Dispose(){if(Directory.Exists(root))Directory.Delete(root,true);}
}
