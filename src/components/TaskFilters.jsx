import React from 'react';
import { motion } from 'framer-motion';
import { ListFilter, CheckCircle, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TaskFilters = ({ current, onChange, stats }) => {
  const filters = [
    { id: 'all', label: 'All Logic', icon: ListFilter, count: stats.total },
    { id: 'pending', label: 'Processing', icon: Clock, count: stats.pending },
    { id: 'completed', label: 'Finalized', icon: CheckCircle, count: stats.completed },
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-obsidian-900/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner interactive-card">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={cn(
            "relative px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3 outline-none interactive-card",
            current === f.id ? "text-white" : "text-slate-500 hover:text-slate-200"
          )}
        >
          {current === f.id && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-crimson-600 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-crimson-400/30"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <f.icon className={cn("w-4 h-4 relative z-10 transition-colors", current === f.id ? "text-white" : "text-slate-600")} />
          <span className="relative z-10">{f.label}</span>
          <span className={cn(
            "relative z-10 px-2 py-0.5 rounded-md text-[10px] font-black transition-colors shadow-sm",
            current === f.id ? "bg-white/20 text-white" : "bg-obsidian-800 text-slate-600"
          )}>
            {f.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilters;
