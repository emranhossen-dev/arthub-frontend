"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
import { ShoppingBag, StarFill, Check, ArrowRight, ShieldCheck } from "@gravity-ui/icons";

export default function UserDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState(user?.subscriptionTier || "free");
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const paymentsUrl = process.env.NEXT_PUBLIC_PAYMENTS_API_URL || "https://arthub-backend.emran.work/api/payments";

  const handleUpgrade = async (tier) => {
    setUpgradeLoading(true);
    try {
      const res = await fetch(`${paymentsUrl}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.email,
          tier,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upgrade failed.");

      alert(`Congratulations! You have upgraded to ${tier.toUpperCase()} tier.`);
      setUserTier(tier);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpgradeLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Collector Portal</span>
              <h1 className="text-3xl font-black text-white mt-1">Buyer Dashboard</h1>
              <p className="text-sm text-slate-400 mt-1">Manage your artwork collection and subscription tier.</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-violet-400" />
              <span className="text-xs font-semibold text-slate-300">
                Current Plan: <span className="text-white font-bold uppercase">{userTier}</span>
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Subscription Tier Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className={`p-6 rounded-3xl border bg-slate-900 flex flex-col justify-between space-y-4 ${
                userTier === "free" ? "border-violet-500 shadow-lg shadow-violet-500/10" : "border-slate-800"
              }`}>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Starter</span>
                  <h3 className="text-2xl font-black text-white">$0 <span className="text-xs font-normal text-slate-400">/forever</span></h3>
                  <p className="text-xs text-slate-400">Perfect for casual art lovers exploring independent works.</p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Buy up to 3 artworks</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Standard community support</li>
                  </ul>
                </div>
                <button disabled className="w-full py-2.5 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold">
                  {userTier === "free" ? "Current Active Plan" : "Included"}
                </button>
              </div>

              <div className={`p-6 rounded-3xl border bg-slate-900 flex flex-col justify-between space-y-4 ${
                userTier === "pro" ? "border-violet-500 shadow-lg shadow-violet-500/10" : "border-slate-800"
              }`}>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Pro Collector</span>
                  <h3 className="text-2xl font-black text-white">$9.99 <span className="text-xs font-normal text-slate-400">/month</span></h3>
                  <p className="text-xs text-slate-400">For avid collectors building a diverse gallery.</p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Buy up to 9 artworks</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Priority artist communication</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleUpgrade("pro")}
                  disabled={userTier === "pro" || upgradeLoading}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {userTier === "pro" ? "Current Active Plan" : "Upgrade to Pro"}
                </button>
              </div>

              <div className={`p-6 rounded-3xl border bg-slate-900 flex flex-col justify-between space-y-4 relative overflow-hidden ${
                userTier === "premium" ? "border-fuchsia-500 shadow-lg shadow-fuchsia-500/10" : "border-slate-800"
              }`}>
                <span className="absolute top-3 right-3 bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">Best Value</span>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Unlimited VIP</span>
                  <h3 className="text-2xl font-black text-white">$19.99 <span className="text-xs font-normal text-slate-400">/month</span></h3>
                  <p className="text-xs text-slate-400">Unlimited purchases, early access to new releases.</p>
                  <ul className="space-y-2 pt-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited artwork purchases</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Early access & VIP badge</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleUpgrade("premium")}
                  disabled={userTier === "premium" || upgradeLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {userTier === "premium" ? "Current Active Plan" : "Upgrade to Premium"}
                </button>
              </div>

            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-violet-400" />
                <span>My Purchased Artworks</span>
              </h2>
              <Link href="/browse" className="text-xs font-bold text-violet-400 hover:underline flex items-center gap-1">
                <span>Browse More Artworks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="text-center py-12 space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">Your collection is waiting to grow!</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Explore available digital paintings, sculptures, and photography in our gallery marketplace.</p>
              <Link href="/browse" className="inline-block mt-2 px-5 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-full transition">
                Start Exploring
              </Link>
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
