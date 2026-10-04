"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ConfirmDeleteButton } from "@/components/dashboard/shared/confirm-delete-button";
import {
	SwitchField,
	TextField,
} from "@/components/dashboard/shared/form-fields";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useErrorMessage } from "@/hooks/use-error-message";
import { slugify } from "@/lib/slugify";
import {
	createAlbum,
	deleteAlbum,
	updateAlbum,
} from "@/services/portfolio/actions";
import { type AlbumValues, albumSchema } from "@/services/portfolio/schemas";
import type { AlbumSummary } from "@/services/portfolio/types";

interface AlbumFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Edit mode when provided, create mode otherwise. */
	album?: AlbumSummary;
}

const EMPTY: AlbumValues = {
	title: "",
	slug: "",
	description: "",
	published: false,
};

export function AlbumFormDialog({
	open,
	onOpenChange,
	album,
}: AlbumFormDialogProps) {
	const t = useTranslations("Portfolio.form");
	const router = useRouter();
	const errorMessage = useErrorMessage();
	const form = useForm<AlbumValues>({
		resolver: zodResolver(albumSchema),
		defaultValues: EMPTY,
	});
	const { isSubmitting } = form.formState;

	useEffect(() => {
		if (open)
			form.reset(
				album
					? {
							title: album.title,
							slug: album.slug,
							description: album.description,
							published: album.published,
						}
					: EMPTY,
			);
	}, [open, album, form]);

	// New albums: derive the slug from the title until the slug is edited by hand.
	useEffect(() => {
		if (album) return;
		const subscription = form.watch((values, { name }) => {
			if (name === "title" && !form.getFieldState("slug").isDirty)
				form.setValue("slug", slugify(values.title ?? ""));
		});
		return () => subscription.unsubscribe();
	}, [album, form]);

	async function onSubmit(values: AlbumValues) {
		const result = album
			? await updateAlbum({ ...values, id: album.id })
			: await createAlbum(values);
		if (!result.ok) {
			if (result.error === "albumSlugTaken")
				form.setError("slug", { message: "slugTaken" });
			return toast.error(errorMessage(result.error));
		}
		toast.success(album ? t("updated") : t("created"));
		onOpenChange(false);
		if (!album && result.data)
			router.push(`/dashboard/portfolio/${result.data.id}`);
		else router.refresh();
	}

	async function onDelete() {
		if (!album) return;
		const result = await deleteAlbum(album.id);
		if (!result.ok) return void toast.error(errorMessage(result.error));
		toast.success(t("deleted"));
		onOpenChange(false);
		router.push("/dashboard/portfolio");
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{album ? t("editTitle") : t("createTitle")}</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-3"
					>
						<TextField<AlbumValues>
							name="title"
							label={t("title")}
							placeholder={t("titlePlaceholder")}
						/>
						<TextField<AlbumValues>
							name="slug"
							label={t("slug")}
							description={t("slugHint")}
						/>
						<TextField<AlbumValues>
							name="description"
							label={t("descriptionLabel")}
							rows={3}
						/>
						<SwitchField<AlbumValues>
							name="published"
							label={t("published")}
							description={t("publishedHint")}
						/>
						<DialogFooter className="mt-1 flex-row items-center sm:justify-between">
							{album ? (
								<ConfirmDeleteButton
									title={t("deleteTitle")}
									description={t("deleteDescription")}
									onConfirm={onDelete}
								/>
							) : (
								<span />
							)}
							<Button type="submit" size="sm" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
								)}
								{album ? t("save") : t("create")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
