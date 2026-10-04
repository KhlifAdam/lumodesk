"use client";

import { useRouter } from "next/navigation";
import { useMediaUpload } from "@/components/dashboard/media/use-media-upload";
import { MediaDropzone } from "./media-dropzone";
import { UploadQueue } from "./upload-queue";

/** Library uploader: refreshes the server-rendered grid as files land. */
export function MediaUploader() {
	const router = useRouter();
	const { tasks, addFiles, retry, clearFinished } = useMediaUpload(() =>
		router.refresh(),
	);

	return (
		<div className="flex flex-col gap-4">
			<MediaDropzone onFiles={addFiles} />
			<UploadQueue tasks={tasks} onRetry={retry} onClear={clearFinished} />
		</div>
	);
}
