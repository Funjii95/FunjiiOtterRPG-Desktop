import {describe,it,expect,vi} from 'vitest';
import {formParty} from '../src/partyFormation';
import type {RpgDataSource} from '../src/types';
describe('party formation role selection',()=>{
 it('saves the chosen combat role before accepting an invitation',async()=>{
  const readPlugin=vi.fn().mockResolvedValueOnce({}).mockResolvedValueOnce({snapshot:{}});
  await formParty({readPlugin} as unknown as RpgDataSource,'accept','healer',{invitationId:'invite'});
  expect(readPlugin.mock.calls).toEqual([['selectRole',{role:'healer'}],['party',{operation:'accept',invitationId:'invite'}]]);
 });
 it('does not join if the server refuses a role change during combat',async()=>{
  const readPlugin=vi.fn().mockRejectedValue(Error('Kampf läuft'));
  await expect(formParty({readPlugin} as unknown as RpgDataSource,'create','tank')).rejects.toThrow('Kampf läuft');
  expect(readPlugin).toHaveBeenCalledTimes(1);
 });
 it('requires an explicit role choice',async()=>{
  const readPlugin=vi.fn();
  await expect(formParty({readPlugin} as unknown as RpgDataSource,'create','')).rejects.toThrow('Gruppenrolle wählen');
  expect(readPlugin).not.toHaveBeenCalled();
 });
});
