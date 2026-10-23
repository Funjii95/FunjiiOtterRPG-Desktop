using System.Security;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using RaidClipPlugin.Services;
using RaidClipPlugin.Models;

if(args.Length!=1)throw new ArgumentException("Workspace path required.");
var root=Path.GetFullPath(args[0]);
var items=RpgTidesExpansion.Items();
foreach(var item in items){item.InstanceId="";item.FoundAt=DateTimeOffset.UnixEpoch;}
var json=new JsonSerializerOptions{WriteIndented=true,Converters={new JsonStringEnumConverter()}};
var target=Path.Combine(root,"expansions","tides");Directory.CreateDirectory(target);
File.WriteAllText(Path.Combine(target,"catalog.json"),JsonSerializer.Serialize(new{schemaVersion=1,id="tides",items,sets=RpgTidesExpansion.Sets()},json));
var assets=Path.Combine(root,"otter-ui","public","items","tides");Directory.CreateDirectory(assets);
var art=new Dictionary<string,object>();var index=new StringBuilder("# Gezeiten-Erweiterung – 66 Gegenstände\n\nAlle Einzelgrafiken sind beschriftete Platzhalter. Die Übersicht dient als Designreferenz.\n\n| ID | Name | Seltenheit | Platz | Set |\n|---|---|---|---|---|\n");
foreach(var i in items)
{
    var color=i.Rarity switch{ItemRarity.Uncommon=>"#22c55e",ItemRarity.Rare=>"#3b82f6",ItemRarity.Epic=>"#a855f7",_=>"#eab308"};
    var shape=i.Slot switch
    {
        EquipmentSlot.Helmet=>"<path d='M65 135Q65 60 128 60Q191 60 191 135L166 146V105H90V146Z'/>",
        EquipmentSlot.Chest=>"<path d='M80 66L105 56Q128 84 151 56L176 66L199 105L170 120V175H86V120L57 105Z'/>",
        EquipmentSlot.Gloves=>"<path d='M90 170L66 119L73 110L93 129V76Q100 65 108 76V110V61Q116 50 124 61V110V65Q132 54 140 65V110V80Q148 69 156 80V137L142 170Z'/>",
        EquipmentSlot.Boots=>"<path d='M89 59H153L146 136L185 151V176H80L83 145Z'/>",
        EquipmentSlot.Ring1=>"<circle cx='128' cy='127' r='45' fill='none' stroke-width='14'/><path d='M106 82L117 62H139L150 82L128 103Z'/>",
        _=>"<path d='M80 58Q80 130 128 155Q176 130 176 58' fill='none'/><path d='M128 126L153 159L128 187L103 159Z'/>"
    };
    var label=SecurityElement.Escape(i.DisplayName);
    var svg=$"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'><title>{label} – Platzhalter</title><rect width='256' height='256' rx='20' fill='#071526'/><rect x='6' y='6' width='244' height='244' rx='16' fill='none' stroke='{color}' stroke-width='3'/><g fill='{color}' stroke='{color}' stroke-width='5' stroke-linejoin='round'>{shape}</g><text x='128' y='211' text-anchor='middle' fill='#fff' font-family='sans-serif' font-size='11' textLength='224' lengthAdjust='spacingAndGlyphs'>{label}</text><text x='128' y='235' text-anchor='middle' fill='{color}' font-family='sans-serif' font-size='10'>PLATZHALTER · {i.Rarity}</text></svg>";
    File.WriteAllText(Path.Combine(assets,i.ItemId+".svg"),svg);
    art[i.ItemId]=new{src="./items/tides/"+i.ItemId+".svg",name=i.DisplayName,width=256,height=256,sourceSha256="",assetSha256=Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(Encoding.UTF8.GetBytes(svg))).ToLowerInvariant()};
    index.AppendLine($"| `{i.ItemId}` | {i.DisplayName} | {i.Rarity} | {i.Slot} | {i.SetId} |");
}
File.WriteAllText(Path.Combine(root,"otter-ui","src","tides-art.json"),JsonSerializer.Serialize(art,json));
File.WriteAllText(Path.Combine(target,"ITEMS.md"),index.ToString());
Console.WriteLine($"Exported {items.Count} definitions, {RpgTidesExpansion.Sets().Count} sets and {art.Count} individual placeholder icons.");
var depths=RpgDepthsExpansion.Items();foreach(var item in depths){item.InstanceId="";item.FoundAt=DateTimeOffset.UnixEpoch;}
var depthTarget=Path.Combine(root,"expansions","depths");Directory.CreateDirectory(depthTarget);
File.WriteAllText(Path.Combine(depthTarget,"catalog.json"),JsonSerializer.Serialize(new{schemaVersion=1,id="depths",items=depths,sets=RpgDepthsExpansion.Sets(),materials=RpgUpgradeCatalog.Materials,upgrades=new RaidClipPlugin.Config.RpgUpgradeConfig()},json));
var depthIndex=new StringBuilder("# Tiefen-Erweiterung\n\n54 neue Ausrüstungsteile, elf stapelbare Materialien, sechs neue Sets.\n\n| ID | Name | Seltenheit | Platz | Set |\n|---|---|---|---|---|\n");
foreach(var item in depths)depthIndex.AppendLine($"| `{item.ItemId}` | {item.DisplayName} | {item.Rarity} | {item.Slot} | {item.SetId} |");
foreach(var material in RpgUpgradeCatalog.Materials)depthIndex.AppendLine($"| `{material.Id}` | {material.Name} | {material.Rarity} | Material | — |");
File.WriteAllText(Path.Combine(depthTarget,"ITEMS.md"),depthIndex.ToString());
var manifestPath=Path.Combine(root,"otter-ui","src","depths-art.json");var manifest=System.Text.Json.Nodes.JsonNode.Parse(File.ReadAllText(manifestPath))!;
foreach(var item in depths)manifest[item.ItemId]!["name"]=item.DisplayName;
foreach(var material in RpgUpgradeCatalog.Materials)manifest[material.Id]!["name"]=material.Name;
foreach(var item in RpgEquipmentCatalog.Items().Concat(RpgLootExpansionCatalog.Items()))if(manifest[item.ItemId] is {} entry)entry["name"]=item.DisplayName;
File.WriteAllText(manifestPath,manifest.ToJsonString(json));
Console.WriteLine($"Exported {depths.Count} depth items, 11 materials and 6 sets with supplied artwork.");
