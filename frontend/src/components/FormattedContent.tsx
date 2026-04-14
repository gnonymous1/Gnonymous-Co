import React from "react";

export function FormattedContent({ content }: { content: string }) {
  if (!content) return null;

  // Enhance the content hierarchically
  let html = content
    // Headers with borders and hierarchy
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-zinc-100 mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-violet-400 mt-8 mb-3 border-b border-white/10 pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mt-8 mb-4">$1</h1>')
    
    // Emphasis and bold with subtle color highlights
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-zinc-200">$1</strong>')
    .replace(/(?<!\w)\*(.*?)\*(?!\w)/gim, '<em class="text-emerald-300/90 italic">$1</em>')
    
    // Blockquotes with effective Left Border formatting
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-violet-500 bg-violet-500/10 p-3 my-4 rounded-r-xl text-zinc-300 italic">$1</blockquote>')
    
    // Lists properly indented
    .replace(/^\s*\-\s+(.*$)/gim, '<li class="ml-5 list-disc marker:text-violet-500 text-zinc-400 mb-1">$1</li>')
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-5 list-decimal marker:text-cyan-500 text-zinc-400 mb-1">$1</li>')
    
    // Paragraph splitting
    .replace(/\n\n/gim, '</p><p class="mt-3 text-zinc-400 leading-relaxed">')
    
    // Line breaks for things that arent lists or headers
    .replace(/(?<!>|<\/?h[1-3]>|<\/?li>)\n/gim, '<br />');

  return (
    <div className="bg-[#0f0f14] border border-[#27272a] rounded-2xl shadow-inner overflow-hidden relative">
      {/* Subtle top gradient glow for visual hierarchy */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-50"></div>
      
      <div 
        className="p-6 text-sm text-zinc-400 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: `<p class="mt-0 text-zinc-400 leading-relaxed">${html}</p>` }} 
      />
    </div>
  );
}
