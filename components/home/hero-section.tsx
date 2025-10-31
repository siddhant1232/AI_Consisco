import { Button } from "../ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative mx-auto flex flex-col z-0 items-center justify-center py-16 sm:py-20 lg:pb-28 transition-all animate-in lg:px-12 max-w-7xl">
      <div className="flex flex-col items-center">
        {/* Gradient Badge */}
        <div className="flex items-center mb-8">
          <div className="relative p-[1px] overflow-hidden rounded-full bg-gradient-to-r from-rose-200 via-rose-500 to-rose-800 animate-gradient-x group">
            <Badge
              variant="secondary"
              className="relative px-6 py-2 text-base font-medium bg-white rounded-full group-hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center bg-gradient-to-r from-rose-200 via-rose-500 to-rose-800 bg-clip-text">
                <Sparkles className="w-6 h-6 mr-2 text-bold animate-pulse" />
                <p className="text-transparent">Powered by AI</p>
              </div>
            </Badge>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl text-center py-6 mb-4">
          <span>
            Transform PDFs into{" "}
            <span className="relative z-10 px-2">
              concise
              <span
                className="absolute inset-0 bg-rose-200/50 -rotate-2 rounded-lg transform -skew-y-1 "
                aria-hidden="true"
              ></span>{" "}
            </span>
            summaries
          </span>
        </h1>

        {/* Subheading */}
        <h2 className="text-lg sm:text-xl text-center lg:text-2xl px-4 lg:px-0 lg:max-w-4xl text-gray-600 mb-8">
          Get a beautiful summary reel of the document in seconds.
        </h2>

        {/* CTA Button */}
        <Button className="mt-6 text-base sm:text-lg lg:text-xl rounded-full px-8 sm:px-12 lg:px-16 py-6 sm:py-8 lg:py-10 bg-gradient-to-r from-slate-900 to-rose-600 hover:from-rose-600 hover:to-slate-900 text-white font-bold shadow-lg transition-all duration-300 group">
          <Link className="flex gap-2 items-center" href="/#pricing">
            <span>Try Consisco</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
