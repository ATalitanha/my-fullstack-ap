"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, LogOut, Settings, Activity, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Header from "@/components/ui/header";
import HybridLoading from "../loading";

type User = { id: string; username: string; email?: string };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccessToken = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/refresh");
      const data = await res.json();
      if (res.ok) {
        const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
        setUser({
          id: payload.id,
          username: payload.username,
          email: payload.email
        });
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAccessToken();
  }, [fetchAccessToken]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) return <HybridLoading />;
  if (!user) return null;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Manage your account and access all features ✨
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* User Information Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 glass-effect rounded-2xl soft-shadow p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-lg shadow-lg">
                <User className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">User Information</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">View and manage your account information</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg p-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Username</p>
                  <p className="text-lg font-semibold text-zinc-900 dark:text-white">{user.username}</p>
                </div>
                <div className="bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg p-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-zinc-900 dark:text-white">{user.email || "Not provided"}</p>
                </div>
              </div>
              <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <Activity className="text-cyan-500" size={20} />
                  <div>
                    <p className="text-cyan-800 dark:text-cyan-300 font-semibold">Account Status: Active</p>
                    <p className="text-cyan-600 dark:text-cyan-400 text-sm">Your account is operating normally</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions & Account Management */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass-effect rounded-2xl soft-shadow p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Settings size={20} />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 px-4 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 hover:bg-cyan-500/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200 text-left font-semibold text-sm">
                  Edit Profile
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 px-4 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 hover:bg-cyan-500/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200 text-left font-semibold text-sm">
                  Change Password
                </motion.button>
              </div>
            </div>
            <div className="glass-effect rounded-2xl soft-shadow p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Account Management</h3>
              <motion.button onClick={handleLogout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 px-4 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center gap-2 font-semibold">
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mt-12 text-center"
        >
          <div className="glass-effect rounded-2xl soft-shadow p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Recent Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="text-center p-4 rounded-lg bg-cyan-500/10">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">12</div>
                <p>Calculations performed</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-violet-500/10">
                <div className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-2">8</div>
                <p>Messages sent</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-zinc-500/10">
                <div className="text-2xl font-bold text-zinc-600 dark:text-zinc-400 mb-2">5</div>
                <p>Unit conversions</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
