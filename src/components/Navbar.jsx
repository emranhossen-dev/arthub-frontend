"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Palette, ArrowRightToSquare, Bars, Xmark, ArrowRightFromLine, LayoutHeader, User, Heart } from "@gravity-ui/icons";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Get current auth session from BetterAuth
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const isActive = (path) => pathname === path;

  // Determine dashboard route based on user role or admin email
  const getDashboardRoute = () => {
    if (!user) return "/login";
    if (user.email?.toLowerCase() === "admin@arthub.com" || user.role === "admin") return "/dashboard/admin";
    if (user.role === "artist") return "/dashboard/artist";
    return "/dashboard/user";
  };

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
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

          {/* Desktop Navigation Links */}
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
              href="/wishlist"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive("/wishlist") ? "text-rose-400 font-semibold" : "text-slate-300 hover:text-rose-400"
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Wishlist</span>
            </Link>

            {/* Role-Based Dynamic Dashboard Link */}
            {user && (
              <Link
                href={getDashboardRoute()}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith("/dashboard") ? "text-indigo-400 font-semibold" : "text-slate-300 hover:text-indigo-400"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Action: Theme Toggle & Auth State */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isPending ? (
              // Skeleton loading while checking session
              <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse"></div>
            ) : user ? (
              // User Profile Dropdown Menu
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-indigo-500/30 hover:border-indigo-500 transition duration-200 cursor-pointer"
                >
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                </button>

                {/* Dropdown Card */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-semibold text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        Role: {user.email?.toLowerCase() === "admin@arthub.com" ? "Admin" : (user.role || "User")}
                      </span>
                    </div>

                    <Link
                      href={getDashboardRoute()}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <LayoutHeader className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/wishlist"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>My Wishlist</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                    >
                      <ArrowRightFromLine className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login Button (If Logged Out)
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-md shadow-indigo-500/20 transition-all duration-200"
              >
                <ArrowRightToSquare className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
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
            href="/wishlist"
            onClick={() => setIsMenuOpen(false)}
            className={`block py-2 text-base ${isActive("/wishlist") ? "text-rose-400 font-semibold" : "text-slate-200"}`}
          >
            Wishlist
          </Link>
          {user && (
            <Link
              href={getDashboardRoute()}
              onClick={() => setIsMenuOpen(false)}
              className={`block py-2 text-base ${pathname.startsWith("/dashboard") ? "text-indigo-400 font-semibold" : "text-slate-200"}`}
            >
              Dashboard ({user.email?.toLowerCase() === "admin@arthub.com" ? "Admin" : (user.role || "User")})
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
