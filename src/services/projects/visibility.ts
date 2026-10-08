import type { ProjectStage } from "./stages";

/**
 * What the project's client may see. Files can be uploaded and shared at any
 * stage, but stay hidden from the client until the photographer reaches
 * DELIVERY, which itself requires the project to be paid.
 */
export const CLIENT_VISIBLE_PROJECT = {
	stage: "DELIVERY",
	paid: true,
} as const satisfies { stage: ProjectStage; paid: boolean };

export const isVisibleToClient = (project: {
	stage: ProjectStage;
	paid: boolean;
}) =>
	project.stage === CLIENT_VISIBLE_PROJECT.stage &&
	project.paid === CLIENT_VISIBLE_PROJECT.paid;

/** The step a project can't reach while unpaid. */
export const PAYMENT_GATED_STAGE: ProjectStage = "DELIVERY";
