"use client";

import React, { useEffect } from "react";
import { ArrowRotateLeft, ShieldCheck } from "@gravity-ui/icons";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error("Runtime error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-full text-red-400">
        <ShieldCheck className="w-16 h-16" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Runtime Exception</span>
        <h1 className="text-3xl font-black text-white">Something Went Wrong</h1>
        <p className="text-sm text-slate-400">
          An unexpected error occurred while rendering this page. Please click reload to restore.
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-xs shadow-lg transition cursor-pointer"
      >
        <ArrowRotateLeft className="w-4 h-4" />
        <span>Reload Application</span>
      </button>
    </div>
  );
}
