// actions/upload-action.ts
'use server';
import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { fetchAndExtractPdfText } from '@/lib/langchain';
import { generateSummaryFromOpenAI } from '@/lib/openai';
import { generateSummaryFromGemini } from '@/lib/gemini';
// @ts-ignore: no type declarations for 'postgres'
import postgres from 'postgres';

interface PdfSummaryArgs {
  userId: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

type SummaryResult = {
  success: boolean;
  message: string;
  data: string | null;
  provider?: 'openai' | 'gemini';
};

type ActionResult = {
  success: boolean;
  message: string;
};

export async function generatePDFSummary(uploadResponse: any[]): Promise<SummaryResult> {
  noStore();

  if (!uploadResponse?.[0]?.serverData?.fileUrl) {
    return {
      success: false,
      message: 'Invalid file URL structure',
      data: null,
    };
    }

  try {
    const pdfText = await fetchAndExtractPdfText(uploadResponse[0].serverData.fileUrl);

    if (!pdfText || pdfText.trim().length < 50) {
      return {
        success: false,
        message: 'Extracted text is too short or empty',
        data: null,
      };
    }

    // Try OpenAI first
    try {
      const summary = await generateSummaryFromOpenAI(pdfText);
      return {
        success: true,
        message: 'Summary generated with OpenAI',
        data: summary,
        provider: 'openai',
      };
    } catch (openaiError) {
      console.warn('OpenAI failed, trying Gemini...', openaiError);

      // Fallback to Gemini
      const summary = await generateSummaryFromGemini(pdfText);
      return {
        success: true,
        message: 'Summary generated with Gemini',
        data: summary,
        provider: 'gemini',
      };
    }
  } catch (error: any) {
    console.error('PDF processing error:', error);
    return {
      success: false,
      message: error?.message || 'Failed to process PDF',
      data: null,
    };
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: Omit<PdfSummaryArgs, 'userId'>): Promise<ActionResult> {
  noStore();

  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: 'User not found' };
    }

    await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    return { success: true, message: 'PDF summary saved' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error saving PDF summary';
    return { success: false, message: msg };
  }
}

/* ----------------- Internal: DB persistence ----------------- */

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryArgs): Promise<void> {
  try {
    const sql = getDbConnection(); // note: no await
    await sql`
      INSERT INTO pdf_summaries (
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name
      ) VALUES (
        ${userId},
        ${fileUrl},
        ${summary},
        ${title},
        ${fileName}
      )
    `;
  } catch (error) {
    console.error('Error saving pdf summary', error);
    throw error;
  }
}

/* ----------------- Internal: DB connection (server-only) ----------------- */

declare global {
  // Avoid creating new connections across HMR/serverless cold starts
  // eslint-disable-next-line no-var
  var __pgsql: any | undefined;
}

function getDbConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL environment variable');
  }

  if (!global.__pgsql) {
    global.__pgsql = postgres(process.env.DATABASE_URL, {
      // Many managed Postgres providers require SSL
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 5,
      idle_timeout: 60,
    });
  }

  return global.__pgsql;
}
