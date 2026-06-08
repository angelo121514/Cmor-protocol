"use client";

import { useEffect, useRef } from "react";

interface SynapseCanvasProps {
  isDark: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  homeX: number;
  homeY: number;
}

export default function SynapseCanvas({ isDark }: SynapseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const CONNECTION_DIST = 140;
    const MOUSE_RADIUS = 200;
    const MOUSE_FORCE = 0.5;       // Gentler repulsion (was 2.2)
    const RETURN_FORCE = 0.008;     // Gentle pull back toward home position
    const BASE_SPEED = 0.35;
    const CELL_SIZE = CONNECTION_DIST;
    const DAMPING = 0.975;          // Slower deceleration (was 0.955)
    const ACCEL = 1.06;             // Faster return to base speed (was 1.025)
    const MAX_SPEED = 3.5;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let grid: Map<string, number[]> = new Map();

    const getParticleCount = () => {
      const area = window.innerWidth * window.innerHeight;
      const isMobile = window.innerWidth < 768;
      return isMobile
        ? Math.min(Math.floor(area / 2800), 220)
        : Math.min(Math.floor(area / 2200), 500);
    };

    const cellKey = (cx: number, cy: number) => `${cx},${cy}`;

    const buildGrid = (pts: Particle[]) => {
      grid.clear();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const cx = Math.floor(p.x / CELL_SIZE);
        const cy = Math.floor(p.y / CELL_SIZE);
        const key = cellKey(cx, cy);
        let cell = grid.get(key);
        if (!cell) {
          cell = [];
          grid.set(key, cell);
        }
        cell.push(i);
      }
    };

    const getNeighbors = (p: Particle): number[] => {
      const cx = Math.floor(p.x / CELL_SIZE);
      const cy = Math.floor(p.y / CELL_SIZE);
      const neighbors: number[] = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const cell = grid.get(cellKey(cx + dx, cy + dy));
          if (cell) {
            for (const idx of cell) {
              neighbors.push(idx);
            }
          }
        }
      }
      return neighbors;
    };

    const initParticles = () => {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
      cols = Math.ceil(w / CELL_SIZE);
      rows = Math.ceil(h / CELL_SIZE);
      const count = getParticleCount();
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const x = Math.random() * w;
        const y = Math.random() * h;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * BASE_SPEED,
          vy: Math.sin(angle) * BASE_SPEED,
          radius: Math.random() * 1.5 + 0.8,
          homeX: x,
          homeY: y,
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Background
      ctx.fillStyle = isDark ? "#0a0a0b" : "#fafafa";
      ctx.fillRect(0, 0, w, h);

      const pts = particlesRef.current;
      const mouse = mouseRef.current;

      // Build spatial grid
      buildGrid(pts);

      // Update particles
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Mouse repulsion — gentler, quadratic falloff
        const dxM = p.x - mouse.x;
        const dyM = p.y - mouse.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (distM < MOUSE_RADIUS && distM > 0) {
          const ratio = distM / MOUSE_RADIUS;
          // Smooth quadratic: force peaks near mouse and fades to 0 at edge
          const force = (1 - ratio) * (1 - ratio) * MOUSE_FORCE;
          p.vx += (dxM / distM) * force;
          p.vy += (dyM / distM) * force;
        }

        // Gentle return toward home position (prevents bunching)
        const dxH = p.homeX - p.x;
        const dyH = p.homeY - p.y;
        const distH = Math.sqrt(dxH * dxH + dyH * dyH);
        if (distH > 30) {
          p.vx += (dxH / distH) * RETURN_FORCE * Math.min(distH, 200);
          p.vy += (dyH / distH) * RETURN_FORCE * Math.min(distH, 200);
        }

        // Soft boundary bounce (smoother than hard bounce)
        const margin = 20;
        if (p.x < margin) p.vx += 0.1;
        if (p.x > w - margin) p.vx -= 0.1;
        if (p.y < margin) p.vy += 0.1;
        if (p.y > h - margin) p.vy -= 0.1;

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

        // Clamp position
        p.x = Math.max(0, Math.min(w, p.x + p.vx));
        p.y = Math.max(0, Math.min(h, p.y + p.vy));
      }

      // Draw connections (using spatial grid for O(n) instead of O(n²))
      const connectionDistSq = CONNECTION_DIST * CONNECTION_DIST;
      const drawnPairs = new Set<string>();

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const neighbors = getNeighbors(p);
        for (const j of neighbors) {
          if (j <= i) continue;
          const pairKey = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (drawnPairs.has(pairKey)) continue;
          drawnPairs.add(pairKey);

          const p2 = pts[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistSq) {
            const dist = Math.sqrt(distSq);
            const ratio = 1 - dist / CONNECTION_DIST;
            const opacity = ratio * ratio * (isDark ? 0.22 : 0.45);

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(52, 211, 153, ${opacity})`
              : `rgba(17, 24, 39, ${opacity})`;
            ctx.lineWidth = ratio * 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(52, 211, 153, 0.8)`
          : `rgba(17, 24, 39, 0.6)`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    const handleResize = () => {
      initParticles();
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
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
