"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCog, Shield, Users, Plus, Trash2 } from "lucide-react";

interface TeamMember { name: string; email: string; role: "admin" | "editor" | "viewer"; }

export default function WorkspacePage() {
  const [members, setMembers] = useState<TeamMember[]>([
    { name: "You (Owner)", email: "owner@example.com", role: "admin" },
  ]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("editor");

  const addMember = () => {
    if (!name.trim() || !email.trim()) return;
    setMembers([...members, { name, email, role }]);
    setName(""); setEmail("");
  };

  const removeMember = (idx: number) => {
    if (idx === 0) return; // Can't remove owner
    setMembers(members.filter((_, i) => i !== idx));
  };

  const roleColors: Record<string, string> = { admin: "text-rose-400 bg-rose-400/10", editor: "text-cyan-400 bg-cyan-400/10", viewer: "text-zinc-400 bg-zinc-400/10" };
  const roleIcons: Record<string, React.ReactNode> = { admin: <Shield size={12} />, editor: <UserCog size={12} />, viewer: <Users size={12} /> };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Multi-User Workspace</h1>
        <p className="text-zinc-500 text-sm">Manage team members with role-based permissions — Admin, Editor, and Viewer roles.</p>
      </motion.div>

      {/* Add Member */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Add Team Member</h3>
        <div className="flex flex-col lg:flex-row gap-3">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="glass-input flex-1 px-4 py-3 rounded-xl text-sm" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="glass-input flex-1 px-4 py-3 rounded-xl text-sm" />
          <select value={role} onChange={(e) => setRole(e.target.value as TeamMember["role"])} className="glass-input w-36 px-4 py-3 rounded-xl text-sm appearance-none">
            <option value="admin" className="bg-zinc-900">Admin</option>
            <option value="editor" className="bg-zinc-900">Editor</option>
            <option value="viewer" className="bg-zinc-900">Viewer</option>
          </select>
          <button onClick={addMember} className="gradient-bg px-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2"><Plus size={16} /> Add</button>
        </div>
      </motion.div>

      {/* Members List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Team ({members.length})</h3>
        <div className="space-y-2">
          {members.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold">{m.name.charAt(0).toUpperCase()}</div>
              <div className="flex-1">
                <p className="text-sm text-zinc-200 font-medium">{m.name}</p>
                <p className="text-xs text-zinc-500">{m.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1.5 ${roleColors[m.role]}`}>{roleIcons[m.role]} {m.role}</span>
              {i > 0 && <button onClick={() => removeMember(i)} className="text-zinc-600 hover:text-rose-400 transition-colors"><Trash2 size={14} /></button>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Permissions Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl overflow-hidden">
        <table className="data-table"><thead><tr><th>Permission</th><th>Admin</th><th>Editor</th><th>Viewer</th></tr></thead>
          <tbody>
            {[["Run AI Tools", "✓", "✓", "✗"], ["View Reports", "✓", "✓", "✓"], ["Manage API Keys", "✓", "✗", "✗"], ["Export Data", "✓", "✓", "✗"], ["Manage Team", "✓", "✗", "✗"], ["View Usage Stats", "✓", "✓", "✓"]].map(([perm, a, e, v], i) => (
              <tr key={i}><td className="text-zinc-300">{perm}</td><td className={a === "✓" ? "text-emerald-400" : "text-rose-400"}>{a}</td><td className={e === "✓" ? "text-emerald-400" : "text-rose-400"}>{e}</td><td className={v === "✓" ? "text-emerald-400" : "text-rose-400"}>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
