import { describe, it, expect } from "vitest";
import { theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

describe("theme constants", () => {
    it("exposes expected color keys", () => {
        expect(Object.keys(theme.colors).sort()).toEqual([
            "background",
            "critical",
            "high",
            "low",
            "medium",
            "muted",
            "primary",
            "secondary",
            "text",
        ].sort());
    });

    it("has numeric animation duration and easing string", () => {
        expect(typeof theme.animations.duration).toBe("number");
        expect(theme.animations.duration).toBeGreaterThan(0);
        expect(typeof theme.animations.easing).toBe("string");
        expect(theme.animations.easing.length).toBeGreaterThan(0);
    });
});

describe("cn utility", () => {
    it("merges conditional class names", () => {
        const result = cn("px-2", ["py-1"], { hidden: false, block: true });
        expect(result).toContain("px-2");
        expect(result).toContain("py-1");
        expect(result).toContain("block");
        expect(result).not.toContain("hidden");
    });

    it("applies tailwind-merge semantics (last wins)", () => {
        const result = cn("p-2", "p-4");
        // tailwind-merge should keep the latest padding class
        expect(result.includes("p-4")).toBe(true);
        expect(result.includes("p-2")).toBe(false);
    });
});


