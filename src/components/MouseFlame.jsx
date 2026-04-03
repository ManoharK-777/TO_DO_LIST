import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MouseFlame = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [embers, setEmbers] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const frameRef = useRef();

  // Optimized Particle Spawning Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      const vx = x - lastPos.current.x;
      const vy = y - lastPos.current.y;
      const dist = Math.hypot(vx, vy);

      setMousePos({ x, y });

      // If moving, spawn a high-density "Molten Torrent"
      if (dist > 2) {
        const batchSize = Math.min(Math.floor(dist / 2), 5); // Density scales with speed
        const newBatch = Array.from({ length: batchSize }).map(() => {
          const id = Math.random().toString(36).substr(2, 9);
          const spread = 2.5; // Width of the flamethrower wall
          
          return {
            id,
            x,
            y,
            // Massive Thrust Logic: Blowing back with high turbulence
            vx: -vx * 1.8 + (Math.random() - 0.5) * dist * spread,
            vy: -vy * 1.8 + (Math.random() - 0.5) * dist * spread,
            size: Math.random() * 15 + 10,
            duration: Math.random() * 0.4 + 0.5,
            // Multi-stage fire colors
            color: Math.random() > 0.7 ? '#FFFFFF' : (Math.random() > 0.4 ? '#F59E0B' : '#DC2626'),
          };
        });

        setEmbers((prev) => [...prev.slice(-60), ...newBatch]);
        lastPos.current = { x, y };

        // Precise Cleanup
        newBatch.forEach(ember => {
          setTimeout(() => {
            setEmbers((prev) => prev.filter((e) => e.id !== ember.id));
          }, 800);
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden select-none">
      
      {/* 🚀 High-Pressure Flamethrower Core */}
      <motion.div
        animate={{ x: mousePos.x - 70, y: mousePos.y - 70 }}
        transition={{ type: "spring", damping: 15, stiffness: 250, mass: 0.05 }}
        className="absolute w-[140px] h-[140px] bg-crimson-600 rounded-full blur-[60px] opacity-30 mix-blend-screen"
      />
      <motion.div
        animate={{ x: mousePos.x - 20, y: mousePos.y - 20 }}
        transition={{ type: "spring", damping: 10, stiffness: 350, mass: 0.05 }}
        className="absolute w-10 h-10 bg-white rounded-full blur-[15px] opacity-70 mix-blend-screen"
      />

      {/* 🌋 Massive "Running Back" Fire Matrix */}
      <AnimatePresence mode="popLayout" initial={false}>
        {embers.map((ember) => (
          <motion.div
            key={ember.id}
            initial={{ opacity: 1, scale: 0.5, x: ember.x, y: ember.y }}
            animate={{ 
              opacity: 0, 
              // Massive Expansion Logic: Smoke & Flame spreading out
              scale: 6, 
              x: ember.x + ember.vx, 
              y: ember.y + ember.vy - 50 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: ember.duration, ease: "easeOut" }}
            className="absolute rounded-full blur-[3px] mix-blend-screen"
            style={{ 
              width: ember.size, 
              height: ember.size,
              left: -ember.size / 2,
              top: -ember.size / 2,
              backgroundColor: ember.color,
              boxShadow: `0 0 30px ${ember.color}`
            }}
          />
        ))}
      </AnimatePresence>

      {/* Extreme Heat Glow Overlay */}
      <motion.div
        animate={{ x: mousePos.x - 250, y: mousePos.y - 250 }}
        transition={{ type: "tween", ease: "linear", duration: 0.05 }}
        className="absolute w-[500px] h-[500px] bg-crimson-600/10 rounded-full blur-[140px] -z-10"
      />
    </div>
  );
};

export default MouseFlame;
