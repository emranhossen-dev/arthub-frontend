"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  Tag,
  Calendar,
  User,
  ShoppingBag,
  TrashBin,
  Pencil,
  Check,
  Xmark,
  Heart,
  ArrowLeft,
} from "@gravity-ui/icons";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

export default function ArtworkDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const artworkId = unwrappedParams.id;

  const { data: session } = useSession();
  const currentUser = session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Comment section state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Edit Modal state for artist owner
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  const [paymentLoading, setPaymentLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/artworks";
  const commentsUrl = process.env.NEXT_PUBLIC_COMMENTS_API_URL || "http://localhost:5000/api/comments";
  const paymentsUrl = process.env.NEXT_PUBLIC_PAYMENTS_API_URL || "http://localhost:5000/api/payments";

  const fetchArtworkDetails = async () => {
    try {
      const res = await fetch(`${baseUrl}/${artworkId}`);
      if (!res.ok) throw new Error("Artwork not found");
      const data = await res.json();
      setArtwork(data);
      setEditFormData({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
      });
    } catch (err) {
      toast.error(err.message || "Failed to load artwork details");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${commentsUrl}/${artworkId}`);
      const data = await res.json();
      if (res.ok) setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  const checkWishlistStatus = async () => {
    if (!currentUser?.email) return;
    try {
      const res = await fetch(`${baseUrl}/wishlist/${currentUser.email}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.wishlist)) {
        setIsWishlisted(data.wishlist.includes(artworkId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArtworkDetails();
    fetchComments();
  }, [artworkId]);

  useEffect(() => {
    if (currentUser?.email) checkWishlistStatus();
  }, [currentUser?.email, artworkId]);

  useEffect(() => {
    const payment = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (payment === "success" && sessionId && currentUser?.email) {
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
          Swal.fire({
            title: "Purchase Successful!",
            text: "Thank you! Artwork marked as sold and added to your collection.",
            icon: "success",
            confirmButtonColor: "#8b5cf6",
          });
          fetchArtworkDetails();
        })
        .catch((err) => console.error(err));
    }
  }, [searchParams, artworkId, currentUser]);

  const handleToggleWishlist = async () => {
    if (!currentUser?.email) {
      toast.error("Please login to save to your wishlist!");
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/wishlist/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: currentUser.email, artworkId }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsWishlisted(data.isWishlisted);
        toast.success(data.isWishlisted ? "Added to Wishlist!" : "Removed from Wishlist!");
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleBuyNow = async () => {
    if (!currentUser) {
      toast.error("Please login to purchase artwork!");
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
        throw new Error(data.message || "Failed to initiate payment");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      Swal.fire("Purchase Error", err.message, "error");
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
      toast.success("Comment posted!");
      fetchComments();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: "Delete Comment?",
      text: "Are you sure you want to remove this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${commentsUrl}/${commentId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Comment deleted");
        fetchComments();
      }
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const handleDeleteArtwork = async () => {
    const result = await Swal.fire({
      title: "Delete Artwork?",
      text: "This action cannot be undone. This artwork will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete permanently",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${baseUrl}/${artworkId}`, { method: "DELETE" });
      if (res.ok) {
        Swal.fire("Deleted!", "Artwork has been removed.", "success");
        router.push("/browse");
      }
    } catch (err) {
      toast.error("Failed to delete artwork.");
    }
  };

  const handleUpdateArtwork = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await fetch(`${baseUrl}/${artworkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editFormData,
          price: Number(editFormData.price),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update artwork");

      toast.success("Artwork details updated!");
      setIsEditOpen(false);
      fetchArtworkDetails();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const isOwner = currentUser && artwork && currentUser.email === artwork.artistEmail;
  const isSold = artwork?.status === "sold";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-medium">Loading artwork details...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Artwork Not Found</h2>
        <p className="text-sm text-slate-400">The requested artwork does not exist or has been removed.</p>
        <Link href="/browse" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition">
          Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <Link href="/browse" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Artworks</span>
        </Link>

        {/* Artwork Header & Grid View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* High Res Image */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
              <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-auto max-h-[600px] object-contain mx-auto" />

              {isSold && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs uppercase font-extrabold tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Sold Out
                </div>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-violet-600/20 text-violet-400 border border-violet-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                  {artwork.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(artwork.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">{artwork.title}</h1>

              <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
                  {artwork.artistName?.charAt(0) || "A"}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Created by</p>
                  <p className="text-sm font-bold text-white">{artwork.artistName}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1">
                <p className="text-xs text-slate-400 font-medium">Price</p>
                <p className="text-3xl font-black text-violet-400">${artwork.price}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Piece</h3>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 border border-slate-800 rounded-2xl">{artwork.description}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              {isOwner ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit Artwork</span>
                  </button>

                  <button
                    onClick={handleDeleteArtwork}
                    className="py-3 px-4 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <TrashBin className="w-4 h-4" />
                    <span>Delete Artwork</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBuyNow}
                    disabled={isSold || paymentLoading}
                    className={`flex-1 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-xl cursor-pointer ${
                      isSold
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                        : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-violet-500/25"
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{isSold ? "Already Sold Out" : paymentLoading ? "Processing..." : `Buy Now for $${artwork.price}`}</span>
                  </button>

                  <button
                    onClick={handleToggleWishlist}
                    className={`px-4 py-4 rounded-xl border transition cursor-pointer flex items-center justify-center gap-2 ${
                      isWishlisted
                        ? "bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-500/20"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-rose-500 hover:text-rose-400"
                    }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-xs font-bold hidden sm:inline">{isWishlisted ? "Saved" : "Save"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Comment Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Community Comments ({comments.length})
          </h2>

          {currentUser ? (
            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your feedback or review about this piece..."
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
              />
              <button
                type="submit"
                disabled={commentLoading || !newComment.trim()}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                {commentLoading ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <p className="text-xs text-slate-400 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              Please <Link href="/login" className="text-violet-400 font-bold underline">login</Link> to post comments.
            </p>
          )}

          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex justify-between items-start gap-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-violet-600/30 text-violet-300 border border-violet-500/30 flex items-center justify-center text-xs font-bold">
                      {c.userName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{c.userName}</span>
                        <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{c.commentText}</p>
                    </div>
                  </div>

                  {(currentUser?.email === c.userEmail || currentUser?.role === "admin") && (
                    <button onClick={() => handleDeleteComment(c._id)} className="p-1 text-slate-500 hover:text-red-400 transition" title="Delete Comment">
                      <TrashBin className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Edit Artwork</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white p-1">
                <Xmark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateArtwork} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
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
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs shadow-lg"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
