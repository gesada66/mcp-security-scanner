import type { RiskFinding } from "@/lib/types";
import type { MCPServerConfig, ToolScopeConfig, GraphConfig, IdentityConfig, MemoryConfig } from "@/lib/types";

/**
 * Basic threat detection structure for Phase 3.
 * This will be expanded incrementally with each threat type.
 */

/**
 * Detect trojan MCP servers based on integrity and source trust.
 * Step 2 implementation.
 */
export function detectTrojanServers(config: MCPServerConfig): RiskFinding[] {
	const findings: RiskFinding[] = [];

	// Check server integrity
	if (!config.server.integrityVerified) {
		findings.push({
			id: "MCP-001-TROJAN-INTEGRITY",
			title: "MCP Server integrity verification failed",
			severity: "critical",
			rationale: "Server hash mismatch indicates potential tampering or trojan installation",
			remediation: "Verify server source and re-download from trusted registry",
			refs: ["https://owasp.org/www-project-llm-top-10/"]
		});
	}

	// Check source trust
	if (!config.server.source.startsWith("registry://trusted/") && 
		!config.server.source.includes("github.com/") &&
		!config.server.source.includes("npmjs.com/")) {
		findings.push({
			id: "MCP-002-TROJAN-SOURCE",
			title: "MCP Server from untrusted source",
			severity: "high",
			rationale: "Untrusted source increases risk of malicious code injection",
			remediation: "Use only servers from trusted registries or verified GitHub repositories"
		});
	}

	// Check for suspicious egress
	if (config.network?.egressAllow?.some(url => 
		url.includes("exfil") || 
		url.includes("badhost") || 
		url.includes("suspicious"))) {
		findings.push({
			id: "MCP-003-TROJAN-EGRESS",
			title: "Suspicious network egress configuration",
			severity: "critical",
			rationale: "Egress to suspicious domains may indicate data exfiltration",
			remediation: "Review and restrict network egress to known-good endpoints only"
		});
	}

	return findings;
}

/**
 * Detect over-privileged MCP tools based on scope analysis.
 * Step 2 implementation.
 */
export function detectOverPrivilegedTools(config: ToolScopeConfig): RiskFinding[] {
	const findings: RiskFinding[] = [];

	// Check for filesystem scope on non-filesystem tools
	const filesystemTools = config.tools.filter(tool => 
		tool.scopes.includes("filesystem") && 
		!tool.name.toLowerCase().includes("file") &&
		!tool.name.toLowerCase().includes("fs") &&
		!tool.name.toLowerCase().includes("storage")
	);

	filesystemTools.forEach(tool => {
		findings.push({
			id: "MCP-004-PRIVILEGE-FILESYSTEM",
			title: "Tool has unnecessary filesystem access",
			severity: "high",
			rationale: `Tool '${tool.name}' has filesystem scope but doesn't appear to be a file-related tool`,
			remediation: "Remove filesystem scope or verify tool requires file access"
		});
	});

	// Check for mail scope on non-mail tools
	const mailTools = config.tools.filter(tool => 
		tool.scopes.includes("mail") && 
		!tool.name.toLowerCase().includes("mail") &&
		!tool.name.toLowerCase().includes("email") &&
		!tool.name.toLowerCase().includes("smtp")
	);

	mailTools.forEach(tool => {
		findings.push({
			id: "MCP-005-PRIVILEGE-MAIL",
			title: "Tool has unnecessary mail access",
			severity: "medium",
			rationale: `Tool '${tool.name}' has mail scope but doesn't appear to be a mail-related tool`,
			remediation: "Remove mail scope or verify tool requires email functionality"
		});
	});

	// Check for excessive scopes based on sensitivity context
	if (config.sensitivity === "regulated" || config.sensitivity === "pii") {
		const excessiveScopeTools = config.tools.filter(tool => 
			tool.scopes.length > 3 && 
			(tool.scopes.includes("filesystem") || tool.scopes.includes("mail"))
		);

		excessiveScopeTools.forEach(tool => {
			findings.push({
				id: "MCP-006-PRIVILEGE-EXCESSIVE",
				title: "Tool has excessive privileges for sensitive data",
				severity: "high",
				rationale: `Tool '${tool.name}' has ${tool.scopes.length} scopes including sensitive access in a ${config.sensitivity} environment`,
				remediation: "Apply principle of least privilege - remove unnecessary scopes"
			});
		});
	}

	return findings;
}

/**
 * Detect exfiltration chains based on graph analysis.
 * Step 3 implementation.
 */
export function detectExfilChains(config: GraphConfig): RiskFinding[] {
	const findings: RiskFinding[] = [];

	// Check for paths to external sinks
	if (config.externalSinks && config.externalSinks.length > 0) {
		const suspiciousSinks = config.externalSinks.filter(sink => 
			sink.includes("suspicious") || 
			sink.includes("unknown") || 
			sink.includes("external") ||
			sink.includes("exfil")
		);

		if (suspiciousSinks.length > 0) {
			findings.push({
				id: "MCP-007-EXFIL-SINKS",
				title: "External data sinks detected in graph",
				severity: "critical",
				rationale: `Graph contains ${suspiciousSinks.length} suspicious external sink(s): ${suspiciousSinks.join(", ")}`,
				remediation: "Review and remove unnecessary external data sinks from the graph"
			});
		}
	}

	// Check for untrusted nodes in the graph
	if (config.trust) {
		const untrustedNodes = Object.entries(config.trust)
			.filter(([_, isTrusted]) => !isTrusted)
			.map(([node, _]) => node);

		if (untrustedNodes.length > 0) {
			findings.push({
				id: "MCP-008-EXFIL-UNTRUSTED",
				title: "Untrusted nodes in data flow graph",
				severity: "high",
				rationale: `Graph contains untrusted nodes: ${untrustedNodes.join(", ")}`,
				remediation: "Verify trust status of all nodes or implement additional validation"
			});
		}
	}

	// Check for long chains that could indicate exfiltration paths
	if (config.graph.edges.length > 0) {
		const chainLengths = calculateChainLengths(config.graph.nodes, config.graph.edges);
		const longChains = chainLengths.filter(length => length > 3);

		if (longChains.length > 0) {
			findings.push({
				id: "MCP-009-EXFIL-CHAINS",
				title: "Long data flow chains detected",
				severity: "medium",
				rationale: `Found ${longChains.length} data flow chain(s) with ${Math.max(...longChains)} or more hops`,
				remediation: "Review data flow chains for unnecessary complexity and potential exfiltration paths"
			});
		}
	}

	// Check for direct paths from sensitive nodes to external sinks
	if (config.graph.nodes && config.externalSinks) {
		const sensitiveNodes = config.graph.nodes.filter(node => 
			node.includes("memory") || 
			node.includes("file") || 
			node.includes("database") ||
			node.includes("secret")
		);

		const directPaths = findDirectPathsToSinks(
			config.graph.edges, 
			sensitiveNodes, 
			config.externalSinks
		);

		if (directPaths.length > 0) {
			findings.push({
				id: "MCP-010-EXFIL-DIRECT",
				title: "Direct paths from sensitive data to external sinks",
				severity: "critical",
				rationale: `Found ${directPaths.length} direct path(s) from sensitive nodes to external sinks`,
				remediation: "Implement data validation and filtering before external data transmission"
			});
		}
	}

	return findings;
}

/**
 * Calculate the length of data flow chains in the graph.
 */
function calculateChainLengths(nodes: string[], edges: [string, string][]): number[] {
	const chainLengths: number[] = [];
	const visited = new Set<string>();

	for (const node of nodes) {
		if (!visited.has(node)) {
			const chainLength = dfsChainLength(node, edges, visited, new Set());
			if (chainLength > 0) {
				chainLengths.push(chainLength);
			}
		}
	}

	return chainLengths;
}

/**
 * Depth-first search to calculate chain length from a starting node.
 */
function dfsChainLength(
	node: string, 
	edges: [string, string][], 
	visited: Set<string>, 
	path: Set<string>
): number {
	if (path.has(node)) {
		return 0; // Cycle detected
	}

	visited.add(node);
	path.add(node);

	const outgoingEdges = edges.filter(([from, _]) => from === node);
	let maxLength = 1;

	for (const [_, to] of outgoingEdges) {
		const subLength = dfsChainLength(to, edges, visited, new Set(path));
		maxLength = Math.max(maxLength, 1 + subLength);
	}

	return maxLength;
}

/**
 * Find direct paths from sensitive nodes to external sinks.
 */
function findDirectPathsToSinks(
	edges: [string, string][], 
	sensitiveNodes: string[], 
	externalSinks: string[]
): string[][] {
	const directPaths: string[][] = [];

	for (const sensitiveNode of sensitiveNodes) {
		for (const sink of externalSinks) {
			if (hasDirectPath(edges, sensitiveNode, sink)) {
				directPaths.push([sensitiveNode, sink]);
			}
		}
	}

	return directPaths;
}

/**
 * Check if there's a direct path between two nodes.
 */
function hasDirectPath(edges: [string, string][], from: string, to: string): boolean {
	const visited = new Set<string>();
	const queue = [from];

	while (queue.length > 0) {
		const current = queue.shift()!;
		
		if (current === to) {
			return true;
		}

		if (visited.has(current)) {
			continue;
		}

		visited.add(current);

		const outgoingEdges = edges.filter(([edgeFrom, _]) => edgeFrom === current);
		for (const [_, edgeTo] of outgoingEdges) {
			if (!visited.has(edgeTo)) {
				queue.push(edgeTo);
			}
		}
	}

	return false;
}

/**
 * Detect identity and authentication issues.
 * Step 4 implementation.
 */
export function detectIdentityIssues(config: IdentityConfig): RiskFinding[] {
	const findings: RiskFinding[] = [];

	// Check for shared credentials (tokens used by multiple services)
	const sharedTokens = config.auth.tokens.filter(token => token.usedBy.length > 1);
	
	sharedTokens.forEach(token => {
		findings.push({
			id: "MCP-011-IDENTITY-SHARED",
			title: "Shared authentication token detected",
			severity: "high",
			rationale: `Token '${token.id}' is shared across ${token.usedBy.length} services: ${token.usedBy.join(", ")}`,
			remediation: "Implement service-specific authentication tokens to limit blast radius"
		});
	});

	// Check for long-lived tokens (TTL > 30 days)
	const longLivedTokens = config.auth.tokens.filter(token => token.ttlSeconds > 2592000); // 30 days
	
	longLivedTokens.forEach(token => {
		const days = Math.round(token.ttlSeconds / 86400);
		findings.push({
			id: "MCP-012-IDENTITY-LONG-LIVED",
			title: "Long-lived authentication token detected",
			severity: "medium",
			rationale: `Token '${token.id}' has TTL of ${days} days, increasing exposure window`,
			remediation: "Reduce token TTL to minimum required for service operation"
		});
	});

	// Check for very long-lived tokens (TTL > 1 year)
	const veryLongLivedTokens = config.auth.tokens.filter(token => token.ttlSeconds > 31536000); // 1 year
	
	veryLongLivedTokens.forEach(token => {
		const days = Math.round(token.ttlSeconds / 86400);
		findings.push({
			id: "MCP-013-IDENTITY-VERY-LONG-LIVED",
			title: "Very long-lived authentication token detected",
			severity: "critical",
			rationale: `Token '${token.id}' has TTL of ${days} days, creating significant security risk`,
			remediation: "Immediately rotate token and implement proper TTL management"
		});
	});

	// Check for weak rotation policy
	if (config.auth.rotationPolicyDays) {
		if (config.auth.rotationPolicyDays > 90) {
			findings.push({
				id: "MCP-014-IDENTITY-WEAK-ROTATION",
				title: "Weak token rotation policy",
				severity: "medium",
				rationale: `Token rotation policy allows ${config.auth.rotationPolicyDays} days between rotations`,
				remediation: "Implement more frequent token rotation (recommended: 30 days or less)"
			});
		}
	} else {
		findings.push({
			id: "MCP-015-IDENTITY-NO-ROTATION",
			title: "No token rotation policy defined",
			severity: "high",
			rationale: "No token rotation policy is configured, increasing risk of credential compromise",
			remediation: "Implement automated token rotation policy with appropriate frequency"
		});
	}

	// Check for excessive token usage (more than 3 services per token)
	const excessiveUsageTokens = config.auth.tokens.filter(token => token.usedBy.length > 3);
	
	excessiveUsageTokens.forEach(token => {
		findings.push({
			id: "MCP-016-IDENTITY-EXCESSIVE-USAGE",
			title: "Token used by excessive number of services",
			severity: "high",
			rationale: `Token '${token.id}' is used by ${token.usedBy.length} services, violating principle of least privilege`,
			remediation: "Split token usage across multiple service-specific tokens"
		});
	});

	return findings;
}

export function detectMemoryPoisoning(config: MemoryConfig): RiskFinding[] {
	// Step 6 implementation
	return [];
}

/**
 * Main threat detection orchestrator - will be completed in Step 7
 */
export function detectThreats(configs: {
	trojan?: MCPServerConfig;
	privilege?: ToolScopeConfig;
	exfil?: GraphConfig;
	identity?: IdentityConfig;
	memory?: MemoryConfig;
}): RiskFinding[] {
	const findings: RiskFinding[] = [];

	if (configs.trojan) {
		findings.push(...detectTrojanServers(configs.trojan));
	}

	if (configs.privilege) {
		findings.push(...detectOverPrivilegedTools(configs.privilege));
	}

	if (configs.exfil) {
		findings.push(...detectExfilChains(configs.exfil));
	}

	if (configs.identity) {
		findings.push(...detectIdentityIssues(configs.identity));
	}

	if (configs.memory) {
		findings.push(...detectMemoryPoisoning(configs.memory));
	}

	return findings;
}
