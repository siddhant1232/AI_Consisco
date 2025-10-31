import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function CTAsection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Ready to save hours of time?
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg sm:text-xl">
              Transform lengthy documents into clear, actionable insights with
              our AI-powered summarizer.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-slate-900 to-rose-500
              hover:from-rose-500 hover:to-slate-900 text-white transition-all duration-300 flex items-center justify-center gap-2"
              variant="link"
            >
              <Link
                href="/#pricing"
                className="flex items-center no-underline hover:no-underline gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
