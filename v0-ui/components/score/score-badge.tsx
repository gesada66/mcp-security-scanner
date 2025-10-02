"use client";

import { Badge } from "@/components/ui/badge";

type SeverityVariant = "critical" | "high" | "medium" | "low";

export function ScoreBadge({ score }: { score: number }) {
	const variant: SeverityVariant = score >= 90 ? "low" : score >= 75 ? "medium" : score >= 60 ? "high" : "critical";
	const label = score >= 90 ? "Low" : score >= 75 ? "Moderate" : score >= 60 ? "High" : "Critical";
	return <Badge variant={variant}>{label}</Badge>;
}


