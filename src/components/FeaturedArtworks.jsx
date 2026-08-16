"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "@gravity-ui/icons";

export default function FeaturedArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://arthub-backend.emran.work/api/artworks";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.artworks || []);
        setArtworks(list.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching featured artworks:", err);
        setLoading(false);
      });
  }, [API_URL]);

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

      {loading ? (
        // Skeleton loader
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          No featured artworks available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {artworks.map((art) => (
            <Link
              key={art._id}
              href={`/artworks/${art._id}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden hover:shadow-xl hover:border-violet-500/30 transition-all flex flex-col h-full"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={art.imageUrl}
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
                  <p className="text-xs text-slate-400 mt-1">By {art.artistName}</p>
                </div>

                <div className="border-t border-slate-800 my-3" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                      Price
                    </p>
                    <p className="text-base font-black text-white">${art.price}</p>
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
      )}
    </section>
  );
}
