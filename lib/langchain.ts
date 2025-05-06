import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function fetchAndExtractPdfText(fileUrl: string): Promise<string> {
  try {
    if (!fileUrl?.startsWith("http")) {
      throw new Error("Invalid file URL");
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/pdf")) {
      throw new Error("The URL does not point to a PDF file");
    }

    // Fetch the raw bytes
    const arrayBuffer = await response.arrayBuffer();

    // Convert to a Node.js Buffer (or Uint8Array)
    const buffer = Buffer.from(arrayBuffer);

    // Pass the Buffer directly into PDFLoader
    const blob = new Blob([buffer], { type: "application/pdf" });
    const loader = new PDFLoader(blob);
    const docs = await loader.load();

    if (!docs.length) {
      throw new Error("LangChain PDFLoader returned no pages");
    }

    // Combine pages
    return docs
      .map((d) => d.pageContent.trim())
      .filter((c) => c.length > 0)
      .join("\n\n");
  } catch (e) {
    console.error("Error in fetchAndExtractPdfText:", e);
    throw e;
  }
}
