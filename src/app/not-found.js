"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "@gravity-ui/icons";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="p-4 bg-violet-600/10 border border-violet-500/20 rounded-full text-violet-400">
        <Compass className="w-16 h-16 animate-pulse" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Error 404</span>
        <h1 className="text-4xl font-black text-white">Page Not Found</h1>
        <p className="text-sm text-slate-400">
          The artwork or page you are looking for might have been moved, deleted, or doesn't exist.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold rounded-full text-xs shadow-lg shadow-violet-500/20 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
