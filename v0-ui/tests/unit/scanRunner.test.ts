import { describe, it, expect } from "vitest";
import { runStaticScan } from "@/lib/scanRunner";

describe("runStaticScan", () => {
  it("returns deterministic findings and score for minimal canonical config", async () => {
    const cfg = {
      name: "Imported MCP",
      endpoint: "http://localhost:3001",
      sensitivity: "internal",
      tools: [{ name: "t1" }],
    } as const;

    const first = await runStaticScan(cfg);
    const second = await runStaticScan(cfg);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok) {
      // Basic shape checks
      expect(Array.isArray(first.result.findings)).toBe(true);
      expect(typeof first.result.score).toBe("number");
      // Determinism: same inputs → same outputs
      expect(first.result.score).toBe(second.result.score);
      expect(JSON.stringify(first.result.findings)).toBe(
        JSON.stringify(second.result.findings)
      );
    }
  });

  it("gracefully handles bad input", async () => {
    const outcome = await runStaticScan(null as unknown as Record<string, unknown>);
    // Either ok with defaults or explicit error, but never throw
    expect("ok" in outcome).toBe(true);
  });
});


