"use client";

import { useEffect, useMemo, useState } from "react";
import type { DiscoveryAnswers, DiscoveryQuestion, DiscoverySchema, DiscoveryProfile } from "@/lib/discovery/types";
import { QuestionCard } from "./QuestionCard";
import { ReviewCard } from "./ReviewCard";
import { ThemeSection } from "@/components/theme/theme-section";
import { mapAnswersToProfile } from "@/lib/profile/map";

interface DiscoveryWizardProps {
	onComplete: (profile: DiscoveryProfile) => void;
	onCancel: () => void;
	initialAnswers?: DiscoveryAnswers;
}

export function DiscoveryWizard({ onComplete, onCancel, initialAnswers }: DiscoveryWizardProps) {
	const [schema, setSchema] = useState<DiscoverySchema | null>(null);
	const [step, setStep] = useState<number>(0);
	const [answers, setAnswers] = useState<DiscoveryAnswers>(initialAnswers ?? {});
	const [review, setReview] = useState<boolean>(false);
	const [wasInReview, setWasInReview] = useState<boolean>(false);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			const res = await fetch("/discovery-questions.json");
			const data = (await res.json()) as DiscoverySchema;
			if (!cancelled) setSchema({
				questions: data.questions.map(q => ({
					...q,
					options: q.options.map(o => ({ ...o, id: o.value }))
				}))
			});
		})();
		return () => { cancelled = true; };
	}, []);

	const questions: DiscoveryQuestion[] = useMemo(() => schema?.questions ?? [], [schema]);
	const total = questions.length + 1; // +1 for review

	const current = questions[step];

	const setValue = (id: string, value: string | string[]) => {
		setAnswers(prev => ({
			...prev,
			[id]: value
		}));
	};

	const canGoNext = (): boolean => {
		if (review) return true;
		if (!current) return false;
		if (!current.required) return true;
		const v = (answers as DiscoveryAnswers)[current.id];
		if (current.multiple) return Array.isArray(v) && v.length > 0;
		return typeof v === "string" && v.length > 0;
	};

	const goNext = () => {
		if (review) return onComplete(mapAnswersToProfile(answers));
		
		// If we were in review mode (editing), go back to review after any step
		if (wasInReview) {
			setReview(true);
			setWasInReview(false);
			return;
		}
		
		if (step < questions.length - 1) {
			setStep(s => s + 1);
		} else {
			// Normal flow - go to review for the first time
			setReview(true);
		}
	};

	const goBack = () => {
		if (review) return setReview(false);
		if (step > 0) setStep(s => s - 1);
		else onCancel();
	};

	const startOver = () => {
		setAnswers({});
		setStep(0);
		setReview(false);
	};

	const getLabelForValue = (questionId: string, value: string | string[] | undefined): string => {
		if (!value) return "—";
		const question = questions.find(q => q.id === questionId);
		if (!question) return String(value);
		
		if (Array.isArray(value)) {
			return value.map(v => {
				const option = question.options.find(o => o.id === v);
				return option?.label || v;
			}).join(", ");
		} else {
			const option = question.options.find(o => o.id === value);
			return option?.label || value;
		}
	};

	if (!schema) return null;

	return (
		<ThemeSection variant="hero" className="fixed inset-0 z-50 overflow-y-auto">
			<div className="mx-auto max-w-6xl px-6 py-12">
				<div className="flex justify-end mb-4">
					<button className="text-white underline" onClick={onCancel} aria-label="Close wizard">
						Close
					</button>
				</div>

				{!review && current && (
					<QuestionCard
						question={current}
						value={(answers as DiscoveryAnswers)[current.id]}
						onChange={(v) => setValue(current.id, v)}
						onNext={goNext}
						onBack={goBack}
						canGoBack={true}
						canGoNext={canGoNext()}
						stepInfo={{ current: step + 1, total }}
					/>
				)}

				{review && (
					<div className="max-w-2xl mx-auto">
						<ReviewCard
							items={[
								{ id: "env", label: "Environment", value: getLabelForValue("env", answers.env), onEdit: () => { setReview(false); setWasInReview(true); setStep(0); } },
								{ id: "sensitivity", label: "Data Sensitivity", value: getLabelForValue("sensitivity", answers.sensitivity), onEdit: () => { setReview(false); setWasInReview(true); setStep(1); } },
								{ id: "exposure", label: "External Exposure", value: getLabelForValue("exposure", answers.exposure), onEdit: () => { setReview(false); setWasInReview(true); setStep(2); } },
								{ id: "auth", label: "Authentication", value: getLabelForValue("auth", answers.auth), onEdit: () => { setReview(false); setWasInReview(true); setStep(3); } },
								{ id: "compliance", label: "Compliance", value: getLabelForValue("compliance", answers.compliance), onEdit: () => { setReview(false); setWasInReview(true); setStep(4); } }
							]}
							onConfirm={goNext}
							onStartOver={startOver}
						/>
					</div>
				)}
			</div>
		</ThemeSection>
	);
}
