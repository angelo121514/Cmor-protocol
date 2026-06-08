"use client";

import { useEffect, useRef } from "react";

interface AntigravityCanvasProps {
  isDark: boolean;
}

interface SwarmParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  homeX: number;
  homeY: number;
  phase: number;       // oscillation phase for organic movement
  speed: number;       // individual speed multiplier
  orbitRadius: number; // how far from home it wanders
}

// Color palette — CMOR brand (emerald / teal / cyan / mint / lime-green)
const DARK_COLORS = [
  { r: 52, g: 211, b: 153 },   // emerald-400
  { r: 45, g: 212, b: 191 },   // teal-400
  { r: 34, g: 211, b: 238 },   // cyan-400
  { r: 110, g: 231, b: 183 },  // emerald-300
  { r: 94, g: 234, b: 212 },   // teal-300
  { r: 103, g: 232, b: 249 },  // cyan-300
  { r: 163, g: 230, b: 53 },   // lime-400
  { r: 74, g: 222, b: 128 },   // green-400
];

const LIGHT_COLORS = [
  { r: 5, g: 150, b: 105 },    // emerald-600
  { r: 13, g: 148, b: 136 },   // teal-600
  { r: 8, g: 145, b: 178 },    // cyan-600
  { r: 4, g: 120, b: 87 },     // emerald-700
  { r: 15, g: 118, b: 110 },   // teal-700
  { r: 14, g: 116, b: 144 },   // cyan-700
  { r: 63, g: 145, b: 77 },    // lime-600
  { r: 22, g: 163, b: 74 },    // green-600
];

export default function AntigravityCanvas({ isDark }: AntigravityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<SwarmParticle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const MOUSE_RADIUS = 220;
    const MOUSE_ATTRACT_FORCE = 0.6;   // Attract toward mouse (swarm behavior)
    const MOUSE_REPEL_FORCE = 0.3;     // Repel when too close
    const REPEL_THRESHOLD = 50;        // Distance below which particles repel
    const RETURN_FORCE = 0.003;        // Gentle pull back to home
    const BASE_SPEED = 0.25;
    const DAMPING = 0.97;
    const ACCEL = 1.04;
    const MAX_SPEED = 2.8;
    const GLOW_SIZE = 3;              // Extra glow radius for bloom effect

    let w = 0;
    let h = 0;

    const getParticleCount = () => {
      const area = window.innerWidth * window.innerHeight;
      const isMobile = window.innerWidth < 768;
      return isMobile
        ? Math.min(Math.floor(area / 4500), 90)
        : Math.min(Math.floor(area / 4500), 250);
    };

    const pickColor = (colors: typeof DARK_COLORS): string => {
      const c = colors[Math.floor(Math.random() * colors.length)];
      return `${c.r}, ${c.g}, ${c.b}`;
    };

    const initParticles = () => {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
      const count = getParticleCount();
      const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
      particlesRef.current = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const color = pickColor(colors);
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * BASE_SPEED * 2,
          vy: (Math.random() - 0.5) * BASE_SPEED * 2,
          radius: Math.random() * 2.5 + 1,
          color,
          alpha: Math.random() * 0.4 + 0.5,
          homeX: x,
          homeY: y,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.75,
          orbitRadius: Math.random() * 60 + 30,
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      timeRef.current += 0.016; // ~60fps time increment

      // Background with subtle fade (creates trails)
      ctx.fillStyle = isDark ? "#0a0a0b" : "#fafafa";
      ctx.fillRect(0, 0, w, h);

      const pts = particlesRef.current;
      const mouse = mouseRef.current;
      const t = timeRef.current;

      // Update particles
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Organic wandering — sinusoidal orbit around home
        const wanderX = Math.cos(t * p.speed + p.phase) * p.orbitRadius * 0.02;
        const wanderY = Math.sin(t * p.speed * 0.7 + p.phase) * p.orbitRadius * 0.02;
        p.vx += wanderX;
        p.vy += wanderY;

        // Mouse interaction — swarm: attract, then repel when too close
        if (mouse.active) {
          const dxM = mouse.x - p.x;
          const dyM = mouse.y - p.y;
          const distM = Math.sqrt(dxM * dxM + dyM * dyM);

          if (distM < MOUSE_RADIUS && distM > 0) {
            const ratio = distM / MOUSE_RADIUS;

            if (distM < REPEL_THRESHOLD) {
              // Repel when very close (prevents clumping on cursor)
              const force = (1 - distM / REPEL_THRESHOLD) * MOUSE_REPEL_FORCE;
              p.vx -= (dxM / distM) * force;
              p.vy -= (dyM / distM) * force;
            } else {
              // Attract toward mouse (swarm behavior)
              const attractForce = (1 - ratio) * (1 - ratio) * MOUSE_ATTRACT_FORCE;
              p.vx += (dxM / distM) * attractForce;
              p.vy += (dyM / distM) * attractForce;
            }
          }
        }

        // Gentle return toward home position
        const dxH = p.homeX - p.x;
        const dyH = p.homeY - p.y;
        const distH = Math.sqrt(dxH * dxH + dyH * dyH);
        if (distH > 40) {
          p.vx += (dxH / distH) * RETURN_FORCE * Math.min(distH, 150);
          p.vy += (dyH / distH) * RETURN_FORCE * Math.min(distH, 150);
        }

        // Soft boundary
        const margin = 30;
        if (p.x < margin) p.vx += 0.08;
        if (p.x > w - margin) p.vx -= 0.08;
        if (p.y < margin) p.vy += 0.08;
        if (p.y > h - margin) p.vy -= 0.08;

        // Speed regulation
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }
        if (speed > BASE_SPEED) {
          p.vx *= DAMPING;
          p.vy *= DAMPING;
        } else if (speed > 0.01) {
          p.vx *= ACCEL;
          p.vy *= ACCEL;
        }

        // Update position
        p.x = Math.max(0, Math.min(w, p.x + p.vx));
        p.y = Math.max(0, Math.min(h, p.y + p.vy));
      }

      // Draw particles with glow (bloom effect)
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Outer glow
        const glowRadius = p.radius + GLOW_SIZE;
        const gradient = ctx.createRadialGradient(
          p.x, p.y, p.radius * 0.3,
          p.x, p.y, glowRadius
        );
        gradient.addColorStop(0, `rgba(${p.color}, ${p.alpha * 0.9})`);
        gradient.addColorStop(0.4, `rgba(${p.color}, ${p.alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.min(p.alpha + 0.3, 1)})`;
        ctx.fill();
      }

      // Draw subtle connections between nearby particles (fainter than Synapse)
      const CONNECTION_DIST = 100;
      const connectionDistSq = CONNECTION_DIST * CONNECTION_DIST;
      // Simple O(n²) for connections — acceptable with <=250 particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < connectionDistSq) {
            const dist = Math.sqrt(distSq);
            const ratio = 1 - dist / CONNECTION_DIST;
            const opacity = ratio * ratio * (isDark ? 0.08 : 0.12);
            // Use color of the first particle for the line
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${pts[i].color}, ${opacity})`;
            ctx.lineWidth = ratio * 0.8;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };
    // Touch support for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          active: true,
        };
      }
    };
    const handleTouchEnd = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };
    const handleResize = () => {
      initParticles();
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
