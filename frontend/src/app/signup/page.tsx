"use client";
 
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, User, ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
 
export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
 
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
 
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Signup failed");
      }
 
      const data = await res.json();
      
      // Store token in cookie
      document.cookie = `auth_token=${data.access_token}; path=/; max-age=604800; samesite=lax`;
      localStorage.setItem("user", JSON.stringify(data.user));
 
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle absolute top-1/4 left-1/4 w-1 h-1 bg-emerald-500/20 rounded-full" />
        <div className="particle absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-emerald-400/15 rounded-full" />
        <div className="particle absolute bottom-1/3 left-1/2 w-1 h-1 bg-emerald-300/10 rounded-full" />
      </div>
 
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-600/20 transition-all">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-xl tracking-wider">GNONYMOUS</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Initialize Credentials</h1>
          <p className="text-[--text-3] text-sm mt-2">Deploy your sovereign user profile</p>
        </div>
 
        <div className="glass-card-elevated p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
                {error}
              </div>
            )}
 
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[--text-3] px-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-4]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="glass-input w-full pl-10"
                  placeholder="Ghulam Nabi"
                  required
                />
              </div>
            </div>
 
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[--text-3] px-1">
                Sovereign Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-4]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10"
                  placeholder="name@gnonymous.ai"
                  required
                />
              </div>
            </div>
 
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[--text-3] px-1">
                Pass-Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-4]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
 
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-6 text-sm flex items-center justify-center gap-2 group"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              {loading ? (
                <div className="loading-dot" />
              ) : (
                <>
                  Initialize Deployment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
 
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[12px] text-[--text-3]">
              Already have an endpoint?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold">
                Resume Session
              </Link>
            </p>
          </div>
        </div>
 
        <div className="mt-8 text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] text-[--text-4] uppercase tracking-widest font-mono">
              Secure Key-Hashing: Argon2/Bcrypt
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
