import { createContext, useContext, useEffect, useState } from "react";

type FontSize = "small" | "medium" | "large";

type FontSizeProviderContextType = {
	fontSize: FontSize;
	setFontSize: (fontSize: FontSize) => void;
};

const FontSizeProviderContext = createContext<
	FontSizeProviderContextType | undefined
>(undefined);

export function FontSizeProvider({
	children,
	defaultFontSize = "medium",
	storageKey = "app-font-size",
}: {
	children: React.ReactNode;
	defaultFontSize?: FontSize;
	storageKey?: string;
}) {
	const [fontSize, setFontSize] = useState<FontSize>(
		() => (localStorage.getItem(storageKey) as FontSize) || defaultFontSize
	);

	useEffect(() => {
		const root = window.document.documentElement;

		// Remove existing font size classes
		root.classList.remove("text-small", "text-medium", "text-large");

		// Apply new font size class
		root.classList.add(`text-${fontSize}`);
	}, [fontSize]);

	const value = {
		fontSize,
		setFontSize: (fontSize: FontSize) => {
			localStorage.setItem(storageKey, fontSize);
			setFontSize(fontSize);
		},
	};

	return (
		<FontSizeProviderContext.Provider value={value}>
			{children}
		</FontSizeProviderContext.Provider>
	);
}

export const useFontSize = () => {
	const context = useContext(FontSizeProviderContext);

	if (context === undefined)
		throw new Error("useFontSize must be used within a FontSizeProvider");

	return context;
};
