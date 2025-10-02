"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import type { RiskFinding } from "@/lib/types";
import { RiskSeverityBadge } from "./risk-severity-badge";

export function RiskTable({ findings }: { findings: RiskFinding[] }) {
	const prefersReducedMotion = useReducedMotion();
	if (!findings?.length) {
		return (
			<div className="text-center text-white py-8" role="status" aria-live="polite">
				No findings detected for the current profile.
			</div>
		);
	}
	return (
		<div className="overflow-x-auto">
			<Table>
				<THead>
					<TR className="bg-gray-900">
						<TH className="text-white">Finding</TH>
						<TH className="text-white">Severity</TH>
						<TH className="text-white">Rationale</TH>
						<TH className="text-white">Remediation</TH>
					</TR>
				</THead>
				<TBody>
					{findings.map((f, i) => (
						<motion.tr
							key={f.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.5 + i * 0.1 }}
							className="transition-colors"
						>
							<TD className="font-semibold text-white">{f.title}</TD>
							<TD>
								<RiskSeverityBadge severity={f.severity} />
							</TD>
							<TD className="text-white">{f.rationale ?? "—"}</TD>
							<TD className="text-white">{f.remediation ?? "—"}</TD>
						</motion.tr>
					))}
				</TBody>
			</Table>
		</div>
	);
}


