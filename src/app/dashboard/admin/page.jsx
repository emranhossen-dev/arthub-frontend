"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
import {
  Persons,
  Palette,
  Tag,
  ShieldCheck,
  Check,
  Gear,
  TrashBin,
  ShoppingBag,
  Eye,
  ArrowUpRight,
} from "@gravity-ui/icons";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalSales: 0,
    totalUsers: 0,
    totalRevenue: "0.00",
    categoryCounts: [],
  });

  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:5000/api/admin";

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, artworksRes, transactionsRes] = await Promise.all([
        fetch(`${adminUrl}/analytics`),
        fetch(`${adminUrl}/users`),
        fetch(`${adminUrl}/artworks`),
        fetch(`${adminUrl}/transactions`),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const artworksData = await artworksRes.json();
      const transactionsData = await transactionsRes.json();

      if (statsRes.ok) setStats(statsData);
      if (usersRes.ok && Array.isArray(usersData)) setUsers(usersData);
      if (artworksRes.ok && Array.isArray(artworksData)) setArtworks(artworksData);
      if (transactionsRes.ok && Array.isArray(transactionsData)) setTransactions(transactionsData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${adminUrl}/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        toast.success("User role updated successfully!");
        fetchAdminData();
      }
    } catch (err) {
      toast.error("Role update failed: " + err.message);
    }
  };

  const handleDeleteArtwork = async (artworkId) => {
    const result = await Swal.fire({
      title: "Admin Delete Artwork?",
      text: "As admin, deleting this artwork will permanently remove it from the platform.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${adminUrl}/artworks/${artworkId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Artwork deleted by Admin");
        fetchAdminData();
      }
    } catch (err) {
      toast.error("Failed to delete artwork");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Platform Management</span>
              <h1 className="text-3xl font-black text-white mt-1">Admin Dashboard</h1>
              <p className="text-sm text-slate-400 mt-1">Full control over users, artworks, sales analytics, and transactions.</p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600/10 border border-violet-500/20 text-violet-300 rounded-2xl text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Super Administrator</span>
            </div>
          </div>

          {/* Key Analytics Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
              <h3 className="text-3xl font-black text-emerald-400">${stats.totalRevenue}</h3>
              <p className="text-[10px] text-slate-500">Cumulative platform revenue</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Artworks</span>
              <h3 className="text-3xl font-black text-violet-400">{stats.totalArtworks}</h3>
              <p className="text-[10px] text-slate-500">Listed on marketplace</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Artworks Sold</span>
              <h3 className="text-3xl font-black text-fuchsia-400">{stats.totalSales}</h3>
              <p className="text-[10px] text-slate-500">Completed purchases</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
              <h3 className="text-3xl font-black text-sky-400">{stats.totalUsers}</h3>
              <p className="text-[10px] text-slate-500">Buyers, Artists & Admins</p>
            </div>
          </div>

          {/* Analytics Charts & Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sales Performance Chart Card */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Platform Sales Performance</h3>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Live System Revenue</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-end justify-between gap-3 h-44 pt-6 px-4 bg-slate-950 rounded-2xl border border-slate-800/80">
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-violet-600/30 hover:bg-violet-600 rounded-t-xl transition duration-300" style={{ height: "40%" }} />
                    <span className="text-[10px] text-slate-400">Q1</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-violet-600/40 hover:bg-violet-600 rounded-t-xl transition duration-300" style={{ height: "65%" }} />
                    <span className="text-[10px] text-slate-400">Q2</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-violet-600/70 hover:bg-violet-600 rounded-t-xl transition duration-300" style={{ height: "85%" }} />
                    <span className="text-[10px] text-slate-400">Q3</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gradient-to-t from-violet-600 to-fuchsia-500 rounded-t-xl transition duration-300 shadow-lg shadow-violet-500/30" style={{ height: "100%" }} />
                    <span className="text-[10px] text-violet-400 font-bold">Q4 (Current)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Gross Sales: <strong className="text-white">${stats.totalRevenue}</strong></span>
                  <span>Conversion Rate: <strong className="text-emerald-400">100% Verified</strong></span>
                </div>
              </div>
            </div>

            {/* Category Distribution Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Artworks by Category</h3>
              </div>

              <div className="space-y-4 pt-1">
                {(stats.categoryCounts || []).map((c, i) => {
                  const percent = stats.totalArtworks > 0 ? Math.round((c.count / stats.totalArtworks) * 100) : 0;
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{c.category}</span>
                        <span className="text-violet-400 font-bold">{c.count} items ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(percent, 10)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 border-b-2 transition cursor-pointer ${
                activeTab === "overview" ? "border-violet-500 text-violet-400" : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Users & Roles ({users.length})
            </button>

            <button
              onClick={() => setActiveTab("artworks")}
              className={`pb-3 border-b-2 transition cursor-pointer ${
                activeTab === "artworks" ? "border-violet-500 text-violet-400" : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Manage Artworks ({artworks.length})
            </button>

            <button
              onClick={() => setActiveTab("transactions")}
              className={`pb-3 border-b-2 transition cursor-pointer ${
                activeTab === "transactions" ? "border-violet-500 text-violet-400" : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Transactions History ({transactions.length})
            </button>
          </div>

          {/* Tab 1: Manage Users */}
          {activeTab === "overview" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Persons className="w-5 h-5 text-violet-400" />
                  <h2 className="text-xl font-bold text-white">Platform Users & Role Management</h2>
                </div>
                <span className="text-xs text-slate-400">Total Accounts: {users.length}</span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500">Loading user accounts...</div>
              ) : users.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">No user records found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Current Role</th>
                        <th className="py-3 px-4">Subscription</th>
                        <th className="py-3 px-4 text-right">Change Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-950/50 transition">
                          <td className="py-3 px-4 font-bold text-white">{u.name || "User"}</td>
                          <td className="py-3 px-4 text-slate-400">{u.email}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                u.role === "admin" || u.email?.toLowerCase() === "admin@arthub.com"
                                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                  : u.role === "artist"
                                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}
                            >
                              {u.email?.toLowerCase() === "admin@arthub.com" ? "admin" : (u.role || "user")}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-medium uppercase text-[10px]">
                            {u.subscriptionTier || "free"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <select
                              value={u.role || "user"}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-slate-200 text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
                            >
                              <option value="user">User (Buyer)</option>
                              <option value="artist">Artist</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Manage All Artworks */}
          {activeTab === "artworks" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-violet-400" />
                  <h2 className="text-xl font-bold text-white">Manage All Listed Artworks</h2>
                </div>
                <span className="text-xs text-slate-400">Total Listed: {artworks.length}</span>
              </div>

              {artworks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">No artworks listed.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Artwork</th>
                        <th className="py-3 px-4">Artist Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {artworks.map((art) => (
                        <tr key={art._id} className="hover:bg-slate-950/50 transition">
                          <td className="py-3 px-4 font-bold text-white flex items-center gap-3">
                            <img src={art.imageUrl} alt={art.title} className="w-9 h-9 object-cover rounded-lg bg-slate-950 border border-slate-800" />
                            <span>{art.title}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{art.artistName}</td>
                          <td className="py-3 px-4 text-violet-400 font-semibold">{art.category}</td>
                          <td className="py-3 px-4 font-bold text-white">${art.price}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              art.status === "sold" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                            }`}>
                              {art.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <Link href={`/artworks/${art._id}`} className="p-1.5 inline-block bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition" title="View">
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteArtwork(art._id)}
                              className="p-1.5 inline-block bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition cursor-pointer"
                              title="Delete Artwork"
                            >
                              <TrashBin className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: All Transactions */}
          {activeTab === "transactions" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-violet-400" />
                  <h2 className="text-xl font-bold text-white">Platform Transactions History</h2>
                </div>
                <span className="text-xs text-slate-400">Total Records: {transactions.length}</span>
              </div>

              {transactions.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">No transaction logs recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Transaction ID</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">User Email</th>
                        <th className="py-3 px-4">Artwork / Plan</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {transactions.map((trx) => (
                        <tr key={trx._id} className="hover:bg-slate-950/50 transition">
                          <td className="py-3 px-4 font-mono text-[11px] text-violet-300">{trx.transactionId}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              trx.type === "subscription" ? "bg-purple-500/20 text-purple-300" : "bg-emerald-500/20 text-emerald-300"
                            }`}>
                              {trx.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{trx.userEmail}</td>
                          <td className="py-3 px-4 text-white font-medium">{trx.artworkTitle || "Subscription Tier Upgrade"}</td>
                          <td className="py-3 px-4 font-bold text-emerald-400">${trx.amount}</td>
                          <td className="py-3 px-4 text-right text-slate-400">{new Date(trx.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}
