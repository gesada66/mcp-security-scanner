"use client";

import React from "react";
import { listTargets, exportTargets, importTargetsMerge, saveTarget } from "@/lib/targetsStore";
import type { Target } from "@/lib/targets.schema";
import { TargetsGrid } from "@/components/targets/TargetsGrid";
import { TargetForm } from "@/components/targets/TargetForm";
import { Button } from "@/components/ui/button";
import { ThemeButton } from "@/components/theme/theme-button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { Info } from "lucide-react";

export default function ManageTargetsPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const onEdit = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setEditId(id);
      setShowForm(true);
    };
    window.addEventListener("targets:edit", onEdit as EventListener);
    return () => window.removeEventListener("targets:edit", onEdit as EventListener);
  }, []);

  async function handleExport() {
    const targets = await listTargets();
    const payload = exportTargets(targets as Target[]);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "targets.export.v1.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleImport(file: File) {
    const text = await file.text();
    const json = JSON.parse(text);
    const existing = await listTargets();
    const merged = importTargetsMerge(existing as Target[], json);
    for (const t of merged) await saveTarget(t as Target);
    window.dispatchEvent(new Event("targets:updated"));
  }
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Manage Targets</h1>
          <span
            role="tooltip"
            aria-label="Add, edit, or configure servers and agents included in security assessments."
            title="Add, edit, or configure servers and agents included in security assessments."
            className="inline-flex items-center text-muted-foreground"
          >
            <Info className="h-4 w-4" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeButton variant="secondary" onClick={() => { window.location.href = "/"; }} aria-label="Back">Back</ThemeButton>
          <label className="inline-flex">
            <input type="file" accept="application/json" className="hidden" onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
            }} />
            <Button asChild variant="secondary" data-testid="import-btn"><span tabIndex={0}>Import</span></Button>
          </label>
          <Button data-testid="add-target-btn" onClick={() => { setEditId(undefined); setShowForm(true); }}>+ Add Target</Button>
          <Button variant="secondary" data-testid="export-btn" onClick={handleExport}>Export</Button>
        </div>
      </div>

      <Separator className="my-4" />
      {showForm ? (
        <TargetForm initialId={editId} onClose={() => setShowForm(false)} onSaved={() => setShowForm(false)} />
      ) : (
        <TargetsGrid />
      )}
      <Toaster />
    </div>
  );
}