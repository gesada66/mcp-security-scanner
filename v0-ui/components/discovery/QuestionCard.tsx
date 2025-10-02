"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { DiscoveryQuestion } from "@/lib/discovery/types";
import { ThemeCard } from "@/components/theme/theme-card";
import { ThemeButton } from "@/components/theme/theme-button";
import { cn } from "@/lib/utils";
import { useId } from "react";

interface QuestionCardProps {
	question: DiscoveryQuestion;
	value?: string | string[];
	onChange: (value: string | string[]) => void;
	onNext: () => void;
	onBack: () => void;
	canGoBack: boolean;
	canGoNext: boolean;
	stepInfo: { current: number; total: number };
}

export function QuestionCard({
	question,
	value,
	onChange,
	onNext,
	onBack,
	canGoBack,
	canGoNext,
	stepInfo,
}: QuestionCardProps) {
	const prefersReducedMotion = useReducedMotion();
	const headingId = useId();

	const isSelected = (v: string) =>
		Array.isArray(value) ? value.includes(v) : value === v;

	const toggleMulti = (v: string) => {
		if (!Array.isArray(value)) return onChange([v]);
		const next = isSelected(v) ? value.filter(x => x !== v) : [...value, v];
		onChange(next);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
			className="max-w-2xl mx-auto w-full"
			role="region"
			aria-labelledby={headingId}
		>
			<ThemeCard variant="dark">
				<div className="mb-4">
					<div className="text-sm text-white" aria-live="polite">
						Step {stepInfo.current} of {stepInfo.total}
					</div>
					<h2 id={headingId} className="text-2xl font-semibold mt-2">
						{question.title}
					</h2>
					{question.explanation && (
						<p className="text-white mt-1">{question.explanation}</p>
					)}
				</div>

				<div
					className={cn("space-y-3")}
					role={question.multiple ? "group" : "radiogroup"}
					aria-labelledby={headingId}
				>
					{question.options.map(opt => (
						<button
							key={opt.value}
							type="button"
							onClick={() =>
								question.multiple
									? toggleMulti(opt.value)
									: onChange(opt.value)
							}
							className={cn(
								"w-full text-left rounded-lg border p-4 transition-colors",
								isSelected(opt.value)
									? "border-yellow-400 bg-yellow-400/10"
									: "border-slate-800 bg-slate-900 hover:bg-slate-800"
							)}
							aria-pressed={isSelected(opt.value)}
						>
							<div className="font-medium">{opt.label}</div>
							{opt.description && (
								<div className="text-sm text-white">{opt.description}</div>
							)}
						</button>
					))}
				</div>

				<div className="flex justify-between mt-8">
					<ThemeButton variant="secondary" onClick={onBack} disabled={!canGoBack}>
						Back
					</ThemeButton>
					<ThemeButton onClick={onNext} disabled={!canGoNext}>
						Next
					</ThemeButton>
				</div>
			</ThemeCard>
		</motion.div>
	);
}
