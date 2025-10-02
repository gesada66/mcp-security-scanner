"use client";

import { ThemeCard } from "@/components/theme/theme-card";
import { ThemeButton } from "@/components/theme/theme-button";

interface ReviewItem {
	id: string;
	label: string;
	value: string | string[] | undefined;
	onEdit: () => void;
}

interface ReviewCardProps {
	items: ReviewItem[];
	onConfirm: () => void;
	onStartOver: () => void;
}

export function ReviewCard({ items, onConfirm, onStartOver }: ReviewCardProps) {
	return (
		<ThemeCard variant="dark" title="Review your answers">
			<ul className="divide-y divide-slate-800">
				{items.map(item => (
					<li key={item.id} className="py-4 flex items-start justify-between gap-6">
						<div>
							<div className="text-sm text-white">{item.label}</div>
							<div className="font-semibold">
								{Array.isArray(item.value) ? item.value.join(", ") : (item.value ?? "—")}
							</div>
						</div>
						<ThemeButton variant="secondary" size="sm" onClick={item.onEdit}>
							Edit
						</ThemeButton>
					</li>
				))}
			</ul>
			<div className="flex justify-between mt-6">
				<ThemeButton variant="secondary" onClick={onStartOver}>
					Start Over
				</ThemeButton>
				<ThemeButton onClick={onConfirm}>Confirm & Apply</ThemeButton>
			</div>
		</ThemeCard>
	);
}
