"use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeSection } from "@/components/theme/theme-section";
import { ThemeCard } from "@/components/theme/theme-card";
import { ThemeButton } from "@/components/theme/theme-button";
import { AnimatedInput } from "@/components/ui/animated-input";
import { useToast } from "@/hooks/use-toast";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { fetchFixturePayload, fetchTrojanServerFixture, fetchToolScopeFixture, fetchGraphFixture, fetchIdentityFixture, fetchMemoryFixture, type FixturePayload } from "@/adapters/fixture";
import { generateScorecard } from "@/lib/scoring";
import type { RiskFinding } from "@/lib/types";
import { ScoreBadge } from "@/components/score/score-badge";
import { ScoreGauge } from "@/components/score/score-gauge";
import { RiskTable } from "@/components/score/risk-table";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ContextBanner } from "@/components/discovery/ContextBanner";
import { DiscoveryWizard } from "@/components/discovery/DiscoveryWizard";
import type { DiscoveryProfile } from "@/lib/discovery/types";

export default function Page() {
	const prefersReducedMotion = useReducedMotion();
	const { toast } = useToast();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
const [score, setScore] = useState<number>(0);
const [distribution, setDistribution] = useState({ critical: 0, high: 0, medium: 0, low: 0 });
const [findings, setFindings] = useState<RiskFinding[]>([]);
const [envType, setEnvType] = useState<string>("production");
const [source, setSource] = useState<string>("/scorecard.json");
const [dataSensitivity, setDataSensitivity] = useState<string>("None");
const [complianceContext] = useState<string[]>([]);
const [copySuccess, setCopySuccess] = useState<boolean>(false);

	// NEW: discovery state + flag
	const DISCOVERY_ENABLED = process.env.NEXT_PUBLIC_DISCOVERY_WIZARD === "true";
	const [showWizard, setShowWizard] = useState(false);
	const [discoveryProfile, setDiscoveryProfile] = useState<DiscoveryProfile | null>(null);
	// Production state for MCP server scanning
	const [mcpServerUrl, setMcpServerUrl] = useState("");
	const [isScanning, setIsScanning] = useState(false);
	const [scanHistory, setScanHistory] = useState<Array<{url: string, timestamp: string, score: number}>>([]);

	useEffect(() => {
		let cancelled = false;
        (async () => {
			try {
				let payload: FixturePayload;
				
				// Handle threat fixtures with detection
				if (source.includes("/threat-fixtures/")) {
					if (source.includes("/trojan/")) {
						payload = await fetchTrojanServerFixture(source);
					} else if (source.includes("/privilege/")) {
						payload = await fetchToolScopeFixture(source);
					} else if (source.includes("/graph/")) {
						payload = await fetchGraphFixture(source);
					} else if (source.includes("/identity/")) {
						payload = await fetchIdentityFixture(source);
					} else if (source.includes("/memory/")) {
						payload = await fetchMemoryFixture(source);
					} else {
						payload = await fetchFixturePayload(source);
					}
				} else {
					payload = await fetchFixturePayload(source);
				}
				
                if (cancelled) return;
                const profile = discoveryProfile
					? {
						environmentType: discoveryProfile.envType,
						dataSensitivity: discoveryProfile.dataSensitivity,
						complianceContext: discoveryProfile.complianceContext,
					}
					: { environmentType: envType, dataSensitivity, complianceContext };
                const card = generateScorecard(payload.findings ?? [], profile);
                setScore(card.score);
                setDistribution(card.distribution);
                setFindings(card.prioritisedFindings);
			} catch (e) {
				if (cancelled) return;
				setError(e instanceof Error ? e.message : "Unknown error");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
        return () => { cancelled = true; };
    }, [envType, source, dataSensitivity, complianceContext, discoveryProfile]);

useMemo(() => score, [score]);

	return (
		<ThemeSection variant="hero">
			<div className="mx-auto max-w-6xl px-6 py-12">
                <motion.header 
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
					className="mb-12 text-center"
				>
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
							MCP Security Scorecard
						</h1>
						<ThemeToggle />
					</div>
					<p className="text-xl text-white mb-8">Comprehensive security assessment for Model Context Protocol deployments</p>
                    <div className="flex gap-4 justify-center">
                        <ThemeButton
                            variant="primary"
                            size="lg"
                            onClick={() => {
                                const payload = {
                                    profile: { environmentType: envType },
                                    score,
                                    distribution,
                                    findings,
                                };
                                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `mcp-scorecard-${envType}.json`;
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                URL.revokeObjectURL(url);
                            }}
                            aria-label="Export JSON"
                        >
                            Export Report
                        </ThemeButton>
                        <ThemeButton
                            variant="secondary"
                            size="lg"
                            onClick={async () => {
                                try {
                                    const payload = {
                                        profile: { environmentType: envType, dataSensitivity },
                                        score,
                                        distribution,
                                        findings,
                                        timestamp: new Date().toISOString(),
                                    };
                                    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                                    setCopySuccess(true);
                                    setTimeout(() => setCopySuccess(false), 2000);
                                } catch (err) {
                                    console.error("Failed to copy to clipboard:", err);
                                }
                            }}
                            aria-label="Copy JSON"
                        >
                            {copySuccess ? "Copied!" : "Copy JSON"}
                        </ThemeButton>
                        <ThemeButton 
                            variant="secondary" 
                            size="lg" 
                            aria-label="Export PDF" 
                            disabled
                            title="PDF export planned for v1.5"
                        >
                            Export PDF
                        </ThemeButton>
						<ThemeButton variant="secondary" size="lg">View Details</ThemeButton>

						{DISCOVERY_ENABLED && (
							<ThemeButton variant="secondary" size="lg" onClick={() => setShowWizard(true)}>
								{discoveryProfile ? "Update Context" : "Configure Context"}
							</ThemeButton>
						)}
						<ThemeButton 
							variant="secondary" 
							size="lg" 
							onClick={() => {
								// TODO: Implement scan history modal
								console.log("Show scan history");
							}}
						>
							Scan History
						</ThemeButton>
						<ThemeButton 
							variant="secondary" 
							size="lg" 
							onClick={() => { window.location.href = "/manage-targets"; }}
							aria-label="Manage Targets"
						>
							Manage Targets
						</ThemeButton>
					</div>
				</motion.header>

				{DISCOVERY_ENABLED && discoveryProfile && (
					<ContextBanner profile={discoveryProfile} />
				)}

				{loading && (
					<div className="mb-12 text-center text-white">Loading scorecard…</div>
				)}

				{error && (
					<div className="mb-12 text-center text-red-400">{error}</div>
				)}

                {!loading && !error && (
                <>
    <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<AnimatedInput
							label="Environment"
							value={envType}
							onChange={(e) => setEnvType(e.target.value)}
							className="min-w-[200px]"
						>
							<option value="development">Development</option>
							<option value="staging">Staging</option>
							<option value="production">Production</option>
						</AnimatedInput>
                    </div>
					<div className="flex items-center gap-3">
						<AnimatedInput
							label="Data Source"
							value={source}
							onChange={(e) => setSource(e.target.value)}
							className="min-w-[300px]"
						>
							<option value="/scorecard.json">Default Fixture</option>
							<option value="/input.mcp.json">Alt Fixture</option>
							<option value="/threat-fixtures/trojan/bad.json">Trojan Server (Bad)</option>
							<option value="/threat-fixtures/trojan/good.json">Vetted Server (Good)</option>
							<option value="/threat-fixtures/privilege/over.json">Over-Privileged Tools</option>
							<option value="/threat-fixtures/privilege/least.json">Least-Privilege Tools</option>
							<option value="/threat-fixtures/graph/exfil.json">Exfil Chain (Bad)</option>
							<option value="/threat-fixtures/graph/safe.json">Safe Graph (Good)</option>
							<option value="/threat-fixtures/identity/shared.json">Shared Identity (Bad)</option>
							<option value="/threat-fixtures/identity/ephemeral.json">Ephemeral Identity (Good)</option>
							<option value="/threat-fixtures/memory/open.json">Open Memory (Bad)</option>
							<option value="/threat-fixtures/memory/guarded.json">Guarded Memory (Good)</option>
						</AnimatedInput>
                    </div>
                    <div className="flex items-center gap-3">
                        <AnimatedInput
							label="Data Sensitivity"
							value={dataSensitivity}
							onChange={(e) => setDataSensitivity(e.target.value)}
							className="min-w-[200px]"
						>
							<option value="None">None</option>
							<option value="Internal">Internal</option>
							<option value="PII + Financial">PII + Financial</option>
							<option value="Health">Health</option>
						</AnimatedInput>
                    </div>
                </div>
                {/* MCP Server Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.1 }}
                    className="mb-8"
                >
                    <ThemeCard variant="dark" className="p-6">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">Scan MCP Server</h3>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <AnimatedInput
                                    label="MCP Server URL"
                                    value={mcpServerUrl}
                                    onChange={(e) => setMcpServerUrl(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <ThemeButton
                                variant="primary"
                                size="lg"
                                onClick={async () => {
                                    if (!mcpServerUrl.trim()) return;
                                    
                                    setIsScanning(true);
                                    try {
                                        // TODO: Implement actual MCP server scanning
                                        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate scan
                                        
                                        const scanScore = Math.floor(Math.random() * 100); // Placeholder
                                        
                                        // Add to scan history
                                        setScanHistory(prev => [...prev, {
                                            url: mcpServerUrl,
                                            timestamp: new Date().toISOString(),
                                            score: scanScore
                                        }]);
                                        
                                        // Show success toast
                                        toast({
                                            title: "Scan Complete",
                                            description: `Security score: ${scanScore}/100`,
                                            variant: scanScore > 80 ? "default" : scanScore > 60 ? "default" : "destructive"
                                        });
                                        
                                        // TODO: Update score and findings with real scan results
                                    } catch (error) {
                                        console.error("Scan failed:", error);
                                        toast({
                                            title: "Scan Failed",
                                            description: "Unable to connect to MCP server",
                                            variant: "destructive"
                                        });
                                    } finally {
                                        setIsScanning(false);
                                    }
                                }}
                                disabled={!mcpServerUrl.trim() || isScanning}
                                className="min-w-[140px]"
                            >
                                {isScanning ? "Scanning..." : "Scan Server"}
                            </ThemeButton>
                        </div>
                        {scanHistory.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Scans</h4>
                                <div className="space-y-2">
                                    {scanHistory.slice(-3).map((scan, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <span className="text-foreground truncate max-w-[300px]">{scan.url}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={scan.score > 80 ? "default" : "outline"}>
                                                    {scan.score}
                                                </Badge>
                                                <span className="text-muted-foreground">
                                                    {new Date(scan.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </ThemeCard>
                </motion.div>
				<motion.section 
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.2 }}
					className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3"
				>
                    <ThemeCard variant="dark" title="Overall Security Score">
                        <div className="flex items-end justify-between">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.5 }}
                                className="text-6xl font-bold text-yellow-400"
                                data-testid="overall-score"
                            >
                                {score}
                            </motion.div>
                            <div className="flex items-center gap-3">
                                <ScoreBadge score={score} />
                                <ScoreGauge score={score} />
                            </div>
                        </div>
                    </ThemeCard>

					<ThemeCard variant="dark" title="Risk Distribution">
						<ul className="space-y-4">
							<motion.li 
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.3 }}
								className="flex items-center justify-between"
							>
								<div className="flex items-center gap-3">
									<div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
									<span className="text-white font-medium">Critical</span>
								</div>
								<Badge variant="critical">{distribution.critical}</Badge>
							</motion.li>
							<motion.li 
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.4 }}
								className="flex items-center justify-between"
							>
								<div className="flex items-center gap-3">
									<div className="h-3 w-3 rounded-full bg-orange-500" />
									<span className="text-white font-medium">High</span>
								</div>
								<Badge variant="high">{distribution.high}</Badge>
							</motion.li>
							<motion.li 
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.5 }}
								className="flex items-center justify-between"
							>
								<div className="flex items-center gap-3">
									<div className="h-3 w-3 rounded-full bg-yellow-500" />
									<span className="text-white font-medium">Medium</span>
								</div>
								<Badge variant="medium">{distribution.medium}</Badge>
							</motion.li>
							<motion.li 
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.6 }}
								className="flex items-center justify-between"
							>
								<div className="flex items-center gap-3">
									<div className="h-3 w-3 rounded-full bg-green-500" />
									<span className="text-white font-medium">Low</span>
								</div>
								<Badge variant="low">{distribution.low}</Badge>
							</motion.li>
						</ul>
					</ThemeCard>

					<ThemeCard variant="dark" title="Environment Context">
						<dl className="grid grid-cols-1 gap-4">
							<motion.div 
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.7 }}
							>
								<dt className="text-white text-sm mb-1">Environment Type</dt>
								<dd className="text-white font-semibold">{discoveryProfile?.envType ?? "Production"}</dd>
							</motion.div>
							<motion.div 
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : 0.8 }}
							>
								<dt className="text-white text-sm mb-1">Data Sensitivity</dt>
								<dd className="text-white font-semibold">{discoveryProfile?.dataSensitivity ?? "PII + Financial"}</dd>
							</motion.div>
						</dl>
					</ThemeCard>
				</motion.section>

                <motion.section 
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.4 }}
					className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
				>
					<div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black p-6">
						<h2 className="text-2xl font-bold">Prioritised Security Findings</h2>
						<p className="text-gray-800 mt-2">Critical issues requiring immediate attention</p>
					</div>
                    <RiskTable findings={findings} />
				</motion.section>
				</>
				)}

				{showWizard && DISCOVERY_ENABLED && (
					<DiscoveryWizard
						onComplete={(profile) => {
							setDiscoveryProfile(profile);
							setShowWizard(false);
						}}
						onCancel={() => setShowWizard(false)}
					/>
				)}

			</div>
		</ThemeSection>
	);
}



