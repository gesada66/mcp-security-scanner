"use client";

import { Badge } from "@/components/ui/badge";
import type { RiskSeverity } from "@/lib/types";

export function RiskSeverityBadge({ severity }: { severity: RiskSeverity }) {
	const label = severity.charAt(0).toUpperCase() + severity.slice(1);
	return <Badge variant={severity}>{label}</Badge>;
}


