"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    icon: <Zap size={22} />,
    monthlyPrice: 0,
    annualPrice: 0,
    accentColor: "#71717a",
    borderColor: "border-white/10",
    description: "Perfect for getting started",
    features: [
      "5 tool runs per day",
      "Basic AI models (Gemini Flash)",
      "7-day result history",
      "SERP Analyzer & Keyword Lab",
      "Community support",
    ],
    notIncluded: ["Guided Missions", "Autopilot mode", "White-label reports"],
    cta: "Start Free",
    ctaHref: "/auth/register?plan=free",
    ctaStyle: "bg-white/10 hover:bg-white/15 text-zinc-300 border border-white/10",
  },
  {
    id: "pro",
    name: "Pro",
    icon: <Crown size={22} />,
    monthlyPrice: 29,
    annualPrice: 23,
    accentColor: "#8b5cf6",
    borderColor: "border-violet-500/50",
    glow: "0 0 80px rgba(139,92,246,0.15)",
    description: "For serious content creators",
    popular: true,
    features: [
      "Unlimited tool runs",
      "All AI models (Gemini, GPT-4o, NVIDIA)",
      "All 30+ modules unlocked",
      "Guided Mission workflows (4 paths)",
      "Autopilot agent chaining",
      "PDF & CSV export",
      "30-day result history",
      "Priority email support",
      "14-day free trial",
    ],
    cta: "Start Pro Trial",
    ctaHref: "/auth/register?plan=pro",
    ctaStyle: "",
    ctaGradient: "linear-gradient(135deg, #7c3aed, #9333ea, #c026d3)",
  },
  {
    id: "agency",
    name: "Agency",
    icon: <Building2 size={22} />,
    monthlyPrice: 99,
    annualPrice: 79,
    accentColor: "#f59e0b",
    borderColor: "border-amber-500/30",
    description: "For agencies & growing teams",
    features: [
      "Everything in Pro",
      "White-label branded reports",
      "10 client sub-workspaces",
      "Public API (1,000 req/day)",
      "Bulk ops — 50 keywords at once",
      "Custom domain support",
      "Prompt Marketplace access",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Start Agency Trial",
    ctaHref: "/auth/register?plan=agency",
    ctaStyle: "bg-amber-500/10 hover:bg-amber-500/15 text-amber-300 border border-amber-500/30",
  },
];

const faqs = [
  {
    q: "Can I change plans at any time?",
    a: "Yes — upgrade or downgrade instantly. Changes take effect immediately and billing is prorated to the day.",
  },
  {
    q: "Do I need to bring my own API keys?",
    a: "No — Free and Pro plans use our shared keys with daily limits. You can optionally connect your own Gemini, OpenRouter or NVIDIA keys for unlimited usage at cost.",
  },
  {
    q: "What happens when I hit my daily run limit?",
    a: "Free users are paused until midnight UTC. Pro and Agency users have unlimited runs — no interruptions ever.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes! All paid plans include a 14-day free trial. No credit card required to start the trial.",
  },
  {
    q: "Can agencies use this for client work?",
    a: "Absolutely. The Agency plan is purpose-built for client management with white-label reports, sub-workspaces per client, and branded PDF exports.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a full refund within 7 days of your first paid charge if you are not satisfied, no questions asked.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return "$0";
    const p = annual ? plan.annualPrice : plan.monthlyPrice;
    return `$${p}`;
  };

  return (
    <div className="min-h-screen py-20 px-4" style={{ background: "#09090b" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-semibold mb-6">
            <Zap size={14} /> Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">
            Choose Your Plan
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-8">
            Start free. Scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              id="billing-monthly"
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                !annual ? "bg-violet-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              id="billing-annual"
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                annual ? "bg-violet-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"
              }`}
            >
              Annual
              <span className="text-emerald-400 text-xs font-black bg-emerald-500/20 px-1.5 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 border ${plan.borderColor} bg-white/5 ${
                plan.popular ? "md:-mt-4 md:mb-4" : ""
              }`}
              style={plan.glow ? { boxShadow: plan.glow } : {}}
            >
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-white text-xs font-black whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #c026d3)" }}
                >
                  ⚡ MOST POPULAR
                </div>
              )}

              {/* Plan Header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `${plan.accentColor}20`, color: plan.accentColor }}
                >
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-white font-black text-xl">{plan.name}</h3>
                  <p className="text-zinc-500 text-xs">{plan.description}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-white">{getPrice(plan)}</span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-zinc-500 mb-1.5">
                      /mo{annual ? " · billed annually" : ""}
                    </span>
                  )}
                </div>
                {annual && plan.monthlyPrice > 0 && (
                  <p className="text-emerald-400 text-xs mt-1 font-semibold">
                    Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year vs monthly
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-3">
                    <Check
                      size={14}
                      className="mt-0.5 shrink-0"
                      style={{ color: plan.accentColor }}
                    />
                    <span className="text-zinc-300 text-sm">{f}</span>
                  </li>
                ))}
                {plan.notIncluded?.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-3 opacity-40">
                    <span className="text-zinc-600 text-sm mt-0.5 shrink-0">✕</span>
                    <span className="text-zinc-500 text-sm line-through">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                id={`plan-cta-${plan.id}`}
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all ${plan.ctaStyle}`}
                style={plan.ctaGradient ? { background: plan.ctaGradient, color: "white" } : {}}
              >
                {plan.cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-20"
        >
          <p className="text-zinc-600 text-sm">
            All plans include access to the dashboard · API key management · Usage tracking · Archive
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-black text-white text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
              >
                <button
                  id={`faq-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-zinc-200 font-semibold text-sm">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="text-zinc-500 shrink-0 ml-4" />
                  ) : (
                    <ChevronDown size={16} className="text-zinc-500 shrink-0 ml-4" />
                  )}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-20"
        >
          <div
            className="inline-block p-px rounded-2xl"
            style={{ background: "linear-gradient(135deg, #7c3aed, #c026d3)" }}
          >
            <div className="bg-zinc-950 rounded-2xl px-10 py-8">
              <h3 className="text-2xl font-black text-white mb-2">
                Still not sure? Start for free.
              </h3>
              <p className="text-zinc-400 mb-6 text-sm">
                No credit card. 5 free tools per day. Upgrade when you&apos;re ready.
              </p>
              <Link
                href="/auth/register"
                id="bottom-cta"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea, #c026d3)" }}
              >
                Get started free <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
