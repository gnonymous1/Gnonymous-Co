"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Factory, Activity, CheckCircle2, AlertCircle, Clock, Play, Pause, 
  ExternalLink, Loader2, ChevronRight, X, FileText, Image, Share2, Hash
} from "lucide-react";
import Link from "next/link";

interface PipelineJob {
  id: string;
  topic: string;
  status: string;
  progress: number;
  current_step: string;
  total_steps: number;
  completed_steps: number;
  error_message?: string;
  created_at: string;
  updated_at?: string;
}

interface PipelineStep {
  id: number;
  step_order: number;
  step_name: string;
  step_type: string;
  status: string;
  progress: number;
  output_data?: any;
  error_message?: string;
  duration_seconds?: number;
}

export default function FactoryActiveJobsPage() {
  const [jobs, setJobs] = useState<PipelineJob[]>([]);
  const [stats, setStats] = useState({
    processing: 0,
    completed: 0,
    success_rate: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<PipelineJob | null>(null);
  const [jobSteps, setJobSteps] = useState<PipelineStep[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch("/api/pipeline/jobs?limit=20");
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/pipeline/stats");
      const data = await response.json();
      setStats({
        processing: data.stats?.processing || 0,
        completed: data.stats?.completed || 0,
        success_rate: data.stats?.success_rate || 0,
        total: data.stats?.total_jobs || 0
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  const fetchJobDetails = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`/api/pipeline/jobs/${jobId}`);
      const data = await response.json();
      if (data.job) {
        setSelectedJob(data.job);
        setJobSteps(data.steps || []);
      }
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchStats()]);
      setLoading(false);
    };
    loadData();
    
    // Refresh every 10 seconds
    const interval = setInterval(() => {
      fetchJobs();
      fetchStats();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [fetchJobs, fetchStats]);

  const viewJobDetails = (job: PipelineJob) => {
    fetchJobDetails(job.id);
    setShowDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500/10 text-emerald-400";
      case "failed": return "bg-rose-500/10 text-rose-400";
      case "processing": return "bg-violet-500/10 text-violet-400 animate-pulse";
      default: return "bg-zinc-500/10 text-zinc-400";
    }
  };

  const getStepIcon = (stepType: string) => {
    switch (stepType) {
      case "seo_research": return "search";
      case "topic_analysis": return "trending_up";
      case "script_generation": return "file_text";
      case "description_writer": return "file_text";
      case "thumbnail_concept": return "image";
      case "social_posts": return "share";
      case "hashtag_strategy": return "hash";
      case "seo_optimization": return "globe";
      default: return "file_text";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2 mb-1">
            <Activity className="text-violet-400"/> Active Pipelines
          </h1>
          <p className="text-zinc-500 text-sm">Monitor and manage asynchronous content generation jobs.</p>
        </div>
        <Link 
          href="/factory/new"
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-bold text-sm flex items-center gap-2"
        >
          <Factory size={16} />
          New Pipeline
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Total Jobs</p>
          <p className="text-3xl font-black text-zinc-100">{stats.total}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Processing</p>
          <p className="text-3xl font-black text-cyan-400">{stats.processing}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Completed (24h)</p>
          <p className="text-3xl font-black text-emerald-400">{stats.completed}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Success Rate</p>
          <p className="text-3xl font-black text-zinc-100">{stats.success_rate}%</p>
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl flex items-center justify-center">
          <Loader2 size={32} className="text-violet-400 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <Factory size={48} className="text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-zinc-400 mb-2">No Pipeline Jobs</h3>
          <p className="text-zinc-500 mb-4">Create your first content pipeline to get started.</p>
          <Link 
            href="/factory/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-bold"
          >
            <Play size={18} />
            Create Pipeline
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div 
              key={job.id} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.1 }} 
              className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => viewJobDetails(job)}
            >
              {/* Background Progress Bar */}
              {job.status === "processing" && (
                <div 
                  className="absolute top-0 left-0 h-full bg-violet-500/5 transition-all duration-1000" 
                  style={{ width: `${job.progress}%` }}
                />
              )}

              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-zinc-500 font-mono">{job.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-200">{job.topic}</h3>
              </div>

              <div className="relative z-10 w-full md:w-1/3">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-zinc-400">{job.current_step}</span>
                  <span className="text-zinc-300 font-bold">{job.progress}%</span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      job.status === 'completed' ? 'bg-emerald-500' : 
                      job.status === 'failed' ? 'bg-rose-500' : 'bg-violet-500'
                    }`} 
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  Step {job.completed_steps} of {job.total_steps}
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                    <Clock size={10}/> Created
                  </p>
                  <p className="text-sm font-mono text-zinc-300">
                    {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {job.status === 'processing' && (
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
                      <Pause size={16} className="text-amber-400"/>
                    </button>
                  )}
                  {job.status === 'completed' && (
                    <button className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-2 hover:bg-emerald-500/20">
                      <ExternalLink size={14}/> View Output
                    </button>
                  )}
                  {job.status === 'failed' && (
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
                      <Play size={16} className="text-cyan-400"/>
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {showDetails && selectedJob && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetails(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-zinc-900 border border-violet-500/30 rounded-3xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="font-mono text-violet-400">{selectedJob.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedJob.status)}`}>
                    {selectedJob.status}
                  </span>
                </h2>
                <p className="text-zinc-500 mt-1">{selectedJob.topic}</p>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-white/10 rounded-xl"
              >
                <X size={24} className="text-zinc-500" />
              </button>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Overall Progress</span>
                <span className="text-white font-bold">{selectedJob.progress}%</span>
              </div>
              <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    selectedJob.status === 'completed' ? 'bg-emerald-500' : 
                    selectedJob.status === 'failed' ? 'bg-rose-500' : 'bg-violet-500'
                  }`}
                  style={{ width: `${selectedJob.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mt-2">
                <span>Current: {selectedJob.current_step}</span>
                <span>Step {selectedJob.completed_steps} of {selectedJob.total_steps}</span>
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Pipeline Steps</h3>
              {jobSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`
                    flex items-center gap-4 p-4 rounded-xl border
                    ${step.status === "completed" ? "bg-emerald-500/5 border-emerald-500/20" : ""}
                    ${step.status === "processing" ? "bg-violet-500/5 border-violet-500/20" : ""}
                    ${step.status === "failed" ? "bg-rose-500/5 border-rose-500/20" : ""}
                    ${step.status === "pending" ? "bg-white/5 border-white/5" : ""}
                  `}
                >
                  {/* Step indicator */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center shrink-0
                    ${step.status === "completed" ? "bg-emerald-500" : ""}
                    ${step.status === "processing" ? "bg-violet-500 animate-pulse" : ""}
                    ${step.status === "failed" ? "bg-rose-500" : ""}
                    ${step.status === "pending" ? "bg-black/50 border border-white/20" : ""}
                  `}>
                    {step.status === "completed" ? (
                      <CheckCircle2 size={18} className="text-white" />
                    ) : step.status === "failed" ? (
                      <AlertCircle size={18} className="text-white" />
                    ) : step.status === "processing" ? (
                      <Loader2 size={18} className="text-white animate-spin" />
                    ) : (
                      <span className="text-xs text-zinc-500">{step.step_order}</span>
                    )}
                  </div>

                  {/* Step info */}
                  <div className="flex-1">
                    <h4 className="font-bold text-zinc-200">{step.step_name}</h4>
                    <p className="text-xs text-zinc-500">{step.step_type}</p>
                  </div>

                  {/* Step status */}
                  <div className="text-right">
                    {step.status === "completed" && step.duration_seconds && (
                      <span className="text-xs text-emerald-400">{step.duration_seconds}s</span>
                    )}
                    {step.status === "processing" && (
                      <span className="text-xs text-violet-400 animate-pulse">Processing...</span>
                    )}
                    {step.status === "failed" && (
                      <span className="text-xs text-rose-400">{step.error_message || "Failed"}</span>
                    )}
                    {step.status === "pending" && (
                      <span className="text-xs text-zinc-600">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Error message if failed */}
            {selectedJob.status === "failed" && selectedJob.error_message && (
              <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Error
                </h4>
                <p className="text-zinc-300 text-sm">{selectedJob.error_message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowDetails(false)}
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-bold"
              >
                Close
              </button>
              {selectedJob.status === "completed" && (
                <Link 
                  href="/factory/new"
                  className="flex-1 py-4 bg-violet-600 hover:bg-violet-500 rounded-2xl text-white font-bold text-center"
                >
                  Run New Pipeline
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
