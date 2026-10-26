import type {InventoryItem} from './types';

export const isCollectionItem = (item: InventoryItem): boolean =>
  !item.slot && (item.kind === 'Treasure' || item.collector != null);

export function collectionGroups(items: InventoryItem[]) {
  const groups = new Map<string, InventoryItem[]>();
  for (const item of items.filter(isCollectionItem)) {
    const group = groups.get(item.itemId) ?? [];
    group.push(item);
    groups.set(item.itemId, group);
  }
  return [...groups.values()];
}
