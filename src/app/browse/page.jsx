"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Magnifier, Funnel, ArrowRight, ChevronLeft, ChevronRight, Heart } from "@gravity-ui/icons";
import { useSession } from "@/lib/auth-client";

export default function BrowseArtworksPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [artworks, setArtworks] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArtworks, setTotalArtworks] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/artworks";

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const paramsObj = {};
      if (search.trim()) paramsObj.search = search.trim();
      if (category) paramsObj.category = category;
      if (minPrice) paramsObj.minPrice = minPrice;
      if (maxPrice) paramsObj.maxPrice = maxPrice;
      if (sort) paramsObj.sort = sort;
      paramsObj.page = page.toString();
      paramsObj.limit = "8";

      const queryParams = new URLSearchParams(paramsObj);

      const res = await fetch(`${baseUrl}?${queryParams.toString()}`);
      const data = await res.json();

      if (res.ok) {
        const list = Array.isArray(data) ? data : (data.artworks || []);
        setArtworks(list);
        setTotalPages(data.totalPages || 1);
        setTotalArtworks(data.totalArtworks !== undefined ? data.totalArtworks : list.length);
      }
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`${baseUrl}/wishlist/${user.email}`);
      const data = await res.json();
      if (res.ok) setWishlistIds(data.wishlist || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, [search, category, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    if (user?.email) fetchWishlist();
  }, [user?.email]);

  const handleToggleWishlist = async (e, artworkId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.email) {
      alert("Please login to save artworks to your wishlist!");
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/wishlist/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email, artworkId }),
      });
      const data = await res.json();
      if (res.ok) {
        setWishlistIds(data.wishlist || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Explore Artworks
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Discover unique original paintings, digital art, sculptures, and photography.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="text-violet-400 font-bold">{artworks.length}</span> of{" "}
            <span className="text-white font-bold">{totalArtworks}</span> artworks
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          
          {/* Top Row: Search & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Magnifier className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by artwork title or artist name..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 text-sm cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Painting">Painting</option>
                <option value="Digital">Digital Art</option>
                <option value="Sculpture">Sculpture</option>
                <option value="Photography">Photography</option>
                <option value="Drawing">Drawing</option>
                <option value="Mixed Media">Mixed Media</option>
              </select>
            </div>

          </div>

          {/* Bottom Row: Price Range & Sort */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-800/60">
            
            {/* Min Price */}
            <input
              type="number"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              placeholder="Min Price ($)"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
            />

            {/* Max Price */}
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              placeholder="Max Price ($)"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
            />

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-violet-500 text-xs cursor-pointer"
            >
              <option value="newest">Sort by: Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition cursor-pointer"
            >
              Reset Filters
            </button>

          </div>
        </div>

        {/* Artworks Display Grid (2 col mobile, 3 tablet, 4 desktop) */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <Funnel className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-200">No Artworks Found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              We couldn't find any artworks matching your search filters. Try adjusting price or category.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-block mt-2 px-5 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-full transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map((art) => (
              <Link
                key={art._id}
                href={`/artworks/${art._id}`}
                className="group rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden hover:shadow-xl hover:border-violet-500/30 transition-all flex flex-col h-full relative"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {art.status === "sold" && (
                    <span className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow z-10">
                      Sold
                    </span>
                  )}
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleToggleWishlist(e, art._id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow z-10 cursor-pointer ${
                      wishlistIds.includes(art._id)
                        ? "bg-rose-500 text-white"
                        : "bg-slate-950/60 text-slate-300 hover:bg-rose-500 hover:text-white"
                    }`}
                    title={wishlistIds.includes(art._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                      {art.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 truncate mt-1 group-hover:text-violet-400 transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">By {art.artistName}</p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">Price</p>
                      <p className="text-sm font-black text-white">${art.price}</p>
                    </div>
                    <span className="text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-800">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold text-slate-400">
              Page <span className="text-white font-bold">{page}</span> of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
