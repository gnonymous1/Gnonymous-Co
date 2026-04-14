"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Zap, User, Mail, Lock, Check, Crown, Building2 } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    icon: <Zap size={14} />,
    features: ["5 tools/day", "Basic AI", "7-day history"],
    color: "#71717a",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29/mo",
    icon: <Crown size={14} />,
    features: ["Unlimited", "All AI models", "Missions + Autopilot"],
    color: "#8b5cf6",
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: "$99/mo",
    icon: <Building2 size={14} />,
    features: ["Everything+", "White-label", "API access"],
    color: "#f59e0b",
  },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (!result?.error) router.push("/");
  };

  const perks = [
    "No credit card required for free tier",
    "Upgrade or cancel anytime",
    "Full access to 30+ AI tools",
    "Works with your own API keys",
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#09090b" }}>
      {/* Left Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #9333ea 70%, #c026d3 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #ffffff, transparent)" }} />
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
            Start free.<br />
            <span className="text-purple-200">Scale to</span><br />
            dominance.
          </h1>
          <p className="text-purple-200 text-base mb-10 leading-relaxed">
            Join thousands of creators and agencies already using Apex to crush their competition.
          </p>
          <div className="space-y-3">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white" />
                </div>
                <span className="text-purple-100 text-sm">{perk}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative text-purple-400 text-xs">© 2026 Apex Content OS. All rights reserved.</p>
      </motion.div>

      {/* Right Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8 overflow-y-auto"
      >
        <div className="w-full max-w-lg py-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Zap size={24} className="text-violet-400" />
            <span className="text-white font-bold text-lg">Apex Content OS</span>
          </div>

          <h2 className="text-3xl font-black text-white mb-1">Create your account</h2>
          <p className="text-zinc-500 mb-6">Choose a plan and get started in seconds</p>

          {/* Plan Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {plans.map(plan => (
              <button
                key={plan.id}
                id={`plan-${plan.id}`}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-4 rounded-xl border text-left transition-all ${
                  selectedPlan === plan.id
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/8"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black bg-violet-600 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                    POPULAR
                  </span>
                )}
                <div className="flex items-center gap-1.5 mb-1" style={{ color: plan.color }}>
                  {plan.icon}
                  <span className="font-bold text-white text-sm">{plan.name}</span>
                </div>
                <p className="font-black text-base mb-2" style={{ color: plan.color }}>{plan.price}</p>
                <ul className="space-y-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Check size={8} style={{ color: plan.color }} /> {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors text-sm"
              />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                id="register-email"
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
                id="register-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                minLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors text-sm"
              />
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-50 hover:opacity-90 text-sm"
              style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea, #c026d3)" }}
            >
              {loading
                ? "Creating account…"
                : `Start with ${plans.find(p => p.id === selectedPlan)?.name} plan`}
            </button>
          </form>

          <p className="text-center text-zinc-600 text-sm mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Sign in →
            </Link>
          </p>

          <p className="text-center text-zinc-700 text-[11px] mt-3">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
