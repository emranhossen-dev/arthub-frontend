"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, ArrowRightToSquare, Bars, Xmark } from "@gravity-ui/icons";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden text-slate-300 hover:text-white focus:outline-none p-1"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <Xmark className="w-6 h-6" /> : <Bars className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white">
                <Palette className="w-5 h-5" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                ArtHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-indigo-400 font-semibold" : "text-slate-300 hover:text-indigo-400"
              }`}
            >
              Home
            </Link>

            <Link
              href="/browse"
              className={`text-sm font-medium transition-colors ${
                isActive("/browse") ? "text-indigo-400 font-semibold" : "text-slate-300 hover:text-indigo-400"
              }`}
            >
              Browse Artworks
            </Link>

            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive("/dashboard") ? "text-indigo-400 font-semibold" : "text-slate-300 hover:text-indigo-400"
              }`}
            >
              Dashboard
            </Link>
          </div>

          {/* Auth Button */}
          <div className="flex items-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-md shadow-indigo-500/20 transition-all duration-200"
            >
              <ArrowRightToSquare className="w-4 h-4" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className={`block py-2 text-base ${isActive("/") ? "text-indigo-400 font-semibold" : "text-slate-200"}`}
          >
            Home
          </Link>
          <Link
            href="/browse"
            onClick={() => setIsMenuOpen(false)}
            className={`block py-2 text-base ${isActive("/browse") ? "text-indigo-400 font-semibold" : "text-slate-200"}`}
          >
            Browse Artworks
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className={`block py-2 text-base ${isActive("/dashboard") ? "text-indigo-400 font-semibold" : "text-slate-200"}`}
          >
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}