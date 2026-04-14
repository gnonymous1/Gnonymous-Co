"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Zap, Search, BarChart3, Mail, Lock, Eye, EyeOff, Globe } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) setError("Invalid email or password.");
    else router.push("/");
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/" });

  const features = [
    { icon: <Search size={16} />, text: "8 AI SEO tools — SERP analysis, rank tracking & more" },
    { icon: <BarChart3 size={16} />, text: "6 YouTube intelligence tools with competitor spy" },
    { icon: <Zap size={16} />, text: "Autopilot agent chaining across 30+ modules" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#09090b" }}>
      {/* Left Branding Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #9333ea 70%, #c026d3 100%)" }}
      >
        {/* BG decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #ffffff, transparent)" }} />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #ffffff, transparent)" }} />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Zap size={22} className="text-white" />
          </div>
          <div>
            <span className="text-white font-black text-lg">Apex Content OS</span>
            <p className="text-purple-300 text-xs">v7.0 — Global Dominance</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">
            The AI Platform<br />
            <span className="text-purple-200">That Prints</span><br />
            Results.
          </h1>
          <p className="text-purple-200 text-base mb-10 leading-relaxed">
            30 AI modules. One platform. SEO domination,<br />YouTube growth, TikTok virality — automated.
          </p>
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white shrink-0">
                  {f.icon}
                </div>
                <span className="text-purple-100 text-sm">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative text-purple-400 text-xs">© 2026 Apex Content OS. All rights reserved.</p>
      </motion.div>

      {/* Right Form Panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Zap size={24} className="text-violet-400" />
            <span className="text-white font-bold text-lg">Apex Content OS</span>
          </div>

          <h2 className="text-3xl font-black text-white mb-1">Welcome back</h2>
          <p className="text-zinc-500 mb-8">Sign in to your workspace to continue</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleCredentials} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors text-sm"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors text-sm"
              />
              <button
                type="button"
                id="toggle-password"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-50 hover:opacity-90 text-sm"
              style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea, #c026d3)" }}
            >
              {loading ? "Signing in…" : "Sign In to Workspace"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-zinc-600 text-xs">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            id="google-signin"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 transition-colors font-medium text-sm"
          >
            <Globe size={18} /> Continue with Google
          </button>

          <p className="text-center text-zinc-600 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Create one free →
            </Link>
          </p>

          <p className="text-center text-zinc-700 text-xs mt-4">
            <Link href="/pricing" className="hover:text-zinc-500 transition-colors">View pricing</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
