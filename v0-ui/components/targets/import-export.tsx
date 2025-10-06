"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { parseMcpJsonWithMeta } from "@/adapters/parseMcpJson";
import { parse as parseYaml } from "yaml";
import { saveTarget } from "@/lib/targetsStore";
import { Target } from "@/lib/targets.schema";
import { runStaticScan } from "@/lib/scanRunner";

type PreviewState = {
  filename: string;
  redactions: number;
  unknownKeys: string[];
  canonical: Record<string, unknown>;
};

export function ImportExport() {
  const [preview, setPreview] = React.useState<PreviewState | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  function handleOpenModal() {
    setError(null);
    setPreview(null);
    setOpenModal(true);
  }

  async function handleFile(file: File) {
    try {
      setOpenModal(true);
      const text = await file.text();
      const isYaml = /\.(ya?ml)$/i.test(file.name);
      const { config, redactions, unknownKeys } = isYaml
        ? (() => {
            const obj = parseYaml(text);
            return parseMcpJsonWithMeta(JSON.stringify(obj));
          })()
        : parseMcpJsonWithMeta(text);
      setPreview({ filename: file.name, redactions, unknownKeys, canonical: config });
      setError(null);
    } catch (e: unknown) {
      const err = e as { message?: string };
      setPreview(null);
      setError(`Failed to parse ${file.name}: ${err?.message ?? String(e)}`);
    }
  }

  async function handleConfirm() {
    if (!preview) return;
    setBusy(true);
    try {
      const now = Date.now();
      const t: Target = {
        id: crypto.randomUUID(),
        type: "mcp",
        name: String(preview.canonical.name ?? "Imported MCP"),
        endpoint: String(preview.canonical.endpoint ?? "http://localhost"),
        env: "dev",
        sensitivity: "internal",
        authMethod: "unknown",
        credentialAlias: String(preview.canonical.credentialAlias ?? "alias-required"),
        tags: [],
        owner: { team: "unknown", email: "owner@example.com" },
        compliance: [],
        scan: { includeInBatch: true, frequency: "manual" },
        status: "pending",
        createdAt: now,
        updatedAt: now,
        source: "config-import",
        sourceFiles: [preview.filename],
      };
      await saveTarget(t);
      window.dispatchEvent(new Event("targets:updated"));

      // Optional immediate static scan
      const outcome = await runStaticScan(preview.canonical);
      if (outcome.ok) {
        const { result } = outcome;
        await saveTarget({ ...t, lastStaticScan: { findingsCount: Array.isArray(result.findings) ? result.findings.length : 0, score: result.score }, updatedAt: Date.now(), status: "connected" } as Target);
        window.dispatchEvent(new Event("targets:updated"));
      }
      setPreview(null);
      setOpenModal(false);
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err?.message ?? "Failed to save imported target");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.yaml,.yml,application/json,application/x-yaml,text/yaml"
        className="hidden"
        id="mcp-import-file"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />

      <ImportMenu onImportMcp={handleOpenModal} />
      <Button variant="secondary" data-testid="open-import-dialog" tabIndex={-1} onClick={handleOpenModal}>Import MCP Config</Button>

      {openModal ? (
        <div role="dialog" aria-modal="true" data-testid="import-dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg p-4" role="document">
            <h2 className="text-base font-semibold">Import MCP Config</h2>
            {preview ? (
              <p className="mt-1 text-sm text-muted-foreground">{preview.filename}</p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">Select a JSON or YAML file to preview redactions.</p>
            )}
            <Separator className="my-3" />
            {preview ? (
              <div className="space-y-2 text-sm">
                <div aria-label="Secrets redacted"><strong>Secrets redacted:</strong> {preview.redactions}</div>
                {preview.unknownKeys.length ? (
                  <div>
                    <strong>Unknown keys:</strong>
                    <ul className="list-inside list-disc">
                      {preview.unknownKeys.map(k => (<li key={k}>{k}</li>))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>
                <Button data-testid="choose-file-btn" onClick={() => fileInputRef.current?.click()}>Choose file</Button>
              </div>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { setOpenModal(false); setPreview(null); }} disabled={busy}>Cancel</Button>
              <Button onClick={handleConfirm} disabled={busy || !preview}>Confirm & Save</Button>
            </div>
          </Card>
        </div>
      ) : null}

      {error ? (
        <div role="alert" className="ml-3 text-sm text-red-500">{error}</div>
      ) : null}
    </div>
  );
}

function ImportMenu({ onImportMcp }: { onImportMcp: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" data-testid="import-btn" tabIndex={-1}>Import</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onImportMcp} aria-label="Import MCP Config" data-testid="import-mcp-menuitem">
          Import MCP Config
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


