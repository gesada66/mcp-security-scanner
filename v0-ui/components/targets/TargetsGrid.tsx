"use client";

import React from "react";
import { listTargets, deleteTarget, getTarget, saveTarget } from "@/lib/targetsStore";
import type { Target } from "@/lib/targets.schema";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TargetCard } from "./TargetCard";
import { useToast } from "@/hooks/use-toast";

export function TargetsGrid() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [targets, setTargets] = React.useState<import("@/lib/targets.schema").Target[]>([]);
  const { toast } = useToast();

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await listTargets();
      setTargets(data);
      setError(null);
    } catch {
      setError("Unable to load targets. IndexedDB may be unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      await load();
    })();
    const onUpdated = () => { if (mounted) load(); };
    window.addEventListener("targets:updated", onUpdated);
    return () => { mounted = false; window.removeEventListener("targets:updated", onUpdated); };
  }, [load]);

  async function handleDelete(id: string) {
    await deleteTarget(id);
    window.dispatchEvent(new Event("targets:updated"));
  }

  function handleEdit(id: string) {
    window.dispatchEvent(new CustomEvent<string>("targets:edit", { detail: id }));
  }

  async function handleTest(id: string) {
    // Mock connectivity test: mark as connected and update timestamp
    const t = await getTarget(id);
    if (!t) return;
    const updated: Target = { ...t, status: "connected", updatedAt: Date.now() } as Target;
    await saveTarget(updated as Target);
    toast({ title: "Connection successful", description: `${t.name} is reachable` });
    window.dispatchEvent(new Event("targets:updated"));
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="targets-loading">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-1/2" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div role="status" aria-live="polite" className="rounded-md border p-4 text-sm" data-testid="targets-error">
        {error} <button className="underline" onClick={() => location.reload()}>Reload</button>
      </div>
    );
  }

  if (!targets.length) {
    return (
      <div className="flex items-center justify-center py-20" data-testid="targets-empty">
        <div className="text-center text-sm text-muted-foreground">
          <p>No targets yet — click Add Target to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="targets-grid">
      {targets.map(t => (
        <TargetCard
          key={t.id}
          target={t}
          onEdit={() => handleEdit(t.id)}
          onDelete={() => handleDelete(t.id)}
          onTest={() => handleTest(t.id)}
        />
      ))}
    </div>
  );
}