"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TextField } from "@/components/dashboard/shared/form-fields";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useErrorMessage } from "@/hooks/use-error-message";
import { createProject, updateProject } from "@/services/projects/actions";
import {
	type CreateProjectValues,
	createProjectSchema,
	type ProjectValues,
} from "@/services/projects/schemas";

interface ProjectFormDialogProps {
	trigger: ReactNode;
	/** Edit mode when provided. */
	project?: ProjectValues & { id: string };
	/** Pre-fills the client email (from a client's page). */
	defaultEmail?: string;
}

const EMPTY: CreateProjectValues = {
	title: "",
	description: "",
	location: "",
	eventDate: "",
	clientEmail: "",
};

export function ProjectFormDialog({
	trigger,
	project,
	defaultEmail = "",
}: ProjectFormDialogProps) {
	const t = useTranslations("Projects.form");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const [open, setOpen] = useState(false);
	const initial = project
		? { ...project, clientEmail: "" }
		: { ...EMPTY, clientEmail: defaultEmail };
	const form = useForm<CreateProjectValues>({
		// In edit mode the email stays empty, which the schema accepts.
		resolver: zodResolver(createProjectSchema),
		defaultValues: initial,
	});
	const { isSubmitting } = form.formState;

	async function onSubmit({ clientEmail, ...values }: CreateProjectValues) {
		if (project) {
			const result = await updateProject({ ...values, id: project.id });
			if (!result.ok) return void toast.error(errorMessage(result.error));
			toast.success(t("updated"));
			setOpen(false);
			return router.refresh();
		}
		const result = await createProject({ ...values, clientEmail });
		if (!result.ok) return void toast.error(errorMessage(result.error));
		toast.success(clientEmail ? t("createdInvited") : t("created"));
		setOpen(false);
		router.push(`/dashboard/projects/${result.data.id}`);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (next) form.reset(initial);
			}}
		>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{project ? t("editTitle") : t("createTitle")}
					</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-3"
					>
						<TextField<CreateProjectValues>
							name="title"
							label={t("title")}
							placeholder={t("titlePlaceholder")}
						/>
						{!project && (
							<TextField<CreateProjectValues>
								name="clientEmail"
								label={t("clientEmail")}
								description={t("clientEmailHint")}
								placeholder="client@example.com"
								type="email"
							/>
						)}
						<div className="grid grid-cols-2 gap-3">
							<TextField<CreateProjectValues>
								name="eventDate"
								label={t("eventDate")}
								type="date"
							/>
							<TextField<CreateProjectValues>
								name="location"
								label={t("location")}
							/>
						</div>
						<TextField<CreateProjectValues>
							name="description"
							label={t("descriptionLabel")}
							rows={3}
						/>
						<DialogFooter className="mt-1">
							<Button type="submit" size="sm" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
								)}
								{project ? t("save") : t("create")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
