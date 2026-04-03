import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Calendar, Clock, AlertTriangle, Bell, Pencil, X, Save, AlignLeft, ChevronDown, Activity, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TaskItem = ({ task, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempText, setTempText] = useState(task.text);
  const [tempDate, setTempDate] = useState(task.dueDate || '');
  const [tempTime, setTempTime] = useState(task.dueTime || '');
  const [tempDescription, setTempDescription] = useState(task.description || '');
  const inputRef = useRef(null);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date().setHours(0,0,0,0);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (tempText.trim()) {
      onUpdate(task.id, { 
        text: tempText.trim(),
        dueDate: tempDate || null,
        dueTime: tempTime || null,
        description: tempDescription.trim()
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempText(task.text);
    setTempDate(task.dueDate || '');
    setTempTime(task.dueTime || '');
    setTempDescription(task.description || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const toggleExpand = (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: -30, transition: { duration: 0.3 } }}
      whileHover={!isEditing ? { y: -6, transition: { duration: 0.4, ease: "easeOut" } } : {}}
      className="group relative cursor-none"
      onClick={toggleExpand}
    >
      <div className={cn(
        "glass-card p-6 rounded-[2.5rem] flex flex-col gap-0 transition-all duration-700 shadow-premium relative overflow-hidden interactive-card neon-border-hover",
        task.completed && !isEditing ? "opacity-70 grayscale-[0.3]" : "hover:bg-white/[0.04]",
        isEditing && "border-crimson-500/60 scale-[1.03] shadow-[0_0_35px_rgba(220,38,38,0.2)] cursor-none",
        isExpanded && "border-white/10"
      )}>
        
        {/* Molten Neon Indicator Pillar */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-2.5 transition-all duration-700 shadow-[0_0_15px_rgba(220,38,38,0.4)]",
          task.completed ? "bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.6)]" : (isOverdue ? "bg-crimson-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]" : "bg-crimson-400 opacity-60")
        )} />

        {/* Neural Orchestration Layer */}
        <div className="flex items-center gap-6 w-full">
          {!isEditing && (
            <button
              onClick={() => onToggle(task.id)}
              className={cn(
                "flex-shrink-0 w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 shadow-lg interactive-card",
                task.completed 
                  ? "bg-rose-500 border-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]" 
                  : "border-obsidian-800 text-transparent hover:border-crimson-500/60 hover:text-crimson-500/60"
              )}
            >
              <Check className={cn("w-6 h-6 transition-all duration-500", task.completed ? "scale-100 rotate-0" : "scale-0 rotate-45")} />
            </button>
          )}

          <div className="flex-grow min-w-0 py-2">
            {isEditing ? (
              <div className="space-y-5 pr-12">
                <input
                  ref={inputRef}
                  type="text"
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-obsidian-950/80 border border-white/5 rounded-2xl px-6 py-4 text-xl text-white font-black outline-none focus:border-crimson-500/60 transition-all shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]"
                  placeholder="Task title..."
                />
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-obsidian-950 border border-white/5 focus-within:border-crimson-500/40 transition-all shadow-inner">
                    <Calendar className="w-4.5 h-4.5 text-crimson-500" />
                    <input 
                      type="date"
                      value={tempDate}
                      onChange={(e) => setTempDate(e.target.value)}
                      className="bg-transparent text-[12px] text-slate-300 outline-none [color-scheme:dark] font-black uppercase tracking-widest"
                    />
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-obsidian-950 border border-white/5 focus-within:border-crimson-500/40 transition-all shadow-inner">
                    <Clock className="w-4.5 h-4.5 text-crimson-500" />
                    <input 
                      type="time"
                      value={tempTime}
                      onChange={(e) => setTempTime(e.target.value)}
                      className="bg-transparent text-[12px] text-slate-300 outline-none [color-scheme:dark] font-black uppercase tracking-widest"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-4 px-6 py-5 rounded-2xl bg-obsidian-950 border border-white/5 focus-within:border-crimson-500/40 transition-all shadow-inner">
                  <AlignLeft className="w-5 h-5 text-crimson-500 mt-1" />
                  <textarea
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    placeholder="Define operational parameters..."
                    className="bg-transparent text-sm text-slate-300 outline-none w-full min-h-[120px] resize-none font-medium leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <p className={cn(
                    "text-2xl font-black truncate transition-all duration-500 tracking-tighter leading-none",
                    task.completed ? "text-slate-600 line-through" : "text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-red-100 group-hover:to-crimson-400"
                  )}>
                    {task.text}
                  </p>
                  {task.description && !isExpanded && (
                    <Activity className="w-4 h-4 text-crimson-500/60 shadow-[0_0_10px_rgba(220,38,38,0.4)]" />
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-5 mt-4">
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-600 font-black uppercase tracking-[0.4em]">
                    <Calendar className="w-4 h-4 mb-0.5 opacity-30" />
                    <span>{new Date(task.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>

                  {(task.dueDate || task.dueTime) && (
                    <div className={cn(
                      "flex items-center gap-2.5 px-4 py-1.5 rounded-xl border font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-700",
                      task.completed ? "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.2)]" : (isOverdue ? "bg-crimson-600/15 border-crimson-500/30 text-crimson-500 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.3)]" : "bg-white/5 border-white/10 text-slate-400")
                    )}>
                      <Zap className={cn("w-3.5 h-3.5 mr-0.5", isOverdue && !task.completed && "animate-bounce")} />
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}</span>
                      {task.dueDate && task.dueTime && <span className="mx-1.5 opacity-20">/</span>}
                      <span>{task.dueTime || ''}</span>
                    </div>
                  )}
                  
                  {task.description && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="ml-auto"
                    >
                      <ChevronDown className="w-6 h-6 text-slate-700 group-hover:text-crimson-500 shadow-[0_0_10px_rgba(220,38,38,0.3)] transition-all" />
                    </motion.div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action Matrix */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {isEditing ? (
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleSave}
                  className="p-4 rounded-2xl bg-crimson-600 text-white hover:bg-crimson-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-crimson-400/30 interactive-card"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-4 rounded-2xl bg-obsidian-900 text-slate-400 hover:text-white transition-all border border-white/5 interactive-card"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-4 rounded-2xl opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 bg-white/5 text-slate-500 hover:bg-crimson-600 hover:text-white transition-all duration-700 shadow-md border border-white/5 interactive-card"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-4 rounded-2xl opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 bg-crimson-600/10 text-crimson-500 hover:bg-crimson-600 hover:text-white transition-all duration-700 shadow-md border border-crimson-500/30 interactive-card"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Extended Description Unit */}
        {!isEditing && (
          <AnimatePresence>
            {isExpanded && task.description && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-8 pb-4 px-20 border-t border-white/[0.04] mt-5">
                  <div className="flex gap-5">
                    <AlignLeft className="w-5 h-5 text-crimson-700/60 mt-1 flex-shrink-0 shadow-[0_0_8px_rgba(220,38,38,0.3)]" />
                    <p className="text-lg text-slate-400 leading-relaxed font-semibold">
                      {task.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Extreme Molten FX (Neon Glow) */}
      {!isEditing && (
        <div className={cn(
          "absolute inset-0 -z-10 blur-[100px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000 shadow-[0_0_60px_rgba(220,38,38,0.3)]",
          task.completed ? "bg-rose-600/50" : (isOverdue ? "bg-crimson-600/50" : "bg-crimson-400/30")
        )} />
      )}
    </motion.div>
  );
};

export default TaskItem;
