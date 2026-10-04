import type { SiteTemplate } from "@/generated/prisma/client";
import { BoldTemplate } from "./bold";
import { boldPalette } from "./bold/palette";
import { EditorialTemplate } from "./editorial";
import { editorialPalette } from "./editorial/palette";
import { MinimalTemplate } from "./minimal";
import { minimalPalette } from "./minimal/palette";
import type { SitePalette, TemplateProps } from "./types";

/**
 * Single place that maps a stored template id to its design.
 * To add a template: add the enum value in schema.prisma, create a folder
 * next to these, and register it here.
 */
export const TEMPLATE_REGISTRY: Record<
	SiteTemplate,
	{
		palette: SitePalette;
		Component: (props: TemplateProps) => Promise<React.ReactNode>;
	}
> = {
	MINIMAL: { palette: minimalPalette, Component: MinimalTemplate },
	EDITORIAL: { palette: editorialPalette, Component: EditorialTemplate },
	BOLD: { palette: boldPalette, Component: BoldTemplate },
};
