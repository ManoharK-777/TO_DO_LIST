import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LayoutGrid, CheckCircle, Clock, Calendar, ArrowDownAz, SortAsc, LayoutList, Target, TrendingUp, Zap, Shield, Rocket, Brain, Flame, Activity } from 'lucide-react';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import TaskFilters from './components/TaskFilters';
import FuturisticCursor from './components/FuturisticCursor';

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('smart-todo-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  const dashboardRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('smart-todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text, dueDate = null, dueTime = null, description = '') => {
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
      dueTime,
      description
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];
    if (filter === 'completed') result = result.filter(t => t.completed);
    if (filter === 'pending') result = result.filter(t => !t.completed);
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'alpha') {
      result.sort((a, b) => a.text.localeCompare(b.text));
    }
    return result;
  }, [tasks, filter, sortBy]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    progress: tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 rounded-3xl flex-1 flex flex-col gap-3 shadow-premium hover:shadow-floating transition-all duration-500 group border border-white/[0.04] neon-border-hover interactive-card"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-opacity-15 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase mb-0.5">{title}</p>
        <p className="text-3xl font-black text-white tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-crimson-400 transition-all">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-obsidian-950 selection:bg-crimson-500/30 font-sans relative overflow-x-hidden">
      
      {/* Advanced Futuristic Cursor Engine */}
      <FuturisticCursor />

      {/* Molten Background System */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="blur-blob w-[600px] h-[600px] bg-red-600/20 -top-[10%] -left-[5%] animate-molten" />
        <div className="blur-blob w-[500px] h-[500px] bg-rose-600/10 bottom-[-10%] right-[-5%] animate-molten" style={{ animationDelay: '2s' }} />
        <div className="blur-blob w-[400px] h-[400px] bg-crimson-500/10 top-[40%] right-[10%] animate-molten" style={{ animationDelay: '4s' }} />
        
        {/* Neon Grid Accents */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(220,38,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Molten Progress Line (Neon) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-obsidian-900 z-[1000] overflow-hidden border-b border-white/[0.02]">
        <motion.div 
          className="h-full bg-gradient-to-r from-crimson-600 via-rose-500 to-crimson-400 shadow-[0_0_20px_rgba(220,38,38,0.8)]"
          animate={{ width: `${stats.progress}%` }}
          transition={{ type: "spring", damping: 20, stiffness: 60 }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-20 relative z-10">
        
        {/* Obsidian Hero Section */}
        <header className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-crimson-500/10 text-crimson-400 text-[10px] font-black tracking-[0.4em] border border-crimson-500/30 mb-8 uppercase backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.2)]"
          >
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>Futuristic Crimson Protocol</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-display font-black hero-gradient mb-5 tracking-tighter leading-none"
          >
            Smart Todo AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg sm:text-xl font-medium max-w-xl mx-auto leading-relaxed mb-10"
          >
            Liquid-fire orchestration for elite professional workflows.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-5"
          >
            <button 
              onClick={() => scrollToSection(dashboardRef)}
              className="px-7 py-4 bg-white text-obsidian-950 text-sm font-black rounded-2xl shadow-floating hover:scale-105 active:scale-95 transition-all outline-none neon-border-hover"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => scrollToSection(infoRef)}
              className="px-7 py-4 bg-crimson-600/10 backdrop-blur-md border border-crimson-500/20 text-white text-sm font-black rounded-2xl hover:bg-crimson-600 transition-all outline-none shadow-lg"
            >
              Learn More
            </button>
          </motion.div>
        </header>

        {/* Dash/Stats Matrix */}
        <div className="flex flex-col sm:flex-row gap-5 mb-14">
          <StatCard title="Active Units" value={stats.total} icon={LayoutGrid} color="bg-crimson-500" delay={0.2} />
          <StatCard title="Success State" value={stats.completed} icon={Activity} color="bg-rose-500" delay={0.3} />
          <StatCard title="Pending Logic" value={stats.pending} icon={Zap} color="bg-amber-500" delay={0.4} />
        </div>

        {/* Action Matrix */}
        <div ref={dashboardRef} className="space-y-8 scroll-mt-20">
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TaskInput onAdd={addTask} />
          </motion.section>

          {/* Logic Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-5 py-4 border-b border-white/[0.04]"
          >
            <TaskFilters current={filter} onChange={setFilter} stats={stats} />
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-1.5 bg-obsidian-900 shadow-inner rounded-xl border border-white/5">
                <button
                  onClick={() => setSortBy('date')}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${sortBy === 'date' ? 'bg-crimson-600/20 text-crimson-400 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Clock className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSortBy('alpha')}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${sortBy === 'alpha' ? 'bg-crimson-600/20 text-crimson-400 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <SortAsc className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="relative">
             <AnimatePresence mode="popLayout" initial={false}>
              {filteredAndSortedTasks.length > 0 ? (
                <motion.div 
                  layout
                  className="grid gap-4"
                >
                  {filteredAndSortedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onUpdate={updateTask}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-20 px-8 glass-card rounded-[2.5rem] border border-white/5 shadow-premium"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-crimson-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center mb-6 animate-molten shadow-[0_0_30px_rgba(220,38,38,0.3)] indicator-pending">
                    <Target className="w-8 h-8 text-crimson-400 font-black" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">No Active Primitives</h3>
                  <p className="text-slate-500 text-base font-medium max-w-xs mx-auto leading-relaxed">
                    Zero operational tasks detected. Initialize a new orchestrator to begin deployment.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Feature Matrix */}
        <section ref={infoRef} className="mt-40 pt-24 border-t border-white/[0.04] scroll-mt-24">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">Obsidian Protocol</h2>
            <p className="text-slate-500 text-xl font-medium max-w-xl mx-auto leading-relaxed">
              Unlock maximum output via our crimson-grade high-tech logic.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "Neural Sync", desc: "Real-time task synchronization across local neural nodes." },
              { icon: Shield, title: "Fortified", desc: "Obsidian-grade persistence ensures your data never de-materializes." },
              { icon: Rocket, title: "Supersonic", desc: "Ultra-low latency rendering powered by modern React 19 architecture." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="glass-card p-10 rounded-[3rem] border border-white/[0.04] relative overflow-hidden group shadow-lg neon-border-hover interactive-card"
              >
                <div className="w-14 h-14 bg-crimson-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-md">
                  <feature.icon className="w-7 h-7 text-crimson-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tighter">{feature.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed">{feature.desc}</p>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-crimson-600/5 blur-[60px] rounded-full group-hover:bg-crimson-600/10 transition-colors" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Obsidian Footer */}
        <footer className="mt-48 pt-10 border-t border-white/[0.04] text-center">
          <p className="text-slate-600 text-[11px] font-black tracking-[0.5em] uppercase">
             Orchestrated By <span className="text-crimson-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]">Manohar K</span> | AI Systems
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
