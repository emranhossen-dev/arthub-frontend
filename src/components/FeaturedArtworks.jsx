"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "@gravity-ui/icons";

export default function FeaturedArtworks() {
  const featured = [
    {
      id: "6a33f30eb850f3e8dc3c6bd2",
      title: "The Café Terrace at Night",
      artist: "Vincent van Gogh",
      category: "Painting",
      price: "$3,900",
      image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "6a33f30eb850f3e8dc3c6bd5",
      title: "Mechanical Butterfly",
      artist: "Sarah Chen",
      category: "Digital",
      price: "$800",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "6a33f30eb850f3e8dc3c6bcf",
      title: "Water Lilies in Blue",
      artist: "Claude Monet",
      category: "Painting",
      price: "$6,200",
      image: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="flex items-end justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">
            Handpicked Creations
          </span>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            Featured Artworks
          </h2>
        </div>
        <Link
          href="/browse"
          className="text-sm font-semibold text-violet-400 hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featured.map((art) => (
          <Link
            key={art.id}
            href={`/artworks/${art.id}`}
            className="group rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden hover:shadow-xl hover:border-violet-500/30 transition-all flex flex-col h-full"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
              <img
                src={art.image}
                alt={art.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">
                  {art.category}
                </span>
                <h3 className="text-base font-bold text-slate-100 truncate mt-1 group-hover:text-violet-400 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">By {art.artist}</p>
              </div>

              <div className="border-t border-slate-800 my-3" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                    Price
                  </p>
                  <p className="text-base font-black text-white">{art.price}</p>
                </div>
                <span className="text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
