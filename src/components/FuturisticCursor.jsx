import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_PARTICLES = 25;

const FuturisticCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef(null);
  const particlesRef = useRef([]);
  const requestRef = useRef();
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Initialize Particle Pool
  const createParticle = useCallback((x, y, vx, vy) => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      vx: vx * -0.5 + (Math.random() - 0.5) * 4,
      vy: vy * -0.5 + (Math.random() - 0.5) * 4 - 2, // Slight upward drift
      size: Math.random() * 10 + 5,
      life: 1.0,
      decay: 0.02 + Math.random() * 0.02,
      color: Math.random() > 0.6 ? '#FFFFFF' : (Math.random() > 0.3 ? '#F59E0B' : '#DC2626'),
    };
  }, []);

  const updateParticles = useCallback(() => {
    const vx = mousePos.current.x - lastMousePos.current.x;
    const vy = mousePos.current.y - lastMousePos.current.y;
    const dist = Math.hypot(vx, vy);

    // Spawn new particle if moving or hovering (flicker)
    if (dist > 1 || isHovering || Math.random() > 0.8) {
      if (particlesRef.current.length < MAX_PARTICLES) {
        particlesRef.current.push(createParticle(mousePos.current.x, mousePos.current.y, vx, vy));
      }
    }

    // Update existing particles
    particlesRef.current = particlesRef.current
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - p.decay,
        size: p.size * 0.96,
      }))
      .filter(p => p.life > 0);

    lastMousePos.current = { ...mousePos.current };
    
    // Draw particles to the DOM (manual update to avoid React re-render overhead)
    if (containerRef.current) {
        const divs = containerRef.current.children;
        // Keep DOM in sync with particlesRef
        // For simplicity in this React component, we will use a small state update 
        // but throttle it or use a more performant technique for 60fps.
        // Actually, for 25 particles, a state update on every RAF is usually fine in modern React.
    }
  }, [isHovering, createParticle]);

  // Using state for particles since 25 elements is well within React's performance range for RAF
  const [renderParticles, setRenderParticles] = useState([]);

  const animate = useCallback(() => {
    updateParticles();
    setRenderParticles([...particlesRef.current]);
    requestRef.current = requestAnimationFrame(animate);
  }, [updateParticles]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
      
      // Global Hover Detection
      const target = e.target;
      const isInteractive = target.closest('button, a, input, textarea, [role="button"], .interactive-card');
      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(requestRef.current);
    };
  }, [animate, isVisible]);

  if (!isVisible || typeof window === 'undefined') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      
      {/* 🔦 Virtual Pointer (Custom Cursor) */}
      <motion.div
        animate={{
          x: mousePos.current.x - 6,
          y: mousePos.current.y - 6,
          scale: isClicked ? 0.8 : (isHovering ? 1.5 : 1),
        }}
        transition={{ type: "spring", damping: 30, stiffness: 500, mass: 0.1 }}
        className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#fff,0_0_30px_#DC2626] border border-crimson-500/50 z-50"
      />

      {/* 🧨 Molten Particles (Flamethrower Trail) */}
      <div ref={containerRef}>
        {renderParticles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full blur-[2px] transition-opacity duration-200"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size * (1 + (isHovering ? 1 : 0.5)),
              backgroundColor: p.color,
              opacity: p.life,
              transform: `translate(-50%, -50%) scale(${p.life})`,
              boxShadow: `0 0 20px ${p.color}`,
              mixBlendMode: 'screen'
            }}
          />
        ))}
      </div>

      {/* 🌋 Hover/Click Intensity Glow */}
      <motion.div
        animate={{
          x: mousePos.current.x - (isHovering ? 100 : 50),
          y: mousePos.current.y - (isHovering ? 100 : 50),
          scale: isClicked ? 1.5 : (isHovering ? 2 : 1),
          opacity: isVisible ? (isHovering ? 0.4 : 0.2) : 0,
        }}
        className="absolute w-[100px] h-[100px] bg-crimson-600 rounded-full blur-[60px] -z-10 mix-blend-screen"
      />

      {/* Click Burst Effect */}
      <AnimatePresence>
        {isClicked && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute w-20 h-20 bg-orange-500 rounded-full blur-[40px] mix-blend-screen"
            style={{ left: mousePos.current.x - 40, top: mousePos.current.y - 40 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FuturisticCursor;
