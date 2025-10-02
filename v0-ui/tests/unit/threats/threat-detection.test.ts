import { describe, it, expect } from "vitest";
import { detectTrojanServers, detectOverPrivilegedTools, detectExfilChains, detectIdentityIssues, detectThreats } from "@/lib/threats";
import type { MCPServerConfig, ToolScopeConfig, GraphConfig, IdentityConfig } from "@/lib/types";

describe("Threat Detection - Step 1 (Trojan Servers)", () => {
	describe("Trojan Server Detection", () => {
		it("detects integrity verification failure", () => {
			const config: MCPServerConfig = {
				server: {
					name: "test-server",
					source: "registry://trusted/test@1.0.0",
					expectedHash: "sha256:ABC123",
					actualHash: "sha256:DEF456",
					integrityVerified: false
				}
			};

			const findings = detectTrojanServers(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-001-TROJAN-INTEGRITY");
			expect(findings[0].severity).toBe("critical");
		});

		it("detects untrusted source", () => {
			const config: MCPServerConfig = {
				server: {
					name: "test-server",
					source: "https://unvetted.example/downloads/test.tgz",
					integrityVerified: true
				}
			};

			const findings = detectTrojanServers(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-002-TROJAN-SOURCE");
			expect(findings[0].severity).toBe("high");
		});

		it("detects suspicious egress", () => {
			const config: MCPServerConfig = {
				server: {
					name: "test-server",
					source: "registry://trusted/test@1.0.0",
					integrityVerified: true
				},
				network: {
					egressAllow: ["https://exfil.badhost.io/upload"]
				}
			};

			const findings = detectTrojanServers(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-003-TROJAN-EGRESS");
			expect(findings[0].severity).toBe("critical");
		});

		it("passes clean server", () => {
			const config: MCPServerConfig = {
				server: {
					name: "test-server",
					source: "registry://trusted/test@1.0.0",
					expectedHash: "sha256:ABC123",
					actualHash: "sha256:ABC123",
					integrityVerified: true
				},
				network: {
					egressAllow: ["https://api.trusted.vendor.com"]
				}
			};

			const findings = detectTrojanServers(config);
			expect(findings).toHaveLength(0);
		});
	});

	describe("Threat Detection Orchestrator", () => {
		it("handles trojan server detection", () => {
			const configs = {
				trojan: {
					server: {
						name: "test",
						source: "untrusted://test",
						integrityVerified: false
					}
				} as MCPServerConfig
			};

			const findings = detectThreats(configs);
			expect(findings.length).toBeGreaterThan(0);
			expect(findings.some(f => f.id === "MCP-001-TROJAN-INTEGRITY")).toBe(true);
		});
	});
});

describe("Threat Detection - Step 2 (Over-Privileged Tools)", () => {
	describe("Over-Privileged Tools Detection", () => {
		it("detects filesystem scope on non-filesystem tools", () => {
			const config: ToolScopeConfig = {
				tools: [
					{
						name: "calculator",
						scopes: ["filesystem", "compute"]
					}
				]
			};

			const findings = detectOverPrivilegedTools(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-004-PRIVILEGE-FILESYSTEM");
			expect(findings[0].severity).toBe("high");
		});

		it("detects mail scope on non-mail tools", () => {
			const config: ToolScopeConfig = {
				tools: [
					{
						name: "weather",
						scopes: ["mail", "api"]
					}
				]
			};

			const findings = detectOverPrivilegedTools(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-005-PRIVILEGE-MAIL");
			expect(findings[0].severity).toBe("medium");
		});

		it("detects excessive privileges in sensitive environment", () => {
			const config: ToolScopeConfig = {
				tools: [
					{
						name: "analytics",
						scopes: ["filesystem", "mail", "api", "database", "network"]
					}
				],
				sensitivity: "regulated"
			};

			const findings = detectOverPrivilegedTools(config);
			expect(findings.length).toBeGreaterThan(0);
			
			// Should detect filesystem scope on non-filesystem tool
			expect(findings.some(f => f.id === "MCP-004-PRIVILEGE-FILESYSTEM")).toBe(true);
			// Should detect mail scope on non-mail tool
			expect(findings.some(f => f.id === "MCP-005-PRIVILEGE-MAIL")).toBe(true);
			// Should detect excessive privileges in sensitive environment
			expect(findings.some(f => f.id === "MCP-006-PRIVILEGE-EXCESSIVE")).toBe(true);
		});

		it("passes legitimate tools with appropriate scopes", () => {
			const config: ToolScopeConfig = {
				tools: [
					{
						name: "file-manager",
						scopes: ["filesystem"]
					},
					{
						name: "email-client",
						scopes: ["mail"]
					}
				]
			};

			const findings = detectOverPrivilegedTools(config);
			expect(findings).toHaveLength(0);
		});

		it("handles privilege detection in orchestrator", () => {
			const configs = {
				privilege: {
					tools: [
						{
							name: "calculator",
							scopes: ["filesystem", "compute"]
						}
					]
				} as ToolScopeConfig
			};

			const findings = detectThreats(configs);
			expect(findings.length).toBeGreaterThan(0);
			expect(findings.some(f => f.id === "MCP-004-PRIVILEGE-FILESYSTEM")).toBe(true);
		});
	});
});

describe("Threat Detection - Step 3 (Exfil Chain Detection)", () => {
	describe("Exfil Chain Detection", () => {
		it("detects suspicious external sinks", () => {
			const config: GraphConfig = {
				graph: {
					nodes: ["user-input", "suspicious-sink"],
					edges: [["user-input", "suspicious-sink"]]
				},
				externalSinks: ["suspicious-sink", "unknown-external"]
			};

			const findings = detectExfilChains(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-007-EXFIL-SINKS");
			expect(findings[0].severity).toBe("critical");
		});

		it("detects untrusted nodes in graph", () => {
			const config: GraphConfig = {
				graph: {
					nodes: ["user-input", "untrusted-api", "trusted-sink"],
					edges: [["user-input", "untrusted-api"], ["untrusted-api", "trusted-sink"]]
				},
				trust: {
					"user-input": true,
					"untrusted-api": false,
					"trusted-sink": true
				}
			};

			const findings = detectExfilChains(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-008-EXFIL-UNTRUSTED");
			expect(findings[0].severity).toBe("high");
		});

		it("detects long data flow chains", () => {
			const config: GraphConfig = {
				graph: {
					nodes: ["start", "step1", "step2", "step3", "step4", "end"],
					edges: [
						["start", "step1"],
						["step1", "step2"],
						["step2", "step3"],
						["step3", "step4"],
						["step4", "end"]
					]
				}
			};

			const findings = detectExfilChains(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-009-EXFIL-CHAINS");
			expect(findings[0].severity).toBe("medium");
		});

		it("detects direct paths from sensitive nodes to external sinks", () => {
			const config: GraphConfig = {
				graph: {
					nodes: ["memory-store", "trusted-sink"],
					edges: [["memory-store", "trusted-sink"]]
				},
				externalSinks: ["trusted-sink"],
				trust: {
					"memory-store": true,
					"trusted-sink": true
				}
			};

			const findings = detectExfilChains(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-010-EXFIL-DIRECT");
			expect(findings[0].severity).toBe("critical");
		});

		it("detects multiple exfil issues in complex graph", () => {
			const config: GraphConfig = {
				graph: {
					nodes: ["user-input", "memory-store", "file-system", "untrusted-api", "suspicious-sink", "step1", "step2", "step3", "step4"],
					edges: [
						["user-input", "memory-store"],
						["memory-store", "file-system"],
						["file-system", "untrusted-api"],
						["untrusted-api", "suspicious-sink"],
						["memory-store", "step1"],
						["step1", "step2"],
						["step2", "step3"],
						["step3", "step4"]
					]
				},
				trust: {
					"user-input": true,
					"memory-store": true,
					"file-system": true,
					"untrusted-api": false,
					"suspicious-sink": false,
					"step1": true,
					"step2": true,
					"step3": true,
					"step4": true
				},
				externalSinks: ["suspicious-sink"]
			};

			const findings = detectExfilChains(config);
			expect(findings.length).toBeGreaterThanOrEqual(3);
			
			// Should detect suspicious sinks
			expect(findings.some(f => f.id === "MCP-007-EXFIL-SINKS")).toBe(true);
			// Should detect untrusted nodes
			expect(findings.some(f => f.id === "MCP-008-EXFIL-UNTRUSTED")).toBe(true);
			// Should detect long chains
			expect(findings.some(f => f.id === "MCP-009-EXFIL-CHAINS")).toBe(true);
			// Should detect direct paths
			expect(findings.some(f => f.id === "MCP-010-EXFIL-DIRECT")).toBe(true);
		});

		it("passes clean graph with no exfil issues", () => {
			const config: GraphConfig = {
				graph: {
					nodes: ["user-input", "memory-store", "trusted-api"],
					edges: [
						["user-input", "memory-store"],
						["memory-store", "trusted-api"]
					]
				},
				trust: {
					"user-input": true,
					"memory-store": true,
					"trusted-api": true
				},
				externalSinks: []
			};

			const findings = detectExfilChains(config);
			expect(findings).toHaveLength(0);
		});

		it("handles exfil detection in orchestrator", () => {
			const configs = {
				exfil: {
					graph: {
						nodes: ["memory-store", "suspicious-sink"],
						edges: [["memory-store", "suspicious-sink"]]
					},
					externalSinks: ["suspicious-sink"]
				} as GraphConfig
			};

			const findings = detectThreats(configs);
			expect(findings.length).toBeGreaterThan(0);
			expect(findings.some(f => f.id === "MCP-007-EXFIL-SINKS")).toBe(true);
		});
	});
});

describe("Threat Detection - Step 4 (Identity Issues Detection)", () => {
	describe("Identity Issues Detection", () => {
		it("detects shared authentication tokens", () => {
			const config: IdentityConfig = {
				auth: {
					tokens: [
						{
							id: "shared-token",
							ttlSeconds: 86400,
							usedBy: ["service-a", "service-b", "service-c"]
						}
					],
					rotationPolicyDays: 30
				}
			};

			const findings = detectIdentityIssues(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-011-IDENTITY-SHARED");
			expect(findings[0].severity).toBe("high");
		});

		it("detects long-lived tokens", () => {
			const config: IdentityConfig = {
				auth: {
					tokens: [
						{
							id: "long-token",
							ttlSeconds: 2592001, // 30+ days
							usedBy: ["service-a"]
						}
					],
					rotationPolicyDays: 30
				}
			};

			const findings = detectIdentityIssues(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-012-IDENTITY-LONG-LIVED");
			expect(findings[0].severity).toBe("medium");
		});

		it("detects very long-lived tokens", () => {
			const config: IdentityConfig = {
				auth: {
					tokens: [
						{
							id: "very-long-token",
							ttlSeconds: 31536001, // 1+ year
							usedBy: ["service-a"]
						}
					],
					rotationPolicyDays: 30
				}
			};

			const findings = detectIdentityIssues(config);
			expect(findings).toHaveLength(2); // Should detect both long-lived and very long-lived
			expect(findings.some(f => f.id === "MCP-013-IDENTITY-VERY-LONG-LIVED")).toBe(true);
			expect(findings.some(f => f.id === "MCP-012-IDENTITY-LONG-LIVED")).toBe(true);
		});

		it("detects weak rotation policy", () => {
			const config: IdentityConfig = {
				auth: {
					tokens: [
						{
							id: "token-1",
							ttlSeconds: 86400,
							usedBy: ["service-a"]
						}
					],
					rotationPolicyDays: 120
				}
			};

			const findings = detectIdentityIssues(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-014-IDENTITY-WEAK-ROTATION");
			expect(findings[0].severity).toBe("medium");
		});

		it("detects missing rotation policy", () => {
			const config: IdentityConfig = {
				auth: {
					tokens: [
						{
							id: "token-1",
							ttlSeconds: 86400,
							usedBy: ["service-a"]
						}
					]
				}
			};

			const findings = detectIdentityIssues(config);
			expect(findings).toHaveLength(1);
			expect(findings[0].id).toBe("MCP-015-IDENTITY-NO-ROTATION");
			expect(findings[0].severity).toBe("high");
		});

		it("detects excessive token usage", () => {
			const config: IdentityConfig = {
				auth: {
					tokens: [
						{
							id: "overused-token",
							ttlSeconds: 86400,
							usedBy: ["service-a", "service-b", "service-c", "service-d", "service-e"]
						}
					],
					rotationPolicyDays: 30
				}
			};

			const findings = detectIdentityIssues(config);
			expect(findings).toHaveLength(2); // Should detect both shared and excessive usage
			expect(findings.some(f => f.id === "MCP-016-IDENTITY-EXCESSIVE-USAGE")).toBe(true);
			expect(findings.some(f => f.id === "MCP-011-IDENTITY-SHARED")).toBe(true);
		});

		it("detects multiple identity issues in complex config", () => {
			const config: IdentityConfig = {
				auth: {
					tokens: [
						{
							id: "shared-long-token",
							ttlSeconds: 31536001, // 1+ year
							usedBy: ["service-a", "service-b", "service-c", "service-d", "service-e"]
						}
					],
					rotationPolicyDays: 120
				}
			};

			const findings = detectIdentityIssues(config);
			expect(findings.length).toBeGreaterThanOrEqual(4);
			
			// Should detect shared token
			expect(findings.some(f => f.id === "MCP-011-IDENTITY-SHARED")).toBe(true);
			// Should detect very long-lived token
			expect(findings.some(f => f.id === "MCP-013-IDENTITY-VERY-LONG-LIVED")).toBe(true);
			// Should detect weak rotation policy
			expect(findings.some(f => f.id === "MCP-014-IDENTITY-WEAK-ROTATION")).toBe(true);
			// Should detect excessive usage
			expect(findings.some(f => f.id === "MCP-016-IDENTITY-EXCESSIVE-USAGE")).toBe(true);
		});

		it("passes clean identity configuration", () => {
			const config: IdentityConfig = {
				auth: {
					tokens: [
						{
							id: "ephemeral-token-1",
							ttlSeconds: 3600,
							usedBy: ["service-a"]
						},
						{
							id: "ephemeral-token-2",
							ttlSeconds: 1800,
							usedBy: ["service-b"]
						}
					],
					rotationPolicyDays: 7
				}
			};

			const findings = detectIdentityIssues(config);
			expect(findings).toHaveLength(0);
		});

		it("handles identity detection in orchestrator", () => {
			const configs = {
				identity: {
					auth: {
						tokens: [
							{
								id: "shared-token",
								ttlSeconds: 86400,
								usedBy: ["service-a", "service-b"]
							}
						]
					}
				} as IdentityConfig
			};

			const findings = detectThreats(configs);
			expect(findings.length).toBeGreaterThan(0);
			expect(findings.some(f => f.id === "MCP-011-IDENTITY-SHARED")).toBe(true);
		});
	});
});
