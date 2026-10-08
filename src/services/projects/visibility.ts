import type { PaymentStatus } from "./options";
import type { ProjectStage } from "./stages";

/**
 * What the project's client may see. Files can be uploaded and shared at any
 * stage, but stay hidden from the client until the photographer reaches
 * DELIVERY, which itself requires the project to be fully paid.
 */
export const CLIENT_VISIBLE_PROJECT = {
	stage: "DELIVERY",
	paymentStatus: "PAID",
} as const satisfies { stage: ProjectStage; paymentStatus: PaymentStatus };

export const isVisibleToClient = (project: {
	stage: ProjectStage;
	paymentStatus: PaymentStatus;
}) =>
	project.stage === CLIENT_VISIBLE_PROJECT.stage &&
	project.paymentStatus === CLIENT_VISIBLE_PROJECT.paymentStatus;

/** The step a project can't reach until it is paid. */
export const PAYMENT_GATED_STAGE: ProjectStage = "DELIVERY";
