import type {RpgDataSource} from './types';
import type {CombatRole} from './RolePanel';

export async function formParty(source:RpgDataSource,operation:'create'|'accept',role:CombatRole|'',extra:Record<string,string>={}) {
 if(!source.readPlugin)throw Error('Gruppen sind noch nicht verfügbar.');
 if(!['tank','healer','damage'].includes(role))throw Error('Bitte zuerst deine Gruppenrolle wählen.');
 // Wait for the authoritative role change, including combat restrictions, before joining.
 await source.readPlugin('selectRole',{role});
 return source.readPlugin('party',{operation,...extra});
}
