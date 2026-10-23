using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using RaidClipPlugin.Services;
using RaidClipPlugin.Models;
using RaidClipPlugin.Config;
if(args.Length!=1)throw new ArgumentException("Workspace path required.");
var root=Path.GetFullPath(args[0]);var options=new JsonSerializerOptions{WriteIndented=true,Converters={new JsonStringEnumConverter()}};
void Export(string id,List<RpgItem> items,List<RpgItemSet> sets,object? extra=null){
 foreach(var i in items){i.InstanceId="";i.FoundAt=DateTimeOffset.UnixEpoch;}
 var target=Path.Combine(root,"expansions",id);Directory.CreateDirectory(target);
 File.WriteAllText(Path.Combine(target,"catalog.json"),JsonSerializer.Serialize(new{schemaVersion=1,id,items,sets,materials=RpgUpgradeCatalog.Materials,upgrades=new RpgUpgradeConfig(),zones=new RpgZoneConfig()},options));
 var index=new StringBuilder($"# {id} – {items.Count} Gegenstände\n\nEinzelbilder sind im Ressourcenmanifest registriert. Bestehende Illustrationen werden beim Build niemals durch Platzhalter ersetzt.\n\n| ID | Name | Seltenheit | Platz | Set |\n|---|---|---|---|---|\n");
 foreach(var i in items)index.AppendLine($"| `{i.ItemId}` | {i.DisplayName} | {i.Rarity} | {i.Slot} | {i.SetId} |");
 File.WriteAllText(Path.Combine(target,"ITEMS.md"),index.ToString());
 var manifestPath=Path.Combine(root,"otter-ui","src",id+"-art.json");var manifest=System.Text.Json.Nodes.JsonNode.Parse(File.ReadAllText(manifestPath))!;
 foreach(var item in items){if(manifest[item.ItemId] is not {} entry)throw new InvalidDataException("Missing item artwork: "+item.ItemId);entry["name"]=item.DisplayName;var relative=entry["src"]!.GetValue<string>();if(!File.Exists(Path.Combine(root,"otter-ui","public",relative)))throw new InvalidDataException("Missing image asset: "+item.ItemId);}
 File.WriteAllText(manifestPath,manifest.ToJsonString(options));Console.WriteLine($"Validated {items.Count} {id} item images; preserved all illustrations.");
}
Export("tides",RpgTidesExpansion.Items(),RpgTidesExpansion.Sets());
Export("depths",RpgDepthsExpansion.Items(),RpgDepthsExpansion.Sets());
Export("eternal",RpgEternalCatalog.Items(),RpgEternalCatalog.Sets());
