// upload-form.tsx
"use client";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePDFSummary, storePdfSummaryAction } from "@/actions/upload-action";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size should be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Only PDF files are accepted",
    }),
});

export default function UploadForm() {
  const { startUpload } = useUploadThing("pdfUploader");
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // Validate file
      const validatedFields = schema.safeParse({ file });
      if (!validatedFields.success) {
        throw new Error(validatedFields.error.flatten().fieldErrors.file?.[0]);
      }

      // Upload phase
      const uploadToast = toast.loading("Uploading PDF...");
      const res = await startUpload([file]);

      if (!res?.[0]?.serverData) {
        throw new Error("Upload failed - no server data");
      }

      toast.success("Upload complete", { id: uploadToast });

      // Processing phase
      const processToast = toast.loading("Generating summary...");
      const result = await generatePDFSummary(res);

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      // Save to database
      const saveResult = await storePdfSummaryAction({
        fileUrl: res[0].serverData.fileUrl,
        summary: result.data,
        title: file.name.replace(/\.pdf$/i, ""),
        fileName: file.name,
      });

      if (!saveResult.success) {
        throw new Error(saveResult.message);
      }

      toast.success(
        `Summary generated securely!`,
        { id: processToast }
      );

      formRef.current?.reset();
      
      // Redirect to summaries page
      router.push("/dashboard");

      formRef.current?.reset();
    } catch (error: any) {
      toast.error("Processing failed", {
        description: error.message || "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
