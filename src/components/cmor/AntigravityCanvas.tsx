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
  homeX: number;
  homeY: number;
  seed: number;        // random seed for noise-based color
  scale: number;       // particle size scale (0-1)
  width: number;       // pill width
  height: number;      // pill height
  rotation: number;    // current rotation angle
  colorIdx: number;    // index into color palette
  alpha: number;       // opacity
  velocity: number;    // speed metric for brightness modulation
}

// Simple 2D simplex noise (lightweight implementation)
function createNoise2D() {
  const perm = new Uint8Array(512);
  const grad = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

  return function noise2D(x: number, y: number): number {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;

    let i1: number, j1: number;
    if (x0 > y0) { i1 = 1; j1 = 0; }
    else { i1 = 0; j1 = 1; }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;

    const ii = i & 255;
    const jj = j & 255;

    let n0 = 0, n1 = 0, n2 = 0;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      const g = grad[perm[ii + perm[jj]] & 7];
      t0 *= t0;
      n0 = t0 * t0 * (g[0] * x0 + g[1] * y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      const g = grad[perm[ii + i1 + perm[jj + j1]] & 7];
      t1 *= t1;
      n1 = t1 * t1 * (g[0] * x1 + g[1] * y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      const g = grad[perm[ii + 1 + perm[jj + 1]] & 7];
      t2 *= t2;
      n2 = t2 * t2 * (g[0] * x2 + g[1] * y2);
    }

    return 70 * (n0 + n1 + n2);
  };
}

// CMOR brand color palette — 3-color gradient groups for mixing
const DARK_PALETTES = [
  // [color1, color2, color3] — mixed via noise
  [{ r: 52, g: 211, b: 153 },  { r: 34, g: 211, b: 238 },  { r: 163, g: 230, b: 53 }],   // emerald → cyan → lime
  [{ r: 45, g: 212, b: 191 },  { r: 110, g: 231, b: 183 }, { r: 74, g: 222, b: 128 }],   // teal → emerald-lt → green
  [{ r: 94, g: 234, b: 212 },  { r: 103, g: 232, b: 249 }, { r: 52, g: 211, b: 153 }],   // teal-lt → cyan-lt → emerald
  [{ r: 34, g: 211, b: 238 },  { r: 74, g: 222, b: 128 },  { r: 45, g: 212, b: 191 }],   // cyan → green → teal
  [{ r: 110, g: 231, b: 183 }, { r: 163, g: 230, b: 53 },  { r: 94, g: 234, b: 212 }],   // emerald-lt → lime → teal-lt
];

const LIGHT_PALETTES = [
  [{ r: 5, g: 150, b: 105 },   { r: 8, g: 145, b: 178 },   { r: 63, g: 145, b: 77 }],
  [{ r: 13, g: 148, b: 136 },  { r: 4, g: 120, b: 87 },    { r: 22, g: 163, b: 74 }],
  [{ r: 15, g: 118, b: 110 },  { r: 14, g: 116, b: 144 },  { r: 5, g: 150, b: 105 }],
  [{ r: 8, g: 145, b: 178 },   { r: 22, g: 163, b: 74 },   { r: 13, g: 148, b: 136 }],
  [{ r: 4, g: 120, b: 87 },    { r: 63, g: 145, b: 77 },   { r: 15, g: 118, b: 110 }],
];

export default function AntigravityCanvas({ isDark }: AntigravityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<SwarmParticle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const noiseRef = useRef<((x: number, y: number) => number) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Initialize noise
    noiseRef.current = createNoise2D();
    const noise = noiseRef.current;

    // Physics constants — tuned to match antigravity.google swarm feel
    const MOUSE_ATTRACT_RADIUS = 350;    // Large radius — particles far away still attracted
    const MOUSE_ATTRACT_FORCE = 0.035;   // Gentle constant attraction toward mouse
    const MOUSE_ORBIT_RADIUS = 60;       // Particles orbit at this distance from mouse
    const MOUSE_ORBIT_TANGENT = 0.02;    // Tangential force for swirling orbit
    const REPEL_RADIUS = 25;             // Repel when closer than this
    const REPEL_FORCE = 0.15;            // Repulsion strength
    const RETURN_FORCE = 0.0008;         // Very gentle home pull (swarm mostly follows mouse)
    const DAMPING = 0.965;               // Velocity damping
    const MAX_SPEED = 3.2;
    const NOISE_FORCE = 0.012;           // Noise-based organic wandering strength

    let w = 0;
    let h = 0;

    const getParticleCount = () => {
      const area = window.innerWidth * window.innerHeight;
      const isMobile = window.innerWidth < 768;
      return isMobile
        ? Math.min(Math.floor(area / 4500), 90)
        : Math.min(Math.floor(area / 4500), 250);
    };

    const initParticles = () => {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
      const count = getParticleCount();
      particlesRef.current = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const scale = Math.random() * 0.6 + 0.4; // 0.4 to 1.0
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          homeX: x,
          homeY: y,
          seed: Math.random() * 1000,
          scale,
          width: (Math.random() * 4 + 2) * scale,  // pill width: 2-6 * scale
          height: (Math.random() * 1.5 + 1) * scale, // pill height: 1-2.5 * scale
          rotation: Math.random() * Math.PI * 2,
          colorIdx: Math.floor(Math.random() * 5),
          alpha: Math.random() * 0.3 + 0.5,
          velocity: 0,
        });
      }
    };

    // Draw a rounded pill shape (like antigravity's sdRoundBox)
    const drawPill = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      pw: number,
      ph: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;

      const r = ph / 2; // border radius = half height
      const hw = pw / 2;
      const hh = ph / 2;

      // Draw rounded rectangle path
      ctx.beginPath();
      ctx.moveTo(-hw + r, -hh);
      ctx.lineTo(hw - r, -hh);
      ctx.arc(hw - r, 0, r, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(-hw + r, hh);
      ctx.arc(-hw + r, 0, r, Math.PI / 2, -Math.PI / 2);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.restore();
    };

    // Mix 3 colors based on noise progress (like the shader)
    const mixColor = (
      palette: typeof DARK_PALETTES[0],
      progress: number
    ): string => {
      const h = 0.8;
      const c1 = palette[0];
      const c2 = palette[1];
      const c3 = palette[2];

      let r: number, g: number, b: number;
      if (progress < h) {
        const t = progress / h;
        r = c1.r + (c2.r - c1.r) * t;
        g = c1.g + (c2.g - c1.g) * t;
        b = c1.b + (c2.b - c1.b) * t;
      } else {
        const t = (progress - h) / (1 - h);
        r = c2.r + (c3.r - c2.r) * t;
        g = c2.g + (c3.g - c2.g) * t;
        b = c2.b + (c3.b - c2.b) * t;
      }

      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      const dt = 0.016;
      timeRef.current += dt;
      const t = timeRef.current;

      // Clear
      ctx.fillStyle = isDark ? "#0a0a0b" : "#fafafa";
      ctx.fillRect(0, 0, w, h);

      const pts = particlesRef.current;
      const mouse = mouseRef.current;
      const palettes = isDark ? DARK_PALETTES : LIGHT_PALETTES;

      // Update particles
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // 1. NOISE-BASED ORGANIC WANDERING (like the shader's simplex noise)
        const noiseX = noise(p.seed + p.x * 0.003, t * 0.4) * NOISE_FORCE;
        const noiseY = noise(p.seed + 500 + p.y * 0.003, t * 0.4) * NOISE_FORCE;
        p.vx += noiseX;
        p.vy += noiseY;

        // 2. MOUSE SWARM BEHAVIOR — the key to antigravity's feel
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 0 && dist < MOUSE_ATTRACT_RADIUS) {
            const dirX = dx / dist;
            const dirY = dy / dist;

            if (dist < REPEL_RADIUS) {
              // Too close — repel outward
              const repelStr = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
              p.vx -= dirX * repelStr;
              p.vy -= dirY * repelStr;
            } else if (dist < MOUSE_ORBIT_RADIUS) {
              // In orbit zone — attract gently + tangential swirl
              const attractStr = MOUSE_ATTRACT_FORCE * 1.5;
              p.vx += dirX * attractStr;
              p.vy += dirY * attractStr;
              // Tangential (perpendicular) force for swirling
              p.vx += -dirY * MOUSE_ORBIT_TANGENT * 2;
              p.vy += dirX * MOUSE_ORBIT_TANGENT * 2;
            } else {
              // Far away — attract toward mouse (swarm follows!)
              const ratio = 1 - dist / MOUSE_ATTRACT_RADIUS;
              const attractStr = ratio * ratio * MOUSE_ATTRACT_FORCE;
              p.vx += dirX * attractStr;
              p.vy += dirY * attractStr;
              // Slight tangential for that organic swirl feel
              p.vx += -dirY * MOUSE_ORBIT_TANGENT * ratio;
              p.vy += dirX * MOUSE_ORBIT_TANGENT * ratio;
            }
          }
        }

        // 3. Very gentle home return (so they don't all pile up on mouse forever)
        const dxH = p.homeX - p.x;
        const dyH = p.homeY - p.y;
        const distH = Math.sqrt(dxH * dxH + dyH * dyH);
        if (distH > 50) {
          p.vx += (dxH / distH) * RETURN_FORCE * Math.min(distH, 200);
          p.vy += (dyH / distH) * RETURN_FORCE * Math.min(distH, 200);
        }

        // 4. Soft boundaries
        const margin = 40;
        if (p.x < margin) p.vx += 0.05;
        if (p.x > w - margin) p.vx -= 0.05;
        if (p.y < margin) p.vy += 0.05;
        if (p.y > h - margin) p.vy -= 0.05;

        // 5. Damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // 6. Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }
        p.velocity = speed;

        // 7. Update position
        p.x += p.vx;
        p.y += p.vy;

        // Hard clamp
        p.x = Math.max(-50, Math.min(w + 50, p.x));
        p.y = Math.max(-50, Math.min(h + 50, p.y));

        // 8. Rotation — point toward mouse (like antigravity shader's angle calc)
        if (mouse.active) {
          const angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);
          // Smoothly interpolate rotation toward mouse angle
          let diff = angle - p.rotation;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          p.rotation += diff * 0.08; // smooth rotation
        } else {
          // Slowly rotate based on velocity direction
          if (speed > 0.1) {
            const angle = Math.atan2(p.vy, p.vx);
            let diff = angle - p.rotation;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            p.rotation += diff * 0.03;
          }
        }
      }

      // Draw particles — pill shapes with noise-based gradient colors
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Skip very small/invisible particles
        if (p.scale < 0.15) continue;

        // Calculate color using noise (like the shader's noiseColor)
        const noiseVal = noise(p.seed + p.x * 0.002, t * 0.3);
        const noiseProgress = (noiseVal + 1) * 0.5; // normalize to 0-1
        const progress = Math.pow(noiseProgress, 2); // smoothstep-like curve
        const palette = palettes[p.colorIdx];
        const color = mixColor(palette, progress);

        // Alpha modulation: brighter when moving faster (velocity modulates color)
        const velocityAlpha = Math.min(p.alpha + p.velocity * 0.1, 0.95);
        // Scale modulation: particles closer to mouse appear slightly bigger
        let sizeMultiplier = 1;
        if (mouse.active) {
          const dm = Math.sqrt(
            (mouse.x - p.x) ** 2 + (mouse.y - p.y) ** 2
          );
          if (dm < MOUSE_ATTRACT_RADIUS) {
            sizeMultiplier = 1 + (1 - dm / MOUSE_ATTRACT_RADIUS) * 0.3;
          }
        }

        const pw = p.width * sizeMultiplier;
        const ph = p.height * sizeMultiplier;

        drawPill(ctx, p.x, p.y, pw, ph, p.rotation, color, velocityAlpha);
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
