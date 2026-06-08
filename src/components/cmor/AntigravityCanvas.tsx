"use client";

import { useEffect, useRef } from "react";

interface AntigravityCanvasProps {
  isDark: boolean;
}

// Simplex 2D noise — same algorithm used in the antigravity shader
function createNoise2D() {
  const perm = new Uint8Array(512);
  const grad: [number, number][] = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];
  return (x: number, y: number): number => {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    const s = (x + y) * F2;
    const i = Math.floor(x + s), j = Math.floor(y + s);
    const t = (i + j) * G2;
    const x0 = x - (i - t), y0 = y - (j - t);
    const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    let n0 = 0, n1 = 0, n2 = 0;
    let t0 = 0.5 - x0*x0 - y0*y0;
    if (t0 >= 0) { const g = grad[perm[ii + perm[jj]] & 7]; t0 *= t0; n0 = t0*t0*(g[0]*x0+g[1]*y0); }
    let t1 = 0.5 - x1*x1 - y1*y1;
    if (t1 >= 0) { const g = grad[perm[ii+i1 + perm[jj+j1]] & 7]; t1 *= t1; n1 = t1*t1*(g[0]*x1+g[1]*y1); }
    let t2 = 0.5 - x2*x2 - y2*y2;
    if (t2 >= 0) { const g = grad[perm[ii+1 + perm[jj+1]] & 7]; t2 *= t2; n2 = t2*t2*(g[0]*x2+g[1]*y2); }
    return 70 * (n0 + n1 + n2);
  };
}

// Parse hex color to {r,g,b}
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return { r, g, b };
}

// Antigravity.google exact dark mode colors
const ANTI_DARK = {
  color1: hexToRgb("#318bf7"),  // Blue
  color2: hexToRgb("#bada4c"),  // Yellow-green
  color3: hexToRgb("#e35058"),  // Red-coral
};

// Light mode colors (from morphing variant)
const ANTI_LIGHT = {
  color1: hexToRgb("#2c64ed"),  // Blue
  color2: hexToRgb("#f84242"),  // Red
  color3: hexToRgb("#ffcf03"),  // Yellow
};

// CMOR brand version (same structure, CMOR palette)
const CMOR_DARK = {
  color1: hexToRgb("#34d399"),  // emerald-400
  color2: hexToRgb("#22d3ee"),  // cyan-400
  color3: hexToRgb("#a3e635"),  // lime-400
};

const CMOR_LIGHT = {
  color1: hexToRgb("#059669"),  // emerald-600
  color2: hexToRgb("#0891b2"),  // cyan-600
  color3: hexToRgb("#65a30d"),  // lime-600
};

interface Particle {
  x: number;      // current position (normalized 0-1 space, like shader)
  y: number;
  refX: number;   // reference/home position
  refY: number;
  nearestX: number; // nearest target position (where mouse attracts to)
  nearestY: number;
  scale: number;   // particle scale (0-1)
  velocity: number;// velocity metric for color
  seed: number;
  seed2: number;
  lifeEnd: number;
}

export default function AntigravityCanvas({ isDark }: AntigravityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false }); // normalized coords
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const noiseRef = useRef<((x: number, y: number) => number) | null>(null);
  const hoverProgressRef = useRef(0); // smooth hover transition (like uIsHovering)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    noiseRef.current = createNoise2D();
    const noise = noiseRef.current;

    let w = 0, h = 0;
    let dpr = 1;

    const getParticleCount = () => {
      const area = window.innerWidth * window.innerHeight;
      const isMobile = window.innerWidth < 768;
      return isMobile
        ? Math.min(Math.floor(area / 4500), 90)
        : Math.min(Math.floor(area / 4500), 250);
    };

    const initParticles = () => {
      w = canvas!.width = window.innerWidth * dpr;
      h = canvas!.height = window.innerHeight * dpr;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.style.width = window.innerWidth + 'px';
      canvas!.style.height = window.innerHeight + 'px';

      const count = getParticleCount();
      particlesRef.current = [];

      for (let i = 0; i < count; i++) {
        // Random home position in normalized space (0-1)
        const rx = Math.random();
        const ry = Math.random();
        const seed = Math.random();
        const seed2 = Math.random();
        const lifeEnd = 3 + Math.sin(seed2 * 100) * 1; // from shader

        particlesRef.current.push({
          x: rx,
          y: ry,
          refX: rx,
          refY: ry,
          nearestX: rx,
          nearestY: ry,
          scale: 0,           // start at 0, fade in like shader
          velocity: 0,
          seed,
          seed2,
          lifeEnd,
        });
      }
    };

    // sdRoundBox — exact same function from the antigravity fragment shader
    // Returns signed distance to a rounded rectangle
    const sdRoundBox = (px: number, py: number, bx: number, by: number, r: number): number => {
      const qx = Math.abs(px) - bx + r;
      const qy = Math.abs(py) - by + r;
      return Math.min(Math.max(qx, qy), 0) + Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) - r;
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      const dt = 1 / 60;
      timeRef.current += dt;
      const time = timeRef.current;
      const timeHalf = time * 0.5; // uTime * .5 from shader

      const pts = particlesRef.current;
      const mouse = mouseRef.current;
      const colors = isDark ? CMOR_DARK : CMOR_LIGHT;

      // Smooth hover progress (like uIsHovering in shader)
      const targetHover = mouse.active ? 1 : 0;
      hoverProgressRef.current += (targetHover - hoverProgressRef.current) * 0.05;
      const isHovering = hoverProgressRef.current;

      // === SIMULATION PASS (replicating the sim fragment shader exactly) ===
      const distRadius = 0.15; // from shader: float distRadius = 0.15

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Life time calculation (exact shader logic)
        const lifeTime = ((p.seed * 100) + timeHalf) % p.lifeEnd;

        // Target position: mix between refPos and nearestPos based on hovering
        // vec2 targetPos = refPos; targetPos = mix(targetPos, nearestPos, uIsHovering * uIsHovering);
        const hoverMix = isHovering * isHovering; // quadratic like shader
        const targetX = p.refX + (p.nearestX - p.refX) * hoverMix;
        const targetY = p.refY + (p.nearestY - p.refY) * hoverMix;

        // Direction toward target (shader: vec2 direction = normalize(targetPos - pos); direction *= .01;)
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const dirX = dist > 0.0001 ? (dx / dist) * 0.01 : 0;
        const dirY = dist > 0.0001 ? (dy / dist) * 0.01 : 0;

        // distStrength = smoothstep(distRadius, 0., dist)
        const t1 = (distRadius - dist) / distRadius;
        const distStrength = Math.max(0, Math.min(1, t1 * t1 * (3 - 2 * t1)));

        // Update position
        if (dist > 0.005) {
          p.x += dirX * distStrength;
          p.y += dirY * distStrength;
        }

        // Reset on life start (shader: if(lifeTime < .01) { pos = refPos; scale = 0; })
        if (lifeTime < 0.01) {
          p.x = p.refX;
          p.y = p.refY;
          p.scale = 0;
        }

        // Scale animation (exact shader logic)
        // targetScale = smoothstep(.01, 0.5, lifeTime) - smoothstep(0.5, 1., lifeTime/lifeEnd)
        let targetScale = smoothstep(0.01, 0.5, lifeTime) - smoothstep(0.5, 1, lifeTime / p.lifeEnd);
        // targetScale += smoothstep(0.1, 0., smoothstep(0.001, .1, dist)) * 1.5 * uIsHovering
        const nearDist = smoothstep(0.001, 0.1, dist);
        targetScale += smoothstep(0.1, 0, nearDist) * 1.5 * isHovering;

        // Scale easing (shader: scaleDiff *= .1; scale += scaleDiff)
        const scaleDiff = (targetScale - p.scale) * 0.1;
        p.scale += scaleDiff;

        // Velocity = how close to target * hover (shader: velocity = smoothstep(distRadius, .001, dist) * uIsHovering)
        p.velocity = smoothstep(distRadius, 0.001, dist) * isHovering;

        // Final position with diff smoothing (shader: diff = finalPos - pFrame.xy; diff *= .2)
        const diffX = (p.x - (p.x - dirX * distStrength)) * 0.2;
        const diffY = (p.y - (p.y - dirY * distStrength)) * 0.2;

        // Update nearest positions toward mouse (the "swarm follow" behavior)
        if (mouse.active) {
          // Particles' nearest target moves toward mouse position
          const attractSpeed = 0.03;
          p.nearestX += (mouse.x - p.nearestX) * attractSpeed;
          p.nearestY += (mouse.y - p.nearestY) * attractSpeed;
        } else {
          // Slowly return nearest to ref position
          p.nearestX += (p.refX - p.nearestX) * 0.01;
          p.nearestY += (p.refY - p.nearestY) * 0.01;
        }
      }

      // === RENDER PASS (replicating the render fragment shader) ===

      // Clear
      ctx.fillStyle = isDark ? "#0a0a0b" : "#fafafa";
      ctx.fillRect(0, 0, w, h);

      const pixelRatio = dpr;
      const particleScale = (w / pixelRatio) / 2000 * 1.0; // from shader: width/2e3*particlesScale

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Skip invisible particles
        if (p.scale < 0.05) continue;

        // Convert from normalized space to screen pixels
        const screenX = p.x * w;
        const screenY = (1 - p.y) * h; // flip Y for screen coords

        // Point size (from shader: gl_PointSize = (vScale * 7.) * (uPixelRatio * 0.5) * uParticleScale + minScale * uPixelRatio)
        const minScale = isDark ? 0.25 : 1.0; // float(uColorScheme) * .75 + .25
        const pointSize = Math.max(1, (p.scale * 7) * (pixelRatio * 0.5) * particleScale + minScale * pixelRatio);

        // Angle toward mouse (shader: angle = atan(vLocalPos.y - uMousePos.y, vLocalPos.x - uMousePos.x))
        const angle = Math.atan2(p.y - mouse.y, p.x - mouse.x);

        // Color mixing (exact shader logic)
        // progress = vVelocity; col = mix(mix(color1, color2, progress/h), mix(color2, color3, (progress-h)/(1-h)), step(h, progress))
        const h_val = 0.8;
        const progress = p.velocity;
        let r: number, g: number, b: number;
        if (progress < h_val) {
          const t = progress / h_val;
          r = colors.color1.r + (colors.color2.r - colors.color1.r) * t;
          g = colors.color1.g + (colors.color2.g - colors.color1.g) * t;
          b = colors.color1.b + (colors.color2.b - colors.color1.b) * t;
        } else {
          const t = h_val < 1 ? (progress - h_val) / (1 - h_val) : 0;
          r = colors.color2.r + (colors.color3.r - colors.color2.r) * t;
          g = colors.color2.g + (colors.color3.g - colors.color2.g) * t;
          b = colors.color2.b + (colors.color3.b - colors.color2.b) * t;
        }
        r = Math.max(0, Math.min(255, Math.round(r)));
        g = Math.max(0, Math.min(255, Math.round(g)));
        b = Math.max(0, Math.min(255, Math.round(b)));

        // Alpha (shader: a = uAlpha * disc * smoothstep(0.1, 0.2, vScale))
        const baseAlpha = 0.85;
        const scaleAlpha = smoothstep(0.1, 0.2, p.scale);
        const alpha = baseAlpha * scaleAlpha;

        if (alpha < 0.01) continue;

        // Draw the particle as a rounded pill shape (sdRoundBox from shader)
        // The shader uses: sdRoundBox(uv, vec2(0.5, 0.2), vec4(.25))
        // This means a pill with half-extents (0.5, 0.2) and corner radius 0.25
        // Which creates a capsule/pill shape: width=1.0, height=0.4, radius=0.25

        const pillHalfW = pointSize * 0.5;
        const pillHalfH = pointSize * 0.2;
        const cornerR = pointSize * 0.25;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(-angle); // rotate toward mouse (negative because screen Y is flipped)

        // Draw rounded pill path
        const hw = pillHalfW;
        const hh = pillHalfH;
        const cr = Math.min(cornerR, hh); // corner radius can't exceed half height

        ctx.beginPath();
        ctx.moveTo(-hw + cr, -hh);
        ctx.lineTo(hw - cr, -hh);
        ctx.arc(hw - cr, 0, cr, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(-hw + cr, hh);
        ctx.arc(-hw + cr, 0, cr, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();

        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Smoothstep helper (matches GLSL smoothstep)
    function smoothstep(edge0: number, edge1: number, x: number): number {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    }

    initParticles();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      // Convert screen coords to normalized 0-1 space (like the shader)
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - (e.clientY / window.innerHeight), // flip Y for GL space
        active: true,
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX / window.innerWidth,
          y: 1 - (e.touches[0].clientY / window.innerHeight),
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
