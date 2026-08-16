"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
import { Persons, Palette, Tag, ShieldCheck, Check, Gear } from "@gravity-ui/icons";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalSales: 0,
    totalUsers: 0,
    totalRevenue: "0.00",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:5000/api/admin";

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch(`${adminUrl}/analytics`),
        fetch(`${adminUrl}/users`),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      if (statsRes.ok) setStats(statsData);
      if (usersRes.ok && Array.isArray(usersData)) setUsers(usersData);
    } catch (err) {
      console.error(err);
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
        alert("User role updated successfully!");
        fetchAdminData();
      }
    } catch (err) {
      alert("Role update failed: " + err.message);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Platform Administration</span>
              <h1 className="text-3xl font-black text-white mt-1">Admin Dashboard</h1>
              <p className="text-sm text-slate-400 mt-1">Overview of platform revenue, user accounts, and system stats.</p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600/10 border border-violet-500/20 text-violet-300 rounded-2xl text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>System Administrator</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
              <h3 className="text-3xl font-black text-emerald-400">${stats.totalRevenue}</h3>
              <p className="text-[10px] text-slate-500">Cumulative platform sales</p>
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

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Persons className="w-5 h-5 text-violet-400" />
                <h2 className="text-xl font-bold text-white">Manage Platform Users & Roles</h2>
              </div>
              <span className="text-xs text-slate-400">Total Accounts: {users.length}</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500">Loading user accounts...</div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">No user records found in database.</div>
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
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "admin"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : u.role === "artist"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>
                            {u.role || "user"}
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

        </div>
      </div>
    </ProtectedRoute>
  );
}
