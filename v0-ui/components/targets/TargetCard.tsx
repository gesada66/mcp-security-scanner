"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Target } from "@/lib/targets.schema";
import { runStaticScan } from "@/lib/scanRunner";
import { saveTarget } from "@/lib/targetsStore";

function truncateMiddle(s: string, max = 40) {
  if (s.length <= max) return s;
  const half = Math.floor((max - 3) / 2);
  return s.slice(0, half) + "..." + s.slice(-half);
}

export function TargetCard({ target, onEdit, onDelete, onTest }: { target: Target; onEdit?: () => void; onDelete?: () => void; onTest?: () => void; }) {
  const statusVariant: "default" | "outline" =
    target.status === "connected" ? "default" : "outline";
  const [busy, setBusy] = React.useState(false);
  const [scanInfo, setScanInfo] = React.useState<{ findings: number; score: number } | null>(
    target.lastStaticScan ? { findings: target.lastStaticScan.findingsCount, score: target.lastStaticScan.score } : null
  );

  async function handleRunScan() {
    setBusy(true);
    try {
      const outcome = await runStaticScan({ endpoint: target.endpoint, name: target.name });
      if (outcome.ok) {
        const findingsCount = Array.isArray(outcome.result.findings) ? outcome.result.findings.length : 0;
        const score = outcome.result.score;
        setScanInfo({ findings: findingsCount, score });
        await saveTarget({ ...target, lastStaticScan: { findingsCount, score }, updatedAt: Date.now() });
        window.dispatchEvent(new Event("targets:updated"));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-4" data-testid={`target-card-${target.id}`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="truncate text-base font-medium" title={target.name}>{target.name}</h2>
        <Badge variant={statusVariant} aria-live="polite">{target.status}</Badge>
      </div>

      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Badge variant="outline">{target.type}</Badge>
        <Badge variant="outline">{target.env}</Badge>
        <Badge variant="outline">{target.sensitivity}</Badge>
        {target.compliance?.slice(0, 2).map((c: string) => <Badge key={c} variant="outline">{c}</Badge>)}
      </div>

      <div className="mt-3 text-sm">
        <div className="truncate" title={target.endpoint}>Endpoint: {truncateMiddle(target.endpoint)}</div>
        <div>Owner: {target.owner?.team} • {target.owner?.email}</div>
        {target.updatedAt ? <div className="text-muted-foreground text-xs mt-1">Last update: {new Date(target.updatedAt).toUTCString()}</div> : null}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" size="sm" data-testid="test-connection-btn" onClick={onTest}>Test</Button>
        <Button variant="secondary" size="sm" data-testid="edit-target-btn" onClick={onEdit}>Edit</Button>
        <Button variant="secondary" size="sm" onClick={handleRunScan} disabled={busy} data-testid="run-scan-btn">Run Scan</Button>
        <Button variant="outline" size="sm" data-testid="delete-target-btn" onClick={onDelete}>Delete</Button>
      </div>

      {scanInfo ? (
        <div className="mt-3 text-sm" aria-live="polite">
          <div>Static findings: {scanInfo.findings}</div>
          <div>Score: {scanInfo.score}</div>
        </div>
      ) : null}
    </Card>
  );
}