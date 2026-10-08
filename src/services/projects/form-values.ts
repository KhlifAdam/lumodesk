import type { CreateProjectValues, ProjectValues } from "./schemas";
import type { ProjectDetail } from "./types";

/** A blank "create project" form. */
export function emptyProjectValues(
	clientEmail = "",
	clientPhone = "",
): CreateProjectValues {
	return {
		title: "",
		serviceType: "WEDDING",
		mediaType: "PHOTO",
		description: "",
		clientEmail,
		// A phone number passed in is a phone-only client: text them the invitation.
		invitePhone: !clientEmail && clientPhone !== "",
		clientPhone,
		contactName: "",
		contactPhone: "",
		clientNotes: "",
		eventDate: "",
		startTime: "",
		endTime: "",
		location: "",
		locationType: "",
		deliveryDeadline: "",
		equipment: "",
		price: null,
		advance: 0,
		paymentStatus: "UNPAID",
		financialNotes: "",
		team: "",
		internalNotes: "",
	};
}

const day = (iso: string | null) => iso?.slice(0, 10) ?? "";

/** The edit form's starting values for an existing project. */
export function projectToValues(project: ProjectDetail): ProjectValues {
	return {
		title: project.title,
		serviceType: project.serviceType,
		mediaType: project.mediaType,
		description: project.description,
		clientPhone: project.clientPhone,
		contactName: project.contactName,
		contactPhone: project.contactPhone,
		clientNotes: project.clientNotes,
		eventDate: day(project.eventDate),
		startTime: project.startTime,
		endTime: project.endTime,
		location: project.location,
		locationType: project.locationType,
		deliveryDeadline: day(project.deliveryDeadline),
		equipment: project.equipment,
		price: project.price,
		advance: project.advance,
		paymentStatus: project.paymentStatus,
		financialNotes: project.financialNotes,
		team: project.team,
		internalNotes: project.internalNotes,
	};
}
