import { createStore, get, set, del, keys } from "idb-keyval";
import type { Target } from "./targets.schema";
import { TargetsExport, TargetsExportSchema } from "./targets.schema";

const STORE_NAME = "mcp_targets_v1";
const STORE = createStore(STORE_NAME, "kv");

export async function listTargets(): Promise<Target[]> {
  const ids = await keys(STORE);
  const entries = await Promise.all(ids.map(id => get<Target>(id as string, STORE)));
  return entries.filter(Boolean) as Target[];
}

export async function getTarget(id: string): Promise<Target | undefined> {
  return get<Target>(id, STORE);
}

export async function saveTarget(target: Target): Promise<void> {
  await set(target.id, { ...target, updatedAt: Date.now() }, STORE);
}

export async function deleteTarget(id: string): Promise<void> {
  await del(id, STORE);
}

export function exportTargets(targets: Target[]): TargetsExport {
  return { schemaVersion: 1, targets };
}

export function importTargetsReplace(payload: unknown): Target[] {
  const parsed = TargetsExportSchema.parse(payload);
  return parsed.targets;
}

export function importTargetsMerge(existing: Target[], payload: unknown): Target[] {
  const parsed = TargetsExportSchema.parse(payload);
  const map = new Map(existing.map(t => [t.id, t]));
  for (const t of parsed.targets) map.set(t.id, t);
  return Array.from(map.values());
}