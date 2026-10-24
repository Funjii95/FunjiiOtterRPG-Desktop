using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
namespace FunjiiOtterDesktop;
internal sealed class TwitchSessionStore(string directory)
{
 private readonly string path=Path.Combine(directory,"twitch-session.dpapi");
 private static readonly byte[] Entropy=SHA256.HashData(Encoding.UTF8.GetBytes("FunjiiOtterDesktop|WindowsUser|Session|v1"));
 internal async Task<FileStream> AcquireAsync(CancellationToken ct)
 {
  Directory.CreateDirectory(directory);using var deadline=CancellationTokenSource.CreateLinkedTokenSource(ct);deadline.CancelAfter(TimeSpan.FromSeconds(90));
  while(true){deadline.Token.ThrowIfCancellationRequested();try{return new FileStream(path+".lock",FileMode.OpenOrCreate,FileAccess.ReadWrite,FileShare.None);}catch(IOException){await Task.Delay(150,deadline.Token);}}
 }
 internal TwitchPlayer? Load(string clientId)
 {
  if(!File.Exists(path))return null;
  try{if(new FileInfo(path).Length>65536)return null;var plain=ProtectedData.Unprotect(File.ReadAllBytes(path),Entropy,DataProtectionScope.CurrentUser);try{var p=JsonSerializer.Deserialize<TwitchPlayer>(plain);return p!=null&&Valid(p)&&p.ClientId==clientId?p:null;}finally{CryptographicOperations.ZeroMemory(plain);}}
  catch(Exception e) when(e is IOException or UnauthorizedAccessException or CryptographicException or JsonException){return null;}
 }
 internal void Save(TwitchPlayer player)
 {
  if(!Valid(player))throw new InvalidDataException("Ungültige gespeicherte Twitch-Anmeldung.");Directory.CreateDirectory(directory);
  var plain=JsonSerializer.SerializeToUtf8Bytes(player);byte[] encrypted;try{encrypted=ProtectedData.Protect(plain,Entropy,DataProtectionScope.CurrentUser);}finally{CryptographicOperations.ZeroMemory(plain);}
  var temp=path+"."+Guid.NewGuid().ToString("N")+".tmp";try{using(var file=new FileStream(temp,FileMode.CreateNew,FileAccess.Write,FileShare.None,4096,FileOptions.WriteThrough)){file.Write(encrypted);file.Flush(true);}File.Move(temp,path,true);}finally{if(File.Exists(temp))File.Delete(temp);}
 }
 internal void Clear(){if(File.Exists(path))File.Delete(path);}
 private static bool Valid(TwitchPlayer p)=>p.UserId is {Length:>0 and <=25}&&System.Text.RegularExpressions.Regex.IsMatch(p.UserId,"^[0-9]+$")&&p.ClientId is {Length:>=10 and <=100}&&System.Text.RegularExpressions.Regex.IsMatch(p.ClientId,"^[a-zA-Z0-9]+$")&&p.AccessToken is {Length:>0 and <=4096}&&p.RefreshToken is {Length:<=4096}&&p.DisplayName is {Length:>0 and <=200};
}
internal sealed class TwitchSession(TwitchSessionStore store,TwitchLogin login)
{
 internal async Task<TwitchPlayer?> RestoreAsync(string clientId,CancellationToken ct)
 {
  using var held=await store.AcquireAsync(ct);var saved=store.Load(clientId);if(saved==null)return null;
  try{var verified=await login.ResumeAsync(saved,store.Save,ct);store.Save(verified);return verified;}
  catch(UnauthorizedAccessException){store.Clear();return null;}
 }
 internal async Task SaveAsync(TwitchPlayer player,CancellationToken ct){using var held=await store.AcquireAsync(ct);store.Save(player);}
 internal async Task ClearAsync(CancellationToken ct){using var held=await store.AcquireAsync(ct);store.Clear();}
}
