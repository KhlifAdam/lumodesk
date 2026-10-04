import {
	Cormorant_Garamond,
	Montserrat,
	Playfair_Display,
	Source_Sans_3,
} from "next/font/google";

// Font pairs for public sites (MODERN reuses the app's DM Sans and Manrope).
const playfair = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin"],
	weight: ["500", "700"],
});

const sourceSans = Source_Sans_3({
	variable: "--font-source-sans",
	subsets: ["latin"],
	weight: ["400", "600"],
});

const cormorant = Cormorant_Garamond({
	variable: "--font-cormorant",
	subsets: ["latin"],
	weight: ["500", "700"],
});

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["400", "600"],
});

/** Apply on a wrapper to make every site font pair's CSS variables available. */
export const siteFontVariables = [playfair, sourceSans, cormorant, montserrat]
	.map((font) => font.variable)
	.join(" ");
