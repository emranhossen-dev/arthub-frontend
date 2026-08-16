"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
import { Palette, CloudUpload, ArrowRight, Check } from "@gravity-ui/icons";

export default function ArtistDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Painting",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!imageFile) {
      setMessage({ type: "error", text: "Please select an artwork image file." });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload Image to ImgBB API
      const imgData = new FormData();
      imgData.append("image", imageFile);

      // ImgBB API Key (you can use your key or this public demo key)
      const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "866858e77a111a91c10d3e5e40e2cfdd";
      
      const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: imgData,
      });

      const imgJson = await imgRes.json();

      if (!imgJson.success) {
        throw new Error("Failed to upload image to ImgBB.");
      }

      const imageUrl = imgJson.data.display_url;

      // Step 2: Send Artwork Data to Express Backend API
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/artworks";
      
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          artistEmail: user?.email || "artist@arthub.com",
          artistName: user?.name || "Independent Artist",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create artwork.");
      }

      setMessage({ type: "success", text: "🎨 Artwork published successfully to Marketplace!" });
      setFormData({ title: "", description: "", price: "", category: "Painting" });
      setImageFile(null);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["artist", "admin"]}>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Palette className="w-4 h-4" />
              <span>Artist Dashboard</span>
            </div>
            <h1 className="text-3xl font-black text-white">Upload New Artwork</h1>
            <p className="text-sm text-slate-400 mt-1">
              List your original art on ArtHub marketplace to reach collectors worldwide.
            </p>
          </div>

          {/* Notification */}
          {message.text && (
            <div
              className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {message.type === "success" && <Check className="w-5 h-5 text-emerald-400" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Artwork Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Starry Neon Dreams"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm"
              />
            </div>

            {/* Category & Price Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-violet-500 text-sm cursor-pointer"
                >
                  <option value="Painting">Painting</option>
                  <option value="Digital">Digital Art</option>
                  <option value="Sculpture">Sculpture</option>
                  <option value="Photography">Photography</option>
                  <option value="Drawing">Drawing</option>
                  <option value="Mixed Media">Mixed Media</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Price ($ USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 450"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the medium, inspiration, and details of this piece..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm"
              />
            </div>

            {/* Image Upload Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Upload Artwork Image (ImgBB API) *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-800 hover:border-violet-500/50 bg-slate-950 rounded-2xl cursor-pointer transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <CloudUpload className="w-8 h-8 text-violet-400 mb-2" />
                    <p className="text-sm text-slate-300 font-medium">
                      {imageFile ? imageFile.name : "Click to upload image file"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 transition cursor-pointer"
            >
              {loading ? (
                <span className="animate-pulse">Uploading Image to ImgBB & Publishing...</span>
              ) : (
                <>
                  <span>Publish Artwork</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </ProtectedRoute>
  );
}
