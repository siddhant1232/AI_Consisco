import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing<{
  pdfUploader: {
    _output: {
      serverData: {
        userId: string;
        fileName: string;
        fileUrl: string;
      };
    };
  };
}>();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "32MB" } }) // 32MB in string format
    .middleware(async ({ req }) => {
      const user = await currentUser();
      if (!user) {
        throw new UploadThingError("Unauthorized: User not found");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Add additional checks for file and metadata
      if (!file || !file.ufsUrl) {
        console.error("Upload failed: Missing file URL", { file });
        throw new Error("File upload failed, no URL returned");
      }

      if (!metadata?.userId) {
        console.error("Upload failed: Missing metadata userId");
        throw new Error("User ID missing in metadata");
      }

      console.log("File uploaded successfully", { userId: metadata.userId });
      console.log("File URL:", file.ufsUrl);

      console.log("Full file response:", { file, metadata });
      return {
        userId: metadata.userId,
        fileName: file.name,
        fileUrl: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
