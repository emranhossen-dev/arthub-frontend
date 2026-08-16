"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "@gravity-ui/icons";

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Discover & Collect Original Art",
      description: "Connecting art lovers and collectors directly with independent digital creators, photographers, and painters worldwide.",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1600",
      tag: "Global Art Marketplace",
    },
    {
      title: "Empowering Independent Creators",
      description: "Buy original pieces direct from artists. We ensure verified transactions, secure delivery, and zero gallery middleman markups.",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1600",
      tag: "Verified Creator Network",
    },
    {
      title: "Exclusive Digital & Fine Artworks",
      description: "Explore curated original paintings, sculptures, and photography crafted by passionate artists around the globe.",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1600",
      tag: "Authentic & Verified Works",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[550px] md:h-[600px] w-full overflow-hidden bg-neutral-900 text-white flex items-center">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 z-10" />

          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover object-center transform scale-105 transition-transform duration-[6000ms]"
          />

          {/* Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-600/20 border border-violet-500/30 px-3.5 py-1.5 text-xs font-bold text-violet-300 uppercase tracking-widest self-start animate-pulse">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>{slide.tag}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-2xl leading-none">
              {slide.title}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-lg leading-relaxed">
              {slide.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.01]"
              >
                <span>Browse Artworks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 px-6 py-3 text-sm font-semibold transition-all"
              >
                <span>Join as Artist</span>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              i === currentSlide ? "w-8 bg-violet-500" : "w-2.5 bg-white/45"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}