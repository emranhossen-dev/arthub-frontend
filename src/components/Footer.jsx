"use client";

import React from "react";
import Link from "next/link";
import { Envelope, Globe, LogoGithub, Palette } from "@gravity-ui/icons";

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white">
              <Palette className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-slate-100">ArtHub</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Connecting art lovers, collectors, and emerging digital artists globally through a secure marketplace.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-slate-200 font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/about" className="hover:text-indigo-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-indigo-400 transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-indigo-400 transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-slate-200 font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="hover:text-indigo-400 transition-colors">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              <LogoGithub className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Pure Tailwind Newsletter Input */}
        <div>
          <h4 className="text-slate-200 font-semibold mb-3">Newsletter</h4>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Envelope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg transition-all"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} ArtHub. All rights reserved.
      </div>
    </footer>
  );
}