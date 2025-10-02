"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ScoreGauge({ score }: { score: number }) {
	const prefersReducedMotion = useReducedMotion();
	return (
		<div className="w-full max-w-[220px]">
			<div className="mb-3 flex items-center justify-between text-sm text-white">
				<span>Risk Level</span>
				<span className="text-white font-medium">{score}</span>
			</div>
			<div className="h-3 w-full overflow-hidden rounded-full bg-gray-700">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${score}%` }}
					transition={{ duration: prefersReducedMotion ? 0 : 1 }}
					className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300"
				/>
			</div>
		</div>
	);
}


