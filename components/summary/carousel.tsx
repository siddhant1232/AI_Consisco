"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

interface SummaryCarouselProps {
  text: string;
  wordCount: number;
}

export default function SummaryCarousel({
  text,
  wordCount,
}: SummaryCarouselProps) {
  // Break text into paragraphs
  const paragraphs = text
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Group paragraphs into slides of 2 items each max to match the screenshot
  const slides: string[][] = [];
  for (let i = 0; i < paragraphs.length; i += 2) {
    slides.push(paragraphs.slice(i, i + 2));
  }

  // Fallback if no text somehow
  if (slides.length === 0) {
    slides.push(["No summary content available."]);
  }

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const emojis = ["🎯", "📌", "💡", "⚡", "🔍", "🚀", "✨"];

  return (
    <div className="relative max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8 md:p-14 border border-rose-50/50">
      {/* Top Header Row for Carousel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex-1 w-full md:pr-12">
          {/* Progress Segments */}
          <div className="flex w-full gap-2 overflow-hidden">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${
                  i <= currentSlide ? "bg-primary" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md shrink-0 flex items-center gap-1.5 border border-gray-100 shadow-sm self-end">
          <FileText className="w-4 h-4 text-gray-400" /> {wordCount} words
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="min-h-[300px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500" key={currentSlide}>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-10 leading-snug">
          🚀 Key Insights & Details
        </h2>

        <div className="space-y-4">
          {slides[currentSlide].map((point, index) => {
            const emojiIndex = (currentSlide * 2 + index) % emojis.length;
            const emoji = emojis[emojiIndex];

            return (
              <div
                key={index}
                className="bg-gray-50/60 rounded-2xl p-6 border border-gray-100/80 flex items-start gap-5 hover:shadow-sm hover:border-gray-200 transition-all text-gray-700"
              >
                <span className="text-xl shrink-0 mt-0.5">{emoji}</span>
                <p className="text-base md:text-lg leading-relaxed text-gray-600 font-medium">
                  {point}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-12">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            currentSlide === 0
              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
              : "bg-primary/20 text-primary hover:bg-primary hover:text-white"
          }`}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 ml-0.5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2.5 px-4 overflow-x-auto max-w-[200px]">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? "bg-primary w-2" : "bg-primary/20 w-2"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            currentSlide === slides.length - 1
              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          }`}
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 mr-0.5" />
        </button>
      </div>
    </div>
  );
}
