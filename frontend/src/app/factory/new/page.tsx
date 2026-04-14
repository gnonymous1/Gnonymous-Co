"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Factory, Sparkles, Wand2, Layers, CheckCircle2, Play, Settings2, 
  Search, TrendingUp, FileText, Image, Share2, Hash, Globe,
  ChevronRight, ChevronDown, X, Clock, AlertCircle, RefreshCw,
  ArrowRight, Zap, Brain, Target, Loader2, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useGlobalStore } from "@/stores/useGlobalStore";

// Pipeline step definitions
const PIPELINE_STEPS = [
  { id: 1, name: "SEO Research", type: "seo_research", description: "Research keywords, competition, and search trends", icon: Search, color: "blue" },
  { id: 2, name: "Topic Analysis", type: "topic_analysis", description: "Analyze trending aspects and content angles", icon: TrendingUp, color: "purple" },
  { id: 3, name: "Script Generation", type: "script_generation", description: "Generate engaging video script with hooks", icon: FileText, color: "violet" },
  { id: 4, name: "Description Writer", type: "description_writer", description: "Write SEO-optimized descriptions", icon: FileText, color: "cyan" },
  { id: 5, name: "Thumbnail Concept", type: "thumbnail_concept", description: "Generate click-worthy thumbnail ideas", icon: Image, color: "pink" },
  { id: 6, name: "Social Posts", type: "social_posts", description: "Create platform-specific social posts", icon: Share2, color: "orange" },
  { id: 7, name: "Hashtag Strategy", type: "hashtag_strategy", description: "Generate hashtag recommendations", icon: Hash, color: "green" },
  { id: 8, name: "SEO Optimization", type: "seo_optimization", description: "Final SEO polish and metadata", icon: Globe, color: "amber" },
];

// Color mapping for step icons
const stepColors: Record<string, string> = {
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  violet: "text-violet-400 bg-violet-500/10 border-violet-500/30",
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  pink: "text-pink-400 bg-pink-500/10 border-pink-500/30",
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
};

interface JobStatus {
  job_id: string;
  status: string;
  progress: number;
  current_step: string;
  completed_steps: number;
  total_steps: number;
}

interface StepStatus {
  step_order: number;
  step_name: string;
  step_type: string;
  status: string;
  progress: number;
  output_data?: any;
  error_message?: string;
  duration_seconds?: number;
}

export default function ContentFactoryNewPage() {
  const { modelPreferences } = useGlobalStore();
  const [topic, setTopic] = useState("");
  const [enabledSteps, setEnabledSteps] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobStatus | null>(null);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Derive active provider and model from global store
  // For the pipeline we use the ai_content preference as the primary source
  const activeProvider = modelPreferences.ai_content; // "gemini" | "openrouter" | "nvidia"
  const activeModel = activeProvider === "openrouter"
    ? modelPreferences.openRouterModel
    : activeProvider === "gemini"
    ? "gemini-2.0-flash-exp"
    : "nvidia/llama-3.1-70b";

  const providerLabels: Record<string, string> = {
    gemini: "Google Gemini",
    openrouter: "OpenRouter",
    nvidia: "NVIDIA NIM",
  };

  const modelDisplayName =
    activeProvider === "openrouter"
      ? (modelPreferences.openRouterModel?.split("/")[1] || modelPreferences.openRouterModel)
      : activeModel;

  const toggleStep = (id: number) => {
    setEnabledSteps(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id].sort((a, b) => a - b)
    );
  };

  const selectAllSteps = () => {
    setEnabledSteps(PIPELINE_STEPS.map(s => s.id));
  };

  const clearAllSteps = () => {
    setEnabledSteps([]);
  };

  // Poll for job status
  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`/api/pipeline/jobs/${jobId}`);
      if (!response.ok) return;
      
      const data = await response.json();
      if (data.job) {
        setCurrentJob({
          job_id: data.job.id,
          status: data.job.status,
          progress: data.job.progress,
          current_step: data.job.current_step,
          completed_steps: data.job.completed_steps,
          total_steps: data.job.total_steps,
        });
        
        if (data.steps) {
          setStepStatuses(data.steps.map((s: any) => ({
            step_order: s.step_order,
            step_name: s.step_name,
            step_type: s.step_type,
            status: s.status,
            progress: s.progress,
            output_data: s.output_data,
            error_message: s.error_message,
            duration_seconds: s.duration_seconds,
          })));
        }
        
        if (data.job.status === "completed" || data.job.status === "failed") {
          setIsRunning(false);
          if (data.job.status === "completed") {
            setResults(data.job.result_data);
            setShowResults(true);
          }
        }
      }
    } catch (error) {
      console.error("Failed to poll job status:", error);
    }
  }, []);

  // Start pipeline
  const startPipeline = async () => {
    if (!topic.trim()) return;
    
    setIsRunning(true);
    setCurrentJob({
      job_id: "",
      status: "starting",
      progress: 0,
      current_step: "Initializing",
      completed_steps: 0,
      total_steps: enabledSteps.length,
    });
    setStepStatuses([]);
    setShowResults(false);
    
    try {
      const response = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          enabled_steps: enabledSteps,
          model_pref: activeProvider,
          model: activeModel,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to start pipeline");
      }
      
      const data = await response.json();
      if (data.job_id) {
        setCurrentJob(prev => prev ? { ...prev, job_id: data.job_id } : null);
        
        // Start polling
        const pollInterval = setInterval(() => {
          pollJobStatus(data.job_id);
        }, 2000);
        
        // Store interval to clear later
        (window as any).pollInterval = pollInterval;
      }
    } catch (error) {
      console.error("Failed to start pipeline:", error);
      setIsRunning(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ((window as any).pollInterval) {
        clearInterval((window as any).pollInterval);
      }
    };
  }, []);

  // Get current step info
  const getStepStatus = (stepId: number): StepStatus | undefined => {
    return stepStatuses.find(s => s.step_order === stepId);
  };

  const getStepState = (step: typeof PIPELINE_STEPS[0]): "completed" | "active" | "pending" | "failed" => {
    const status = getStepStatus(step.id);
    if (status) {
      if (status.status === "completed") return "completed";
      if (status.status === "failed") return "failed";
      if (status.status === "processing") return "active";
    }
    if (currentJob?.current_step === step.name && currentJob?.status === "processing") return "active";
    return "pending";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
        <div className="w-16 h-16 rounded-2xl gradient-bg mx-auto flex items-center justify-center mb-4 shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]">
          <Factory size={32} className="text-white"/>
        </div>
        <h1 className="text-4xl font-black text-white mb-2">Pipeline Builder</h1>
        <p className="text-zinc-500 text-lg">Chain multiple AI agents together for one-click content generation.</p>
      </motion.div>

      {/* Topic Input */}
      <div className="glass-card p-8 rounded-3xl relative overflow-hidden border-violet-500/20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Primary Topic / Seed</label>
            <input 
              type="text" 
              value={topic} 
              onChange={e=>setTopic(e.target.value)} 
              placeholder="e.g., 'How AI is changing healthcare 2026'"
              disabled={isRunning}
              className="glass-input w-full px-5 py-4 rounded-2xl text-lg font-medium bg-black/40 disabled:opacity-50"
            />
          </div>

          {/* Pipeline Steps Selector */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Layers size={14} />
                Pipeline Stages
              </label>
              <div className="flex gap-2">
                <button 
                  onClick={selectAllSteps}
                  disabled={isRunning}
                  className="text-[10px] text-violet-400 hover:text-white disabled:opacity-50"
                >
                  Select All
                </button>
                <span className="text-zinc-600">|</span>
                <button 
                  onClick={clearAllSteps}
                  disabled={isRunning}
                  className="text-[10px] text-zinc-500 hover:text-white disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {PIPELINE_STEPS.map((step) => {
                const Icon = step.icon;
                const isEnabled = enabledSteps.includes(step.id);
                const stepState = getStepState(step);
                const stepStatus = getStepStatus(step.id);
                
                return (
                  <div 
                    key={step.id} 
                    onClick={() => !isRunning && toggleStep(step.id)}
                    className={`
                      relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden
                      ${isEnabled 
                        ? stepColors[step.color] 
                        : "bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10"
                      }
                      ${isRunning && isEnabled ? "cursor-default" : ""}
                    `}
                  >
                    {/* Progress overlay for active step */}
                    {stepState === "active" && (
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-current transition-all duration-300"
                        style={{ width: `${stepStatus?.progress || 0}%` }}
                      />
                    )}
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isEnabled ? "bg-black/40" : "bg-black/20"}`}>
                          {stepState === "completed" ? (
                            <CheckCircle2 size={16} className="text-emerald-400" />
                          ) : stepState === "failed" ? (
                            <AlertCircle size={16} className="text-rose-400" />
                          ) : stepState === "active" ? (
                            <Loader2 size={16} className="text-current animate-spin" />
                          ) : (
                            <span className="text-[10px] font-bold">{step.id}</span>
                          )}
                        </div>
                        {stepState === "completed" && (
                          <CheckCircle2 size={18} className="text-emerald-400" />
                        )}
                      </div>
                      <h3 className={`font-bold text-sm mb-1 ${isEnabled ? "text-zinc-200" : ""}`}>{step.name}</h3>
                      <p className="text-[10px] text-zinc-500 line-clamp-2">{step.description}</p>
                      
                      {/* Duration for completed steps */}
                      {stepStatus?.duration_seconds && (
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-zinc-500">
                          <Clock size={10} />
                          {stepStatus.duration_seconds}s
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Model Info + Run Button */}
          <div className="flex items-center justify-between pt-2 gap-4 flex-wrap">
            {/* Read-only active model badge */}
            <div className="flex items-center gap-2">
              <Settings2 size={14} className="text-zinc-600" />
              <span className="text-[11px] text-zinc-600 uppercase tracking-widest font-bold">Active Model</span>
              <span className="px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-mono">
                {providerLabels[activeProvider]} · {modelDisplayName}
              </span>
              <Link
                href="/settings/model-selection"
                className="text-[10px] text-zinc-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={10} />
                Change
              </Link>
            </div>
            
            <button 
              onClick={startPipeline}
              disabled={!topic.trim() || isRunning || enabledSteps.length === 0}
              className="px-8 py-4 rounded-2xl text-white font-black text-lg shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] flex items-center gap-3 hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: isRunning ? "linear-gradient(135deg, #f97316, #db2777)" : undefined }}
            >
              {isRunning ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing Pipeline...
                </>
              ) : (
                <>
                  <Play fill="currentColor" size={20}/>
                  Initialize Content Pipeline
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Pipeline Progress */}
      {isRunning && currentJob && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Loader2 size={20} className="text-violet-400 animate-spin" />
                Pipeline Running
              </h3>
              <p className="text-sm text-zinc-500">
                Job ID: <span className="font-mono text-violet-400">{currentJob.job_id}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-violet-400">{currentJob.progress}%</p>
              <p className="text-xs text-zinc-500">
                Step {currentJob.completed_steps + 1} of {currentJob.total_steps}
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden mb-6">
            <motion.div 
              className="h-full rounded-full gradient-bg"
              initial={{ width: 0 }}
              animate={{ width: `${currentJob.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Step timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10"></div>
            
            <div className="space-y-4">
              {PIPELINE_STEPS.filter(s => enabledSteps.includes(s.id)).map((step, index) => {
                const stepState = getStepState(step);
                const stepStatus = getStepStatus(step.id);
                const Icon = step.icon;
                
                return (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 relative"
                  >
                    {/* Step indicator */}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center z-10
                      ${stepState === "completed" ? "bg-emerald-500" : ""}
                      ${stepState === "active" ? "bg-violet-500 animate-pulse" : ""}
                      ${stepState === "failed" ? "bg-rose-500" : ""}
                      ${stepState === "pending" ? "bg-black/50 border border-white/20" : ""}
                    `}>
                      {stepState === "completed" ? (
                        <CheckCircle2 size={14} className="text-white" />
                      ) : stepState === "failed" ? (
                        <AlertCircle size={14} className="text-white" />
                      ) : stepState === "active" ? (
                        <Loader2 size={14} className="text-white animate-spin" />
                      ) : (
                        <span className="text-[10px] text-zinc-500">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* Step content */}
                    <div className="flex-1 bg-black/20 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon size={16} className="text-zinc-500" />
                          <h4 className="font-bold text-zinc-300">{step.name}</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          {stepState === "completed" && stepStatus?.duration_seconds && (
                            <span className="text-xs text-emerald-400">
                              {stepStatus.duration_seconds}s
                            </span>
                          )}
                          {stepState === "active" && (
                            <span className="text-xs text-violet-400 animate-pulse">
                              Processing...
                            </span>
                          )}
                          {stepState === "failed" && (
                            <span className="text-xs text-rose-400">
                              {stepStatus?.error_message || "Failed"}
                            </span>
                          )}
                          {stepState === "pending" && (
                            <span className="text-xs text-zinc-600">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Step progress bar for active step */}
                      {stepState === "active" && (
                        <div className="mt-3">
                          <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-violet-500 rounded-full"
                              style={{ width: `${stepStatus?.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && results && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowResults(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-zinc-900 border border-violet-500/30 rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Pipeline Complete!</h2>
                    <p className="text-zinc-500">All steps finished successfully</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowResults(false)}
                  className="p-2 hover:bg-white/10 rounded-xl"
                >
                  <X size={24} className="text-zinc-500" />
                </button>
              </div>
              
              {/* Results Content */}
              <div className="space-y-6">
                {results.script_generation && (
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-violet-400 mb-4 flex items-center gap-2">
                      <FileText size={18} />
                      Generated Script
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase">Title</label>
                        <p className="text-white font-medium">{results.script_generation.title}</p>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 uppercase">Hook</label>
                        <p className="text-zinc-300">{results.script_generation.hook}</p>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 uppercase">Sections</label>
                        <div className="space-y-2 mt-2">
                          {results.script_generation.sections?.map((section: any, i: number) => (
                            <div key={i} className="bg-black/30 p-3 rounded-xl">
                              <p className="text-violet-300 font-medium">{section.heading}</p>
                              <p className="text-zinc-400 text-sm">{section.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {results.description_writer && (
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                      <FileText size={18} />
                      YouTube Description
                    </h3>
                    <p className="text-zinc-300 whitespace-pre-wrap">{results.description_writer.description}</p>
                  </div>
                )}
                
                {results.thumbnail_concept && (
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
                      <Image size={18} />
                      Thumbnail Concepts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {results.thumbnail_concept.concepts?.map((concept: any, i: number) => (
                        <div key={i} className="bg-black/30 p-4 rounded-xl">
                          <h4 className="font-bold text-white mb-2">{concept.title}</h4>
                          <p className="text-sm text-zinc-400 mb-2">{concept.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500">Click Score:</span>
                            <span className="text-amber-400">{concept.click_bait_score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {results.social_posts && (
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
                      <Share2 size={18} />
                      Social Media Posts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-black/30 p-4 rounded-xl">
                        <h4 className="font-bold text-blue-400 mb-2">Twitter/X</h4>
                        <p className="text-sm text-zinc-300">{results.social_posts.twitter?.post}</p>
                      </div>
                      <div className="bg-black/30 p-4 rounded-xl">
                        <h4 className="font-bold text-pink-400 mb-2">Instagram</h4>
                        <p className="text-sm text-zinc-300">{results.social_posts.instagram?.caption}</p>
                      </div>
                      <div className="bg-black/30 p-4 rounded-xl">
                        <h4 className="font-bold text-cyan-400 mb-2">TikTok</h4>
                        <p className="text-sm text-zinc-300">{results.social_posts.tiktok?.caption}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {results.hashtag_strategy && (
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <Hash size={18} />
                      Hashtag Strategy
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase">Primary</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {results.hashtag_strategy.primary_hashtags?.map((tag: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 uppercase">Niche</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {results.hashtag_strategy.niche_hashtags?.map((tag: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 uppercase">Trending</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {results.hashtag_strategy.trending_hashtags?.map((tag: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => {
                    setShowResults(false);
                    setTopic("");
                    setEnabledSteps([1, 2, 3, 4, 5, 6]);
                  }}
                  className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-bold"
                >
                  Start New Pipeline
                </button>
                <Link 
                  href="/factory"
                  className="flex-1 py-4 bg-violet-600 hover:bg-violet-500 rounded-2xl text-white font-bold text-center flex items-center justify-center gap-2"
                >
                  View All Jobs
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
