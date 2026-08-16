"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
import { Palette, Cloud, ArrowRight, Check, TrashBin, Pencil, Tag, Eye } from "@gravity-ui/icons";
import Link from "next/link";

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

  const [myArtworks, setMyArtworks] = useState([]);
  const [fetchingArtworks, setFetchingArtworks] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/artworks";
  const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "a1234567890abcdef1234567890abcde";

  const fetchMyArtworks = async () => {
    try {
      const res = await fetch(`${baseUrl}?limit=100`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.artworks || []);
      
      const userArtworks = list.filter(
        (a) => user?.email && a.artistEmail?.toLowerCase() === user.email.toLowerCase()
      );

      setMyArtworks(userArtworks.length > 0 ? userArtworks : list);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingArtworks(false);
    }
  };

  useEffect(() => {
    fetchMyArtworks();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!imageFile) {
      setMessage({ type: "error", text: "Please select an artwork image file to upload." });
      return;
    }

    setLoading(true);

    try {
      const imgFormData = new FormData();
      imgFormData.append("image", imageFile);

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: imgFormData,
      });

      const imgbbData = await imgbbRes.json();

      let imageUrl = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200";

      if (imgbbData.success) {
        imageUrl = imgbbData.data.display_url;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        imageUrl,
        artistEmail: user?.email || "artist@arthub.com",
        artistName: user?.name || "Independent Artist",
      };

      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to publish artwork.");
      }

      setMessage({ type: "success", text: "Artwork published successfully!" });
      setFormData({ title: "", description: "", price: "", category: "Painting" });
      setImageFile(null);
      fetchMyArtworks();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "An error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtwork = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;
    try {
      const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      if (res.ok) fetchMyArtworks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["artist", "admin"]}>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Creator Studio</span>
              <h1 className="text-3xl font-black text-white mt-1">Artist Dashboard</h1>
              <p className="text-sm text-slate-400 mt-1">Upload new artworks and manage your online gallery.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[10px] text-slate-400">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
                <Palette className="w-5 h-5 text-violet-400" />
                <h2 className="text-xl font-bold text-white">Publish New Artwork</h2>
              </div>

              {message.text && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    message.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Sunset Glow"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-violet-500"
                    >
                      <option value="Painting">Painting</option>
                      <option value="Digital">Digital Art</option>
                      <option value="Sculpture">Sculpture</option>
                      <option value="Photography">Photography</option>
                      <option value="Drawing">Drawing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="150"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell the story behind this piece..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Artwork Image</label>
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-800 hover:border-violet-500/50 bg-slate-950 rounded-2xl cursor-pointer transition">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                      <Cloud className="w-6 h-6 text-violet-400 mb-1" />
                      <p className="text-xs text-slate-300 font-medium">
                        {imageFile ? imageFile.name : "Click to select image file"}
                      </p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-lg shadow-violet-500/25"
                >
                  {loading ? "Uploading to ImgBB..." : "Publish Artwork"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white">Artworks Gallery ({myArtworks.length})</h2>
                <span className="text-xs text-slate-400 font-medium">Live Gallery Management</span>
              </div>

              {fetchingArtworks ? (
                <div className="py-12 text-center text-xs text-slate-500">Loading artworks...</div>
              ) : myArtworks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                  <Palette className="w-8 h-8 mx-auto text-slate-600" />
                  <p>No artworks available right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myArtworks.map((art) => (
                    <div key={art._id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex gap-4 items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={art.imageUrl} alt={art.title} className="w-14 h-14 object-cover rounded-xl bg-slate-900 border border-slate-800" />
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-bold text-white truncate">{art.title}</h4>
                          <span className="text-[10px] text-violet-400 uppercase font-bold">{art.category} • ${art.price}</span>
                          <p className="text-[10px] text-slate-500">Status: <span className={art.status === "sold" ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>{art.status}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/artworks/${art._id}`} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDeleteArtwork(art._id)} className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition cursor-pointer" title="Delete">
                          <TrashBin className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
