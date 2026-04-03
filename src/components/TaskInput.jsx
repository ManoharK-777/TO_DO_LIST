import React, { useState } from 'react';
import { Plus, Sparkles, Calendar as CalendarIcon, Clock as ClockIcon, AlignLeft, Flame, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskInput = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), date, time, description.trim());
      setText('');
      setDate('');
      setTime('');
      setDescription('');
      setShowOptions(false);
    }
  };

  return (
    <div className="relative group w-full mb-8">
      <form onSubmit={handleSubmit} className="relative z-20">
        <motion.div
          animate={{
            boxShadow: isFocused || showOptions
              ? "0 0 60px -15px rgba(220, 38, 38, 0.6)" 
              : "0 0 0px 0px rgba(0, 0, 0, 0)"
          }}
          className={`
            flex flex-col gap-0 p-2 rounded-[2.5rem] 
            bg-white/[0.02] backdrop-blur-3xl border 
            ${isFocused || showOptions ? 'border-crimson-500/60 shadow-[0_0_25px_rgba(220,38,38,0.3)]' : 'border-white/5'} 
            transition-all duration-700 shadow-premium overflow-hidden
          `}
        >
          {/* Main Orchestration Row */}
          <div className="flex items-center gap-4 p-1.5">
            <div className="flex-grow relative px-6 py-2">
              <label 
                className={`
                  absolute left-6 pointer-events-none transition-all duration-500 font-black tracking-tight
                  ${isFocused || text ? '-top-1.5 text-[11px] text-crimson-400 opacity-100 shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 'top-3 text-lg text-slate-500 opacity-50'}
                `}
              >
                Assemble a new primitive...
              </label>
              <input
                type="text"
                value={text}
                onFocus={() => {
                  setIsFocused(true);
                  setShowOptions(true);
                }}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-11 bg-transparent outline-none text-white text-xl font-black pt-3 leading-tight"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(220, 38, 38, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!text.trim()}
              className={`
                h-14 px-8 rounded-[1.5rem] flex items-center gap-3 font-black text-base transition-all duration-700 shadow-lg interactive-card
                ${text.trim() 
                  ? 'bg-gradient-to-r from-crimson-600 via-rose-600 to-crimson-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                  : 'bg-obsidian-900 border border-white/5 text-slate-600 cursor-not-allowed'}
              `}
            >
              <Plus className={`w-5 h-5 transition-transform duration-700 ${text.trim() ? 'rotate-90 scale-110' : ''}`} />
              <span className="hidden sm:inline">Initialize</span>
            </motion.button>
          </div>

          {/* Extended Metadata Matrix */}
          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="border-t border-white/[0.04] bg-white/[0.01]"
              >
                <div className="px-7 py-6 space-y-5">
                  {/* Temporal Anchors */}
                  <div className="flex flex-wrap items-center gap-5">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-obsidian-950 border border-white/5 focus-within:border-crimson-500/40 transition-colors shadow-inner">
                      <CalendarIcon className="w-4 h-4 text-crimson-500" />
                      <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-transparent text-[11px] text-slate-300 outline-none [color-scheme:dark] font-black uppercase tracking-[0.2em]"
                      />
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-obsidian-950 border border-white/5 focus-within:border-crimson-500/40 transition-colors shadow-inner">
                      <ClockIcon className="w-4 h-4 text-crimson-500" />
                      <input 
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-transparent text-[11px] text-slate-300 outline-none [color-scheme:dark] font-black uppercase tracking-[0.2em]"
                      />
                    </div>
                  </div>

                  {/* Logic Description */}
                  <div className="relative">
                    <div className="flex items-start gap-3 px-4 py-4 rounded-2xl bg-obsidian-950 border border-white/5 focus-within:border-crimson-500/40 transition-colors shadow-inner">
                      <AlignLeft className="w-4.5 h-4.5 text-crimson-500 mt-1" />
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Define operational parameters (optional)..."
                        className="bg-transparent text-sm text-slate-400 outline-none w-full min-h-[90px] resize-none font-medium leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-black text-slate-700 uppercase tracking-[0.4em]">
                    <div className="flex items-center gap-2">
                       <Zap className="w-3.5 h-3.5 text-crimson-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                       <span className="text-crimson-800">High-Tech Protcol Active</span>
                    </div>
                    <span className="opacity-40">System Matrix</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </form>
    </div>
  );
};

export default TaskInput;
