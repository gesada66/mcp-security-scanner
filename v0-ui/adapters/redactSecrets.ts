export function redactSecrets<T = unknown>(obj: T): T {
    const SENSITIVE = /(token|secret|password|api[_-]?key|private[_-]?key|client[_-]?secret|bearer|access[_-]?token|refresh[_-]?token)/i;
    const seen = new WeakSet<object>();
    const MAX_DEPTH = 64;
    function walk(v: unknown, depth = 0): unknown {
      if (depth > MAX_DEPTH) return null;
      if (Array.isArray(v)) return v.map((x: unknown) => walk(x, depth + 1));
      if (v && typeof v === "object") {
        if (seen.has(v as object)) return null;
        seen.add(v as object);
        const out: Record<string, unknown> = {};
        for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
          if (k === "__proto__" || k === "prototype" || k === "constructor") continue;
          if (SENSITIVE.test(k) || (typeof val === "string" && SENSITIVE.test(val))) {
            out[k] = "REDACTED";
          } else {
            out[k] = walk(val, depth + 1);
          }
        }
        return out;
      }
      return v;
    }
    return walk(obj) as T;
  }

export function redactSecretsWithMeta<T = unknown>(obj: T): { data: T; redactions: number } {
    let count = 0;
    const SENSITIVE = /(token|secret|password|api[_-]?key|private[_-]?key|client[_-]?secret|bearer|access[_-]?token|refresh[_-]?token)/i;
    const seen = new WeakSet<object>();
    const MAX_DEPTH = 64;
    function walk(v: unknown, depth = 0): unknown {
      if (depth > MAX_DEPTH) return null;
      if (Array.isArray(v)) return v.map((x: unknown) => walk(x, depth + 1));
      if (v && typeof v === "object") {
        if (seen.has(v as object)) return null;
        seen.add(v as object);
        const out: Record<string, unknown> = {};
        for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
          if (k === "__proto__" || k === "prototype" || k === "constructor") continue;
          if (SENSITIVE.test(k) || (typeof val === "string" && SENSITIVE.test(val))) {
            count++;
            out[k] = "REDACTED";
          } else {
            out[k] = walk(val, depth + 1);
          }
        }
        return out;
      }
      return v;
    }
    return { data: walk(obj) as T, redactions: count };
  }