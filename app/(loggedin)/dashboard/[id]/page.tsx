import { auth } from "@clerk/nextjs/server";
import { getData } from "@/lib/db";
import { notFound } from "next/navigation";
import { FileText, Calendar, Clock, ChevronLeft, ExternalLink, Download, Sparkles } from "lucide-react";
import Link from "next/link";
import SummaryCarousel from "@/components/summary/carousel";

export default async function SummaryDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  let sql;
  try {
    sql = await getData();
  } catch (error) {
    console.error(error);
    return notFound();
  }

  const summaries = await sql`SELECT * FROM pdf_summaries WHERE id = ${id} AND user_id = ${userId} LIMIT 1`;
  const summary = summaries[0];

  if (!summary) return notFound();

  const wordCount = summary.summary_text.split(/\s+/).length;

  return (
    <div className="container mx-auto max-w-[1000px] py-10 px-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-6 text-sm font-medium text-gray-500 flex-wrap">
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span>AI Summary</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{new Date(summary.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-full font-semibold transition-colors flex items-center gap-1.5 text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Main Title Area */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-3">
          {summary.title || summary.file_name || "Document Summary"}
        </h1>
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
          <FileText className="w-4 h-4" />
          <span>Source: {summary.file_name}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          {summary.original_file_url && (
            <Link
              href={summary.original_file_url}
              target="_blank"
              className="text-primary font-semibold hover:opacity-80 transition inline-flex items-center gap-2 text-sm border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/5"
            >
              <ExternalLink className="w-4 h-4" /> View Original
            </Link>
          )}
          <button className="text-primary font-semibold hover:opacity-80 transition inline-flex items-center gap-2 text-sm border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/5">
            <Download className="w-4 h-4" /> Download Summary
          </button>
        </div>
      </div>

      {/* Detail Card / Carousel Area */}
      <SummaryCarousel text={summary.summary_text} wordCount={wordCount} />
    </div>
  );
}
