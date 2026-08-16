"use client";

import React from "react";
import { StarFill } from "@gravity-ui/icons";

export default function TopArtists() {
  const artists = [
    {
      name: "Vincent van Gogh",
      sales: "89 Sales",
      bio: "Post-Impressionist master exploring vivid colors and emotional brushwork.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    },
    {
      name: "Claude Monet",
      sales: "76 Sales",
      bio: "Founder of French Impressionist painting, capturing light and nature.",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150",
    },
    {
      name: "Sarah Chen",
      sales: "54 Sales",
      bio: "Modern digital artist merging cyberpunk realism with classic design.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">
          Talents Spotlight
        </span>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Top Selling Artists
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {artists.map((artist, i) => (
          <div
            key={i}
            className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-xl hover:border-violet-500/30 transition-all relative overflow-hidden group"
          >
            <div className="relative">
              <img
                src={artist.avatar}
                alt={artist.name}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-violet-500/20"
              />
              <span className="absolute bottom-0 right-0 rounded-full bg-violet-600 p-1.5 text-white shadow-md">
                <StarFill className="w-3.5 h-3.5 fill-white text-white" />
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-100">{artist.name}</h3>
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mt-1 block">
                {artist.sales}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              {artist.bio}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
