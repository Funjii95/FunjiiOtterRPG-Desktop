using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace FunjiiOtterDesktop;
internal sealed record BackendConfiguration(bool Enabled,string? ClientId,string ChannelId,int ProtocolVersion);
internal sealed record GatewayRequest(string Id,string Path,string Method,string? Body,string? Session);
internal sealed record GatewayReply(string Id,int Status,string Body,string? Error=null);
internal sealed class BackendGateway : IDisposable
{
 private readonly HttpClient http;
 internal Uri BaseUri {get;}
 internal BackendGateway(Uri baseUri,HttpMessageHandler? handler=null)
 {
  BaseUri=baseUri;http=new HttpClient(handler??new HttpClientHandler{AllowAutoRedirect=false}){Timeout=TimeSpan.FromSeconds(12),MaxResponseContentBufferSize=4*1024*1024};
 }
 internal async Task<BackendConfiguration> ConfigurationAsync(CancellationToken ct=default)
 {
  using var response=await http.GetAsync(new Uri(BaseUri,"/api/v1/desktop/config"),ct);response.EnsureSuccessStatusCode();
  var value=await response.Content.ReadFromJsonAsync<BackendConfiguration>(ct)??throw new InvalidOperationException("Backend-Konfiguration fehlt.");
  if(value.ProtocolVersion!=1 || !Regex.IsMatch(value.ChannelId,"^[0-9]{1,25}$") || value.Enabled && (value.ClientId==null || !Regex.IsMatch(value.ClientId,"^[a-zA-Z0-9]{10,100}$")))throw new InvalidOperationException("Desktop-Konfiguration des Backends ist ungültig.");
  return value;
 }
 internal static bool Allowed(GatewayRequest request)=>Regex.IsMatch(request.Id,"^[a-zA-Z0-9-]{1,64}$") &&
  ((request.Method=="GET" && (request.Path is "/api/v1/me" or "/api/v1/play/state" or "/api/v1/play/privacy/deletion" || Regex.IsMatch(request.Path,"^/api/v1/play/actions/[0-9a-fA-F-]{36}$"))) ||
   (request.Method=="POST" && request.Path is "/api/v1/play/actions" or "/api/v1/play/privacy/deletion")) &&
  (request.Body==null || Encoding.UTF8.GetByteCount(request.Body)<=4096) && (string.IsNullOrEmpty(request.Session)||Guid.TryParse(request.Session,out _));
 internal async Task<GatewayReply> SendAsync(GatewayRequest request,TwitchPlayer? player,CancellationToken ct=default)
 {
  if(!Allowed(request))return new(request.Id,400,"{}","Ungültige Spielanfrage.");
  if(player==null)return new(request.Id,401,"{}");
  using var message=new HttpRequestMessage(new HttpMethod(request.Method),new Uri(BaseUri,request.Path));
  message.Headers.Authorization=new AuthenticationHeaderValue("Desktop",player.AccessToken);
  if(!string.IsNullOrEmpty(request.Session))message.Headers.Add("X-Rpg-Session",request.Session);
  if(request.Method=="POST")message.Content=new StringContent(request.Body??"{}",Encoding.UTF8,"application/json");
  try{using var response=await http.SendAsync(message,ct);return new(request.Id,(int)response.StatusCode,await response.Content.ReadAsStringAsync(ct));}
  catch(Exception ex) when(ex is HttpRequestException or OperationCanceledException){return new(request.Id,503,"{}","Backend derzeit nicht erreichbar. Eine offene Aktion wird mit derselben ID geprüft.");}
 }
 public void Dispose()=>http.Dispose();
}
