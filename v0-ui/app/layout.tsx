import "./globals.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata = {
	title: "MCP Security Scorecard",
	description: "Scorecard MVP UI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}



