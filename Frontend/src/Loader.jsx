import React, { useEffect, useRef, useState } from "react";

// Default SVG placeholder if logo is not provided
const DEFAULT_LOGO_DATA_URL =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23f2b84b'><circle cx='50' cy='50' r='45' fill='%23131b3d' stroke='%23f2b84b' stroke-width='4'/><polygon points='50,18 60,40 84,40 64,54 71,78 50,62 29,78 36,54 16,40 40,40'/></svg>";

const RAINBOW = [
  "#ef3b3b",
  "#f7792b",
  "#fbd21c",
  "#2fb34a",
  "#14b4e6",
  "#2f6fdc",
  "#4b3fa0",
  "#9b3a9a",
];

/* Planetary system around the logo.
   k = orbit size (fraction of canvas), tilt in degrees, speed in rad/s */
const ORBITS = [
  {
    k: 0.66,
    tilt: -10,
    speed: 0.9,
    line: "255,217,138",
    planets: [
      { phase: 0.4, size: 1, c1: "#ffe7a8", c2: "#e8912b", moon: true },
      { phase: Math.PI + 0.4, size: 0.62, c1: "#b9f3ff", c2: "#1aa6d8" },
    ],
  },
  {
    k: 0.84,
    tilt: 6,
    speed: -0.6,
    line: "160,200,255",
    planets: [
      { phase: 1.2, size: 1.25, c1: "#9fd4ff", c2: "#1f5fd6", moon: true },
      { phase: 4.3, size: 0.8, c1: "#ffb59a", c2: "#c4401e" },
    ],
  },
  {
    k: 1,
    tilt: -3,
    speed: 0.38,
    line: "210,170,255",
    planets: [
      { phase: 2.4, size: 1.55, c1: "#ffe2b8", c2: "#b87a3a", ring: true },
      { phase: 5.4, size: 0.95, c1: "#e0b8ff", c2: "#7a3fc4" },
    ],
    comet: { phase: 0, speed: 0.85 },
  },
];

const STAR_TINTS = ["255,255,255", "205,227,255", "255,233,196", "229,208,255"];

const Loader = ({
  loading = true,
  logo = DEFAULT_LOGO_DATA_URL,
  title = "Digitally Marking",
  subtitle = "The Extraordinary Achievement.",
}) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const stageRef = useRef(null);
  const bgRef = useRef(null);
  const backRef = useRef(null);
  const frontRef = useRef(null);

  /* ---------- show / hide smooth control without flicker ---------- */
  useEffect(() => {
    let timer;
    if (loading) {
      setMounted(true);
      // Double rAF ensures styles are computed before transition begins (prevents white-flash/blink)
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      document.body.style.overflow = "hidden";
      return () => cancelAnimationFrame(frame);
    } else {
      setVisible(false);
      timer = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = "auto";
      }, 650);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ---------- universe renderer ---------- */
  useEffect(() => {
    if (!mounted) return;
    const bg = bgRef.current;
    const back = backRef.current;
    const front = frontRef.current;
    const stage = stageRef.current;
    if (!bg || !back || !front || !stage) return;

    const bctx = bg.getContext("2d");
    const kctx = back.getContext("2d");
    const fctx = front.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, S = 0, dpr = 1, cx = 0, cy = 0, raf = 0;
    const start = performance.now();

    /* stars */
    const stars = Array.from({ length: 240 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.25 + 0.25,
      tw: Math.random() * 6.28,
      sp: 0.4 + Math.random() * 1.4,
      drift: 0.0006 + Math.random() * 0.002,
      tint: STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)],
    }));

    /* spiral galaxy particles */
    const gauss = () => Math.random() + Math.random() + Math.random() - 1.5;
    const galaxy = Array.from({ length: 1400 }, (_, i) => {
      const r = Math.pow(Math.random(), 0.72);
      const arm = i % 3;
      return {
        r,
        theta: arm * ((Math.PI * 2) / 3) + r * 4.4 + gauss() * 0.42 * (1 - r * 0.45),
        size: Math.random() * 1.5 + 0.5,
        a: 0.12 + Math.random() * 0.4,
        rgb: r < 0.2 ? "255,228,170" : r < 0.5 ? "196,146,255" : "100,165,255",
      };
    });

    /* shooting stars */
    const shooters = [];
    let nextShot = 1.2;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      
      bg.width = W * dpr;
      bg.height = H * dpr;
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      S = back.clientWidth || 320;
      [back, front].forEach((c) => {
        c.width = S * dpr;
        c.height = S * dpr;
      });
      kctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ---------- background ---------- */
    const drawBackground = (time) => {
      bctx.clearRect(0, 0, W, H);

      const rect = stage.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;

      /* galaxy core glow */
      const R = Math.min(Math.max(W, H) * 0.62, 820);
      const tilt = -0.2;
      const ct = Math.cos(tilt), st = Math.sin(tilt);

      const core = bctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.35);
      core.addColorStop(0, "rgba(255,226,160,0.22)");
      core.addColorStop(0.45, "rgba(170,110,255,0.08)");
      core.addColorStop(1, "rgba(0,0,0,0)");
      bctx.fillStyle = core;
      bctx.fillRect(0, 0, W, H);

      /* galaxy particles */
      bctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < galaxy.length; i++) {
        const g = galaxy[i];
        const ang = g.theta + (time * 0.05) / (0.35 + g.r);
        const gx = Math.cos(ang) * g.r * R;
        const gy = Math.sin(ang) * g.r * R * 0.4;
        const x = cx + gx * ct - gy * st;
        const y = cy + gx * st + gy * ct;
        const alpha = Math.max(0, Math.min(1, g.a * (1 - g.r * 0.55)));
        bctx.fillStyle = `rgba(${g.rgb},${alpha.toFixed(3)})`;
        bctx.fillRect(x, y, g.size, g.size);
      }
      bctx.globalCompositeOperation = "source-over";

      /* background stars */
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const x = ((s.x + time * s.drift) % 1) * W;
        const y = s.y * H;
        const a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.sp + s.tw));
        bctx.fillStyle = `rgba(${s.tint},${Math.max(0, Math.min(1, a)).toFixed(2)})`;
        if (s.r > 1) {
          bctx.beginPath();
          bctx.arc(x, y, s.r, 0, Math.PI * 2);
          bctx.fill();
        } else {
          bctx.fillRect(x, y, s.r * 1.6, s.r * 1.6);
        }
      }

      /* shooting stars */
      if (!reduce && time > nextShot) {
        shooters.push({
          x: Math.random() * W * 0.9 + W * 0.1,
          y: Math.random() * H * 0.45,
          vx: -(520 + Math.random() * 380),
          vy: 260 + Math.random() * 220,
          born: time,
        });
        nextShot = time + 2.5 + Math.random() * 3.5;
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        const life = time - s.born;
        if (life > 1.1) {
          shooters.splice(i, 1);
          continue;
        }
        const x = s.x + s.vx * life;
        const y = s.y + s.vy * life;
        const fade = Math.max(0, 1 - life / 1.1);
        const gr = bctx.createLinearGradient(x, y, x - s.vx * 0.16, y - s.vy * 0.16);
        gr.addColorStop(0, `rgba(255,255,255,${(0.95 * fade).toFixed(2)})`);
        gr.addColorStop(1, "rgba(255,255,255,0)");
        bctx.strokeStyle = gr;
        bctx.lineWidth = 1.6;
        bctx.beginPath();
        bctx.moveTo(x, y);
        bctx.lineTo(x - s.vx * 0.16, y - s.vy * 0.16);
        bctx.stroke();
      }
    };

    /* ---------- planetary system ---------- */
    const toRad = (d) => (d * Math.PI) / 180;

    const project = (o, t) => {
      const R = (S / 2) * o.k;
      const ry = R * 0.3;
      const tl = toRad(o.tilt);
      const x = R * Math.cos(t);
      const y = ry * Math.sin(t);
      return {
        x: S / 2 + x * Math.cos(tl) - y * Math.sin(tl),
        y: S / 2 + x * Math.sin(tl) + y * Math.cos(tl),
        d: Math.sin(t), // > 0 = in front of logo
      };
    };

    const drawPlanet = (ctx, p, def, time) => {
      const r = Math.max(1, S * 0.016 * def.size * (1 + 0.3 * p.d));
      ctx.save();
      ctx.globalAlpha = Math.max(0.2, Math.min(1, 0.72 + 0.28 * (0.5 + 0.5 * p.d)));

      if (def.ring) {
        ctx.strokeStyle = "rgba(255,226,184,0.7)";
        ctx.lineWidth = r * 0.28;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, r * 2, r * 0.62, -0.38, Math.PI, Math.PI * 2);
        ctx.stroke();
      }

      ctx.shadowColor = def.c2;
      ctx.shadowBlur = r * 2.6;
      const g = ctx.createRadialGradient(p.x - r * 0.4, p.y - r * 0.4, r * 0.1, p.x, p.y, r);
      g.addColorStop(0, def.c1);
      g.addColorStop(0.55, def.c2);
      g.addColorStop(1, "#070818");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (def.ring) {
        ctx.strokeStyle = "rgba(255,236,206,0.9)";
        ctx.lineWidth = r * 0.28;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, r * 2, r * 0.62, -0.38, 0, Math.PI);
        ctx.stroke();
      }

      if (def.moon) {
        const tm = time * 2.6 + def.phase;
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = r * 0.8;
        ctx.fillStyle = "#e9ecff";
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(tm) * r * 2.1, p.y + Math.sin(tm) * r * 0.9, r * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const renderPass = (ctx, isFront, time) => {
      ctx.clearRect(0, 0, S, S);
      ORBITS.forEach((o) => {
        const R = (S / 2) * o.k;

        /* orbit trail */
        ctx.beginPath();
        ctx.ellipse(
          S / 2,
          S / 2,
          R,
          R * 0.3,
          toRad(o.tilt),
          isFront ? 0 : Math.PI,
          isFront ? Math.PI : Math.PI * 2
        );
        ctx.strokeStyle = `rgba(${o.line},${isFront ? 0.3 : 0.12})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        /* comet */
        if (o.comet) {
          const base = o.comet.phase + time * o.comet.speed;
          for (let i = 26; i >= 0; i--) {
            const p = project(o, base - i * 0.05);
            if ((p.d > 0) !== isFront) continue;
            const a = 1 - i / 27;
            const rad = S * 0.0075 * a * (1 + 0.3 * p.d) + 0.4;
            ctx.save();
            ctx.shadowColor = "#ffd98a";
            ctx.shadowBlur = i === 0 ? 14 : 4;
            ctx.fillStyle = i === 0 ? "#fff" : `rgba(255,222,160,${(a * 0.6).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0.5, rad), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        /* planets */
        o.planets.forEach((def) => {
          const t = def.phase + time * o.speed;
          const p = project(o, t);
          if ((p.d > 0) === isFront) drawPlanet(ctx, p, def, time);
        });
      });
    };

    const loop = (now) => {
      const time = (now - start) / 1000;
      drawBackground(time);
      renderPass(kctx, false, time);
      renderPass(fctx, true, time);
      if (!reduce) {
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className={`pl-root ${visible ? "pl-show" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <style>{css}</style>

      {/* deep-space layers */}
      <div className="pl-nebula" />
      <canvas ref={bgRef} className="pl-bg" />
      <div className="pl-vignette" />

      <div className="pl-center">
        {/* ===== Logo + solar system ===== */}
        <div className="pl-stage" ref={stageRef}>
          <div className="pl-halo" />

          {/* planets/orbits BEHIND the logo */}
          <canvas ref={backRef} className="pl-orbit-canvas" style={{ zIndex: 1 }} />

          {/* rainbow pill */}
          <div className="pl-pill">
            {RAINBOW.map((c, i) => (
              <span
                key={c}
                className="pl-band"
                style={{
                  background: c,
                  inset: `calc(var(--ph) * ${(i * 0.055).toFixed(3)})`,
                  animationDelay: `${(i * 0.12).toFixed(2)}s`,
                }}
              />
            ))}
          </div>

          {/* round, spinning logo */}
          <div className="pl-logo-wrap">
            <span className="pl-pulse" />
            <span className="pl-pulse pl-pulse-2" />
            <span className="pl-orbit pl-orbit-a" />
            <span className="pl-orbit pl-orbit-b" />
            <span className="pl-sweep" />
            <div className="pl-logo-disc">
              <img src={logo} alt="logo" className="pl-logo" draggable={false} />
              <span className="pl-gloss" />
            </div>
          </div>

          {/* planets/orbits IN FRONT of the logo */}
          <canvas ref={frontRef} className="pl-orbit-canvas" style={{ zIndex: 4 }} />
        </div>

        {/* ===== Text ===== */}
        <h1 className="pl-title">{title}</h1>
        <p className="pl-subtitle">{subtitle}</p>

        <div className="pl-divider">
          <span className="pl-line pl-line-l" />
          <span className="pl-star">✦</span>
          <span className="pl-line pl-line-r" />
        </div>

        <div className="pl-progress">
          <span className="pl-progress-bar" />
        </div>

        <p className="pl-loading">
          Loading<span className="pl-dots"><i>.</i><i>.</i><i>.</i></span>
        </p>
      </div>
    </div>
  );
};

const css = `
.pl-root{
  --gold:#f2b84b;
  --gold-soft:#ffd98a;
  position:fixed; 
  inset:0; 
  z-index:99999;
  display:flex; 
  align-items:center; 
  justify-content:center;
  background: radial-gradient(120% 90% at 50% 25%, #0b1740 0%, #060c25 45%, #02040f 100%);
  opacity:0; 
  visibility:hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
  overflow:hidden;
  font-family:"Playfair Display","Cormorant Garamond",Georgia,serif;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}
.pl-root.pl-show{ 
  opacity:1; 
  visibility:visible; 
}

/* ---------- deep space ---------- */
.pl-nebula{
  position:absolute; 
  inset:-25%;
  background:
    radial-gradient(38% 32% at 18% 28%, rgba(155,58,154,0.28), transparent 70%),
    radial-gradient(38% 32% at 82% 72%, rgba(20,150,230,0.22), transparent 70%),
    radial-gradient(30% 26% at 68% 14%, rgba(242,184,75,0.14), transparent 70%),
    radial-gradient(30% 26% at 24% 84%, rgba(90,60,200,0.20), transparent 70%);
  filter:blur(36px);
  will-change: transform;
  animation: pl-nebula 16s ease-in-out infinite alternate;
}
.pl-bg{ 
  position:absolute; 
  inset:0; 
  width:100%; 
  height:100%; 
  pointer-events:none; 
}
.pl-vignette{
  position:absolute; 
  inset:0; 
  pointer-events:none;
  background: radial-gradient(ellipse at center, transparent 45%, rgba(0,0,8,0.65) 100%);
}

/* ---------- layout ---------- */
.pl-center{
  position:relative; 
  z-index:2; 
  text-align:center;
  display:flex; 
  flex-direction:column; 
  align-items:center;
  padding:24px; 
  width:min(94vw, 640px);
  transform: translateY(12px) scale(0.97);
  transition: transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}
.pl-root.pl-show .pl-center{ 
  transform: translateY(0) scale(1); 
}

/* ---------- logo stage ---------- */
.pl-stage{
  --ph: clamp(78px, 20vw, 112px);   /* pill height drives everything */
  --S: min(94vw, 560px);            /* planetary system diameter */
  position:relative;
  width:calc(var(--ph) * 2.7);
  height:var(--ph);
  margin:40px 0 60px;
  display:flex; 
  align-items:center; 
  justify-content:center;
}
.pl-halo{
  position:absolute; 
  inset:-60% -20%;
  background: radial-gradient(closest-side, rgba(242,184,75,0.30), rgba(155,58,154,0.14) 55%, transparent 75%);
  animation: pl-breathe 3.4s ease-in-out infinite;
  pointer-events:none;
}
.pl-orbit-canvas{
  position:absolute; 
  left:50%; 
  top:50%;
  width:var(--S); 
  height:var(--S);
  transform:translate(-50%,-50%);
  pointer-events:none;
}
.pl-pill{
  position:absolute; 
  inset:0; 
  z-index:2;
  filter: drop-shadow(0 12px 28px rgba(0,0,0,0.55)) drop-shadow(0 0 24px rgba(155,58,154,0.45));
  animation: pl-pill-float 4.2s ease-in-out infinite;
}
.pl-band{
  position:absolute; 
  border-radius:999px;
  transform-origin:center;
  animation: pl-ripple 2.4s ease-in-out infinite;
}

/* ---------- round logo ---------- */
.pl-logo-wrap{
  position:relative; 
  z-index:3;
  width:calc(var(--ph) * 1.08);
  aspect-ratio:1/1;
  display:flex; 
  align-items:center; 
  justify-content:center;
}
.pl-pulse{
  position:absolute; 
  inset:0; 
  border-radius:50%;
  border:1.5px solid rgba(255,217,138,0.75);
  animation: pl-pulse 3.2s ease-out infinite;
}
.pl-pulse-2{ animation-delay:1.6s; }
.pl-orbit{ position:absolute; border-radius:50%; pointer-events:none; }
.pl-orbit-a{
  inset:-9px;
  border:2px solid transparent;
  border-top-color:var(--gold-soft);
  border-right-color:rgba(255,217,138,0.35);
  filter:drop-shadow(0 0 8px rgba(242,184,75,0.9));
  animation: pl-spin 2.2s linear infinite;
}
.pl-orbit-b{
  inset:-17px;
  border:1px dashed rgba(255,255,255,0.5);
  animation: pl-spin 9s linear infinite reverse;
}
.pl-sweep{
  position:absolute; 
  inset:-4px; 
  border-radius:50%;
  background: conic-gradient(from 0deg, transparent 0 70%, rgba(255,255,255,0.9) 92%, transparent 100%);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
  animation: pl-spin 1.6s linear infinite;
}
.pl-logo-disc{
  position:relative; 
  width:100%; 
  height:100%; 
  border-radius:50%;
  background:#fff;
  box-shadow:
    0 0 0 3px #fff,
    0 0 0 5px rgba(242,184,75,0.95),
    0 10px 30px rgba(0,0,0,0.6),
    0 0 46px rgba(242,184,75,0.55);
  overflow:hidden;
  animation: pl-logo-pulse 3s ease-in-out infinite;
  backface-visibility: hidden;
  transform: translateZ(0);
}
.pl-logo{
  width:100%; 
  height:100%; 
  object-fit:cover; 
  display:block; 
  border-radius:50%;
  user-select:none;
  animation: pl-spin 14s linear infinite;
}
.pl-gloss{
  position:absolute; 
  inset:0; 
  border-radius:50%; 
  pointer-events:none;
  background: linear-gradient(120deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 40%);
  mix-blend-mode:soft-light;
}

/* ---------- text ---------- */
.pl-title{
  margin:0; 
  font-weight:700;
  font-size:clamp(26px, 6vw, 40px);
  line-height:1.2; 
  letter-spacing:0.5px;
  background: linear-gradient(100deg, #c98a1e 0%, #ffd98a 30%, #fff3cf 48%, #ffd98a 66%, #c98a1e 100%);
  background-size:220% 100%;
  -webkit-background-clip:text; 
  background-clip:text;
  color:transparent; 
  -webkit-text-fill-color:transparent;
  filter:drop-shadow(0 0 14px rgba(242,184,75,0.4));
  animation: pl-shimmer 3.2s linear infinite;
}
.pl-subtitle{
  margin:10px 0 0; 
  color:#f4f6ff; 
  font-weight:600;
  font-size:clamp(14px, 3.4vw, 19px); 
  letter-spacing:0.3px;
  text-shadow:0 2px 14px rgba(0,0,0,0.6);
}
.pl-divider{
  display:flex; 
  align-items:center; 
  gap:14px; 
  width:min(100%, 380px); 
  margin:24px 0 16px;
}
.pl-line{ flex:1; height:1px; }
.pl-line-l{ background: linear-gradient(90deg, transparent, rgba(242,184,75,0.9)); }
.pl-line-r{ background: linear-gradient(270deg, transparent, rgba(242,184,75,0.9)); }
.pl-star{
  color:var(--gold-soft); 
  font-size:20px; 
  line-height:1;
  text-shadow:0 0 12px rgba(255,217,138,0.95), 0 0 24px rgba(242,184,75,0.7);
  animation: pl-star 2.4s ease-in-out infinite;
}
.pl-progress{
  width:min(70%, 250px); 
  height:3px; 
  border-radius:3px;
  background:rgba(255,255,255,0.12); 
  overflow:hidden; 
  position:relative;
}
.pl-progress-bar{
  position:absolute; 
  top:0; 
  bottom:0; 
  width:40%; 
  border-radius:3px;
  background: linear-gradient(90deg, transparent, var(--gold) 30%, #fff 55%, var(--gold) 80%, transparent);
  box-shadow:0 0 12px rgba(242,184,75,0.9);
  animation: pl-slide 1.5s cubic-bezier(0.6, 0.1, 0.3, 0.9) infinite;
}
.pl-loading{
  margin:14px 0 0; 
  color:var(--gold-soft);
  font-family:system-ui, -apple-system, sans-serif;
  font-size:11px; 
  font-weight:600; 
  letter-spacing:4px; 
  text-transform:uppercase;
  opacity:0.9;
}
.pl-dots i{ font-style:normal; animation: pl-dot 1.2s infinite; opacity:0.2; }
.pl-dots i:nth-child(2){ animation-delay:0.2s; }
.pl-dots i:nth-child(3){ animation-delay:0.4s; }

/* ---------- keyframes ---------- */
@keyframes pl-spin{ to{ transform:rotate(360deg); } }
@keyframes pl-ripple{ 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.035, 1.09); } }
@keyframes pl-pill-float{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-5px); } }
@keyframes pl-breathe{ 0%,100%{ opacity:0.55; transform:scale(0.96); } 50%{ opacity:1; transform:scale(1.06); } }
@keyframes pl-logo-pulse{ 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.045); } }
@keyframes pl-pulse{ 0%{ transform:scale(1); opacity:0.8; } 100%{ transform:scale(3.4); opacity:0; } }
@keyframes pl-shimmer{ 0%{ background-position:200% 0; } 100%{ background-position:-20% 0; } }
@keyframes pl-star{ 0%,100%{ transform:scale(0.85) rotate(0deg); opacity:0.7; } 50%{ transform:scale(1.25) rotate(90deg); opacity:1; } }
@keyframes pl-slide{ 0%{ left:-45%; } 100%{ left:105%; } }
@keyframes pl-dot{ 0%,100%{ opacity:0.2; } 40%{ opacity:1; } }
@keyframes pl-nebula{
  0%{ transform:translate3d(-2%, -2%, 0) rotate(0deg) scale(1); }
  100%{ transform:translate3d(2%, 2%, 0) rotate(5deg) scale(1.06); }
}

@media (prefers-reduced-motion: reduce){
  .pl-root *{ animation-duration:14s !important; }
}
`;

export default Loader;