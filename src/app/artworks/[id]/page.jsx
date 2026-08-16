"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ArrowLeft, ShoppingBag, TrashBin, Pencil, Xmark, Calendar, Tag, Comment, PaperPlane } from "@gravity-ui/icons";

export default function ArtworkDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const artworkId = unwrappedParams.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", price: "", category: "" });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/artworks";
  const commentsUrl = process.env.NEXT_PUBLIC_COMMENTS_API_URL || "http://localhost:5000/api/comments";
  const paymentsUrl = process.env.NEXT_PUBLIC_PAYMENTS_API_URL || "http://localhost:5000/api/payments";

  const fetchArtworkDetails = async () => {
    try {
      const res = await fetch(`${baseUrl}/${artworkId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Artwork not found.");
      setArtwork(data);
      setEditForm({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${commentsUrl}/${artworkId}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setComments(data);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    const isSuccess = searchParams.get("payment") === "success";
    const sessionId = searchParams.get("session_id");

    if (isSuccess && sessionId && currentUser) {
      fetch(`${paymentsUrl}/confirm-purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId,
          userEmail: currentUser.email,
          transactionId: sessionId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setActionMessage(data.message || "Payment successful! Artwork purchased.");
          fetchArtworkDetails();
        })
        .catch((err) => console.error(err));
    }
  }, [searchParams, currentUser]);

  useEffect(() => {
    if (artworkId) {
      fetchArtworkDetails();
      fetchComments();
    }
  }, [artworkId]);

  const isOwner = currentUser && artwork && currentUser.email === artwork.artistEmail;

  const handleBuyNow = async () => {
    if (!currentUser) {
      alert("Please login to purchase artworks.");
      router.push("/login");
      return;
    }

    setPaymentLoading(true);
    try {
      const res = await fetch(`${paymentsUrl}/create-artwork-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId,
          userEmail: currentUser.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Purchase failed.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("Payment error: " + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const res = await fetch(`${commentsUrl}/${artworkId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUser?.email || "buyer@arthub.com",
          userName: currentUser?.name || "Art Enthusiast",
          userAvatar: currentUser?.image || "",
          commentText: newComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add comment");

      setNewComment("");
      fetchComments();
    } catch (err) {
      alert(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`${commentsUrl}/${commentId}`, { method: "DELETE" });
      if (res.ok) fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionMessage("");

    try {
      const res = await fetch(`${baseUrl}/${artworkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update artwork.");

      setArtwork(data.artwork);
      setIsEditing(false);
      setActionMessage("Artwork updated successfully!");
    } catch (err) {
      setActionMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this artwork permanently?")) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${baseUrl}/${artworkId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete artwork.");
      alert("Artwork deleted successfully!");
      router.push("/browse");
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading Artwork Details...</p>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 space-y-4 px-4">
        <h2 className="text-2xl font-bold text-red-400">Artwork Not Found</h2>
        <p className="text-slate-400 text-sm text-center">The artwork you are looking for does not exist or has been removed.</p>
        <Link href="/browse" className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full text-xs transition">
          Back to Browse Page
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <Link href="/browse" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Artworks</span>
        </Link>

        {actionMessage && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium">
            {actionMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-full object-cover" />
            {artwork.status === "sold" && (
              <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                Sold Out
              </span>
            )}
          </div>

          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-400 uppercase tracking-wider bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{artwork.category}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(artwork.createdAt).toLocaleDateString()}</span>
                </span>
              </div>

              <h1 className="text-3xl font-black text-white">{artwork.title}</h1>
              
              <div className="text-sm text-slate-300">
                Created by <span className="text-violet-400 font-bold underline">{artwork.artistName}</span> ({artwork.artistEmail})
              </div>

              <div className="border-t border-slate-800 pt-4">
                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1">Price</p>
                <p className="text-4xl font-black text-white">${artwork.price}</p>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">Description</p>
                <p className="text-sm text-slate-300 leading-relaxed">{artwork.description}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              
              <button
                disabled={isOwner || artwork.status === "sold" || paymentLoading}
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-40 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 transition cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {paymentLoading
                    ? "Processing Payment..."
                    : artwork.status === "sold"
                    ? "Artwork Sold Out"
                    : isOwner
                    ? "You Own This Artwork"
                    : "Buy Now with Stripe"}
                </span>
              </button>

              {isOwner && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                    Artist Owner Controls
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Edit Artwork</span>
                    </button>

                    <button
                      onClick={handleDelete}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      <TrashBin className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Comment className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white">Community Reviews & Comments ({comments.length})</h2>
          </div>

          {currentUser ? (
            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                rows={3}
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this artwork..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
              />
              <button
                type="submit"
                disabled={commentLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                <PaperPlane className="w-4 h-4" />
                <span>{commentLoading ? "Posting..." : "Post Comment"}</span>
              </button>
            </form>
          ) : (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
              Please <Link href="/login" className="text-violet-400 font-bold underline">Login</Link> to join the discussion and post comments.
            </div>
          )}

          <div className="space-y-4 pt-4">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No comments yet. Be the first to review this artwork!</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-200">{c.userName}</span>
                      <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{c.commentText}</p>
                  </div>

                  {currentUser && currentUser.email === c.userEmail && (
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="text-slate-500 hover:text-red-400 transition cursor-pointer"
                      title="Delete Comment"
                    >
                      <TrashBin className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white">Edit Artwork Details</h3>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <Xmark className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm"
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
                      required
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {actionLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
