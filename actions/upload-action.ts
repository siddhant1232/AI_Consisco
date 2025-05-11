'use server'
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { generateSummaryFromGemini } from "@/lib/gemini";

type SummaryResult = {
  success: boolean;
  message: string;
  data: string | null;
  provider?: 'openai' | 'gemini';
};

export async function generatePDFSummary(uploadResponse: any[]): Promise<SummaryResult> {
  // Validate input
  if (!uploadResponse?.[0]?.serverData?.fileUrl) {
    return {
      success: false,
      message: "Invalid file URL structure",
      data: null,
    };
  }

  try {
    // Fetch and extract PDF text
    const pdfText = await fetchAndExtractPdfText(
      uploadResponse[0].serverData.fileUrl
    );
    console.log("Extracted PDF text:", pdfText);

    if (!pdfText || pdfText.trim().length < 50) {
      return {
        success: false,
        message: "Extracted text is too short or empty",
        data: null,
      };
    }

    // Try OpenAI
    try {
      const summary = await generateSummaryFromOpenAI(pdfText);
      console.log("OpenAI summary:", summary);
      return {
        success: true,
        message: "Summary generated with OpenAI",
        data: summary,
        provider: 'openai',
      };
    } catch (openaiError) {
      console.warn("OpenAI failed, trying Gemini...", openaiError);

      // Fallback to Gemini
      try {
        const summary = await generateSummaryFromGemini(pdfText);
        console.log("Gemini summary:", summary);
        return {
          success: true,
          message: "Summary generated with Gemini",
          data: summary,
          provider: 'gemini',
        };
      } catch (geminiError) {
        console.error("Both APIs failed:", { openaiError, geminiError });
        return {
          success: false,
          message: "All AI providers failed",
          data: null,
        };
      }
    }
  } catch (error: any) {
    console.error("PDF processing error:", error);
    return {
      success: false,
      message: error.message || "Failed to process PDF",
      data: null,
    };
  }
}

export async function storePdfSummaryAction(){

}