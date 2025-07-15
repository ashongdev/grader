import { createContext } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderContextType = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

export const ThemeProviderContext = createContext<
	ThemeProviderContextType | undefined
>(undefined);
