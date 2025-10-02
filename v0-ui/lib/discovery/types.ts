export interface QuestionOption {
	id: string;              // equals value for convenience
	value: string;           // "prod", "pii", etc.
	label: string;           // human label
	description?: string;
}

export interface DiscoveryQuestion {
	id: "env" | "sensitivity" | "exposure" | "auth" | "compliance";
	title: string;
	explanation?: string;
	options: QuestionOption[];
	required?: boolean;
	multiple?: boolean;
}

export interface DiscoverySchema {
	questions: DiscoveryQuestion[];
}

export interface DiscoveryAnswers {
	env?: string;
	sensitivity?: string;
	exposure?: string;
	auth?: string;
	compliance?: string[];
}

export interface DiscoveryProfile {
	envType: string;
	dataSensitivity: string;
	exposureLevel: string;
	authMethod: string;
	complianceContext: string[];
	hasUnknowns: boolean;
	weightMultiplier: number;
}
