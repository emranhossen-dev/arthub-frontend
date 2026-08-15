"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Eye } from "@gravity-ui/icons";

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-slate-900/50 py-20 lg:py-28 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Next-Gen Digital Art Marketplace</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-slate-100">
            Discover & Buy{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Original Art
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-400 leading-relaxed">
            Empowering artists and art lovers worldwide. Browse curated collections, connect with creators, and purchase verified original artworks seamlessly.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-full shadow-lg shadow-indigo-500/25 active:scale-95 transition-all duration-200"
            >
              <span>Browse Artworks</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-slate-200 border border-slate-700 hover:bg-slate-800 rounded-full active:scale-95 transition-all duration-200"
            >
              <Eye className="w-5 h-5 text-slate-300" />
              <span>Learn More</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}