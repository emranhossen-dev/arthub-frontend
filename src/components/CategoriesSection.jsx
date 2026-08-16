"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "@gravity-ui/icons";

export default function CategoriesSection() {
  const categories = [
    {
      name: "Painting",
      count: "1,200+ works",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=250",
      link: "/browse?category=Painting",
    },
    {
      name: "Digital",
      count: "850+ works",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=250",
      link: "/browse?category=Digital",
    },
    {
      name: "Sculpture",
      count: "310+ works",
      image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=250",
      link: "/browse?category=Sculpture",
    },
    {
      name: "Photography",
      count: "640+ works",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=250",
      link: "/browse?category=Photography",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <span className="text-xs font-bold tracking-widest text-violet-500 uppercase">
          Curated Collections
        </span>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Browse by Categories
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <Link
            key={index}
            href={cat.link}
            className="group relative h-48 rounded-2xl overflow-hidden border border-slate-800 shadow-sm flex items-end p-4 hover:shadow-xl hover:border-violet-500/30 transition-all hover:scale-[1.01]"
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />

            {/* Image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Title & Count */}
            <div className="relative z-20 space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-1">
                <span>{cat.name}</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[10px] text-neutral-300 uppercase tracking-widest font-semibold">
                {cat.count}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
