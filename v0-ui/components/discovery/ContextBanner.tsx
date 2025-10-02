"use client";

import type { DiscoveryProfile } from "@/lib/discovery/types";

interface ContextBannerProps {
	profile: DiscoveryProfile;
}

export function ContextBanner({ profile }: ContextBannerProps) {
	const unknownNote = profile.hasUnknowns ? "Unknown answers treated conservatively." : null;
	return (
		<div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden">
			<div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black p-4">
				<div className="text-lg font-bold">Security Context</div>
				{unknownNote && <div className="text-gray-800">{unknownNote}</div>}
			</div>
			<div className="p-4 flex flex-wrap gap-2">
				<span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-900">
					Env: {profile.envType}
				</span>
				<span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-900">
					Sensitivity: {profile.dataSensitivity}
				</span>
				{profile.complianceContext.map(c => (
					<span key={c} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-900">
						{c.toUpperCase()}
					</span>
				))}
			</div>
		</div>
	);
}
