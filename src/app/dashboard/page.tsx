"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/ui/header";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // گرفتن access token از حافظه یا refresh
  const fetchAccessToken = async () => {
    const res = await fetch("/api/auth/refresh");
    const data = await res.json();
    if (res.ok) {
      setToken(data.accessToken);
      const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
      setUser({ id: payload.id, username: payload.username });
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchAccessToken();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header/>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 text-white"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

        <div className="bg-white/10 p-6 rounded-xl shadow-inner text-center space-y-3">
          <p className="text-xl font-semibold">
            Welcome, <span className="text-indigo-400">{user.username}</span>
          </p>
          <p className="text-gray-300 text-sm">User ID: {user.id}</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg transition duration-300 cursor-pointer"
        >
          Logout
        </button>
      </motion.div>
    </div>
  );
}
