"use client";

import React from "react";
import { z } from "zod";
import { getTarget, saveTarget } from "@/lib/targetsStore";
import type { Target } from "@/lib/targets.schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DraftKey = (id: string) => `targets:draft:${id}`;

const TargetDraftSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1, "Name is required"),
    type: z.enum(["mcp", "agent", "connector"]),
    env: z.enum(["dev", "staging", "prod"]),
    endpoint: z.string().url("Endpoint must be a valid URL"),
    credentialAlias: z.string().min(1, "Credential alias is required"),
    ownerTeam: z.string().min(1, "Owner team is required"),
    ownerEmail: z.string().email("Owner email must be valid"),
});

export type TargetDraft = z.infer<typeof TargetDraftSchema>;

export function TargetForm(props: { initialId?: string; onClose?: () => void; onSaved?: (draft: TargetDraft) => void }) {
    const initialId = props.initialId ?? "new";
    const [values, setValues] = React.useState<TargetDraft>(() => {
        const raw = typeof window !== "undefined" ? localStorage.getItem(DraftKey(initialId)) : null;
        if (raw) {
            try { return JSON.parse(raw) as TargetDraft; } catch {}
        }
        return {
            id: initialId,
            name: "",
            type: "mcp",
            env: "dev",
            endpoint: "",
            credentialAlias: "",
            ownerTeam: "",
            ownerEmail: "",
        };
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [saving, setSaving] = React.useState(false);
    const [savedAt, setSavedAt] = React.useState<number | null>(null);

    // Autosave draft
    React.useEffect(() => {
        const t = setTimeout(() => {
            try {
                localStorage.setItem(DraftKey(values.id), JSON.stringify(values));
                setSavedAt(Date.now());
            } catch {}
        }, 300);
        return () => clearTimeout(t);
    }, [values]);

    function set<K extends keyof TargetDraft>(key: K, val: TargetDraft[K]) {
        setValues(v => ({ ...v, [key]: val }));
    }

    React.useEffect(() => {
        // Prefill from store when editing
        (async () => {
            if (!props.initialId) return;
            const t = await getTarget(props.initialId);
            if (!t) return;
            setValues(v => ({
                id: t.id,
                name: t.name ?? v.name,
                type: t.type ?? v.type,
                env: t.env ?? v.env,
                endpoint: t.endpoint ?? v.endpoint,
                credentialAlias: t.credentialAlias ?? v.credentialAlias,
                ownerTeam: t.owner?.team ?? v.ownerTeam,
                ownerEmail: t.owner?.email ?? v.ownerEmail,
            }));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.initialId]);

    function validate(): boolean {
        const r = TargetDraftSchema.safeParse(values);
        if (r.success) { setErrors({}); return true; }
        const map: Record<string, string> = {};
        for (const issue of r.error.issues) {
            const k = issue.path[0] as string;
            if (!map[k]) map[k] = issue.message;
        }
        setErrors(map);
        return false;
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        try {
            const now = Date.now();
            const target: Target = {
                id: values.id === "new" ? `${values.name.toLowerCase().replace(/\s+/g, "-")}-${now}` : values.id,
                type: values.type,
                name: values.name,
                endpoint: values.endpoint,
                env: values.env,
                sensitivity: "none",
                authMethod: "unknown",
                credentialAlias: values.credentialAlias,
                tags: [],
                owner: { team: values.ownerTeam, email: values.ownerEmail },
                compliance: [],
                scan: { includeInBatch: true, frequency: "manual" },
                status: "pending",
                createdAt: now,
                updatedAt: now,
                source: "manual",
            };
            await saveTarget(target);
            window.dispatchEvent(new Event("targets:updated"));
            props.onSaved?.(values);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Card className="p-4" data-testid="target-form">
            <form onSubmit={handleSave} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-medium">Add Target</h2>
                    <div className="text-xs text-muted-foreground" aria-live="polite">
                        {saving ? "Saving…" : savedAt ? `All changes saved ${new Date(savedAt).toLocaleTimeString()}` : ""}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium" htmlFor="target-name">Name</label>
                        <input id="target-name" className="mt-1 w-full rounded-md border px-3 py-2"
                            value={values.name}
                            onChange={e => set("name", e.target.value)} />
                        {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name}</p> : null}
                    </div>
                    <div>
                        <label className="text-sm font-medium" htmlFor="target-type">Type</label>
                        <select id="target-type" className="mt-1 w-full rounded-md border px-3 py-2"
                            value={values.type}
                            onChange={e => set("type", e.target.value as TargetDraft["type"])}>
                            <option value="mcp">mcp</option>
                            <option value="agent">agent</option>
                            <option value="connector">connector</option>
                        </select>
                        {errors.type ? <p className="mt-1 text-xs text-destructive">{errors.type}</p> : null}
                    </div>

                    <div>
                        <label className="text-sm font-medium" htmlFor="target-env">Environment</label>
                        <select id="target-env" className="mt-1 w-full rounded-md border px-3 py-2"
                            value={values.env}
                            onChange={e => set("env", e.target.value as TargetDraft["env"])}>
                            <option value="dev">dev</option>
                            <option value="staging">staging</option>
                            <option value="prod">prod</option>
                        </select>
                        {errors.env ? <p className="mt-1 text-xs text-destructive">{errors.env}</p> : null}
                    </div>
                    <div>
                        <label className="text-sm font-medium" htmlFor="target-endpoint">Endpoint</label>
                        <input id="target-endpoint" className="mt-1 w-full rounded-md border px-3 py-2"
                            value={values.endpoint}
                            onChange={e => set("endpoint", e.target.value)} />
                        {errors.endpoint ? <p className="mt-1 text-xs text-destructive">{errors.endpoint}</p> : null}
                    </div>

                    <div>
                        <label className="text-sm font-medium" htmlFor="target-credential-alias">Credential Alias</label>
                        <input id="target-credential-alias" className="mt-1 w-full rounded-md border px-3 py-2"
                            value={values.credentialAlias}
                            onChange={e => set("credentialAlias", e.target.value)} />
                        {errors.credentialAlias ? <p className="mt-1 text-xs text-destructive">{errors.credentialAlias}</p> : null}
                    </div>
                    <div>
                        <label className="text-sm font-medium" htmlFor="target-owner-team">Owner Team</label>
                        <input id="target-owner-team" className="mt-1 w-full rounded-md border px-3 py-2"
                            value={values.ownerTeam}
                            onChange={e => set("ownerTeam", e.target.value)} />
                        {errors.ownerTeam ? <p className="mt-1 text-xs text-destructive">{errors.ownerTeam}</p> : null}
                    </div>

                    <div>
                        <label className="text-sm font-medium" htmlFor="target-owner-email">Owner Email</label>
                        <input id="target-owner-email" className="mt-1 w-full rounded-md border px-3 py-2"
                            value={values.ownerEmail}
                            onChange={e => set("ownerEmail", e.target.value)} />
                        {errors.ownerEmail ? <p className="mt-1 text-xs text-destructive">{errors.ownerEmail}</p> : null}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={props.onClose} data-testid="form-cancel-btn">Cancel</Button>
                    <Button type="submit" data-testid="form-save-btn">Save</Button>
                </div>
            </form>
        </Card>
    );
}


