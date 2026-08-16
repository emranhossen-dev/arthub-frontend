"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, HeartFill, TrashBin, ArrowRight, Eye } from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";

export default function WishlistPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [wishlistArtworks, setWishlistArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/artworks";

  const fetchWishlist = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/wishlist/${user.email}`);
      const data = await res.json();
      if (res.ok) {
        setWishlistArtworks(data.artworks || []);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user?.email]);

  const handleRemoveWishlist = async (artworkId) => {
    if (!user?.email) return;
    try {
      const res = await fetch(`${baseUrl}/wishlist/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email, artworkId }),
      });
      if (res.ok) {
        setWishlistArtworks((prev) => prev.filter((art) => art._id !== artworkId));
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Saved Collection</span>
            <h1 className="text-3xl font-black text-white mt-1 flex items-center gap-3">
              <Heart className="w-8 h-8 text-rose-500" /> My Wishlist
            </h1>
            <p className="text-sm text-slate-400 mt-1">Artworks you have bookmarked for future acquisition.</p>
          </div>
          
          <div className="text-right">
            <span className="text-xs font-medium text-slate-400">Total Saved Items</span>
            <p className="text-2xl font-bold text-violet-400">{wishlistArtworks.length}</p>
          </div>
        </div>

        {/* Content */}
        {!user ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-xl font-bold text-white">Please Login to View Wishlist</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Sign in to save your favorite artworks across sessions and track your favorite artists.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full text-xs shadow-lg transition"
            >
              <span>Go to Login</span>
            </Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : wishlistArtworks.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-xl font-bold text-white">Your Wishlist is Empty</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              You haven't saved any artworks yet. Explore our browse gallery and click the heart icon on any artwork to save it!
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold rounded-full text-xs shadow-lg transition"
            >
              <span>Explore Artworks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistArtworks.map((art) => (
              <div
                key={art._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-violet-500/50 transition group flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-violet-300 border border-violet-500/20">
                    {art.category}
                  </span>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white truncate">{art.title}</h3>
                    <p className="text-xs text-slate-400">By {art.artistName}</p>
                    <p className="text-xl font-black text-violet-400 mt-2">${art.price}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <Link
                      href={`/artworks/${art._id}`}
                      className="flex-1 py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 transition"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Artwork</span>
                    </Link>

                    <button
                      onClick={() => handleRemoveWishlist(art._id)}
                      className="p-2.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <TrashBin className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
