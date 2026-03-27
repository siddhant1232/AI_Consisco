import { deleteSummaryAction } from "@/actions/upload-action";
import { auth } from "@clerk/nextjs/server";
import { getData } from "@/lib/db";
import Link from "next/link";
import { FileText, Trash2, ArrowRight } from "lucide-react";

// Format time ago or just format clearly
function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const sql = await getData();
  const summaries = await sql`
    SELECT id, title, file_name, summary_text, created_at, status 
    FROM pdf_summaries 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `;

  return (
    <div className="container mx-auto max-w-[1000px] py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">
            Your Summaries
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Transform your PDFs into concise, actionable insights
          </p>
        </div>
        <Link
          href="/upload"
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 text-sm"
        >
          <span>+</span> New Summary
        </Link>
      </div>

      {summaries.length >= 5 ? (
        <div className="bg-red-50 text-red-600 px-5 py-3.5 rounded-xl mb-10 text-sm border border-red-100 flex items-center">
          <p>
            You&apos;ve reached the limit of 5 uploads on the Basic plan.{" "}
            <Link href="/#pricing" className="font-semibold hover:underline inline-flex items-center">
              Click here to upgrade to Pro <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>{" "}
            for unlimited uploads.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaries.map((summary) => {
          const deleteSummary = deleteSummaryAction.bind(null, summary.id);
          
          return (
          <div
            key={summary.id}
            className="border border-gray-100 shadow-sm rounded-2xl p-5 bg-white shrink-0 hover:shadow-md transition-all relative group flex flex-col h-[200px]"
          >
            <form action={deleteSummary} className="absolute top-4 right-4 z-10">
              <button 
                type="submit" 
                className="text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
                aria-label="Delete summary"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-start gap-4 mb-4 pr-8">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0 text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <Link
                  href={`/dashboard/${summary.id}`}
                  className="hover:text-primary transition-colors"
                >
                  <h3 className="font-bold text-gray-800 text-base leading-tight line-clamp-2">
                    {summary.title || summary.file_name || "Document Summary"}
                  </h3>
                </Link>
                <p className="text-[11px] text-gray-400 font-medium mt-1.5">
                  {formatTimeAgo(new Date(summary.created_at))}
                </p>
              </div>
            </div>
            
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-auto break-words">
              {summary.summary_text}
            </p>
            
            <div className="mt-4 pt-3 border-t border-gray-50">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-600 tracking-wide uppercase">
                {summary.status || "Completed"}
              </div>
            </div>
          </div>
        )})}
        {summaries.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            No summaries found. Upload a PDF to get started!
          </div>
        )}
      </div>
    </div>
  );
}
