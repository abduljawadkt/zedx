// Zedx hero animation — scenes
// 18s cinematic loop, 1920x1080
//
// Six products flow one-by-one through a continuous stellar current, then
// converge into a final ensemble shot with the brand lockup.
//   0.0  →  2.6   Z-Boom Speaker
//   2.6  →  5.2   Power Dock X
//   5.2  →  7.8   Magnetic Mount
//   7.8  → 10.4   Open-Ear Buds
//  10.4  → 13.0   Lumen 100 Headphones
//  13.0  → 15.6   AT24 Ultra Watch
//  15.6  → 18.0   Collection finale (all 6 + logo + tagline)

const STAGE_W = 1920;
const STAGE_H = 1080;

const BRAND = {
  cyan: '#00a0e3',
  cyanSoft: '#7ddcff',
  cyanDeep: '#0078ad',
  ink: '#04070d',
  inkSoft: '#0a1220',
  white: '#f4f8fb',
  mute: 'rgba(225,238,255,0.55)',
};

// ── Product catalog (single source of truth — used by both per-product
// scenes and the final ensemble shot) ──────────────────────────────────────
const PRODUCTS = [
  { id: 'speaker',    src: 'assets/speaker.png',    eyebrow: 'Audio',        shortName: 'Z-Boom',     name: ['Z-Boom',    'Speaker'],     tagline: 'Studio-grade sound. Portable form.',     glow: '#c34dff' },
  { id: 'dock',       src: 'assets/dock.png',       eyebrow: 'Charge',       shortName: 'Power Dock', name: ['Power',     'Dock X'],      tagline: '105W GaN Pro. Three ports. One brick.',  glow: '#ff8a3b' },
  { id: 'mount',      src: 'assets/mount.png',      eyebrow: 'Drive',        shortName: 'Mag Mount',  name: ['Magnetic',  'Mount'],       tagline: 'Snap-lock magnets. 15W wireless.',       glow: '#1eb6ff' },
  { id: 'earbuds',    src: 'assets/earbuds.png',    eyebrow: 'Audio',        shortName: 'Open-Ear',   name: ['Open-Ear',  'Buds'],        tagline: 'Surround sound. Aware of the world.',    glow: '#7c9fff' },
  { id: 'headphones', src: 'assets/headphones.png', eyebrow: 'Audio',        shortName: 'Lumen 100',  name: ['Lumen 100', 'Headphones'],  tagline: 'Active noise cancel. 40h playtime.',     glow: '#d6a64a' },
  { id: 'watch',      src: 'assets/watch.png',      eyebrow: 'Wear',         shortName: 'AT24 Ultra', name: ['AT24',      'Ultra'],       tagline: 'Titanium frame. Built to go further.',   glow: '#ff7a3b' },
];

// ── Scene color keyframes — one per product + loop-back ────────────────────
const SCENE_KEYS = [
  { t: 0.0,  rgb: [195,  77, 255] }, // speaker (magenta)
  { t: 2.6,  rgb: [255, 138,  59] }, // dock    (amber)
  { t: 5.2,  rgb: [  0, 160, 227] }, // mount   (brand blue)
  { t: 7.8,  rgb: [124, 159, 255] }, // earbuds (cool blue)
  { t: 10.4, rgb: [214, 166,  74] }, // headphones (gold)
  { t: 13.0, rgb: [255, 122,  59] }, // watch   (amber)
  { t: 15.6, rgb: [  0, 160, 227] }, // collection (brand blue)
  { t: 18.0, rgb: [195,  77, 255] }, // loop back
];

const BOUNDARIES = [2.6, 5.2, 7.8, 10.4, 13.0, 15.6];

function sceneColor(time, alpha = 1) {
  const t = ((time % 18) + 18) % 18;
  let i = 0;
  while (i < SCENE_KEYS.length - 1 && t > SCENE_KEYS[i + 1].t) i++;
  const a = SCENE_KEYS[i];
  const b = SCENE_KEYS[Math.min(i + 1, SCENE_KEYS.length - 1)];
  const span = Math.max(0.001, b.t - a.t);
  const local = clamp((t - a.t) / span, 0, 1);
  const holdFrac = 0.48;
  let mix;
  if (local < holdFrac) mix = 0;
  else {
    const x = (local - holdFrac) / (1 - holdFrac);
    mix = x * x * (3 - 2 * x);
  }
  const r = Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * mix);
  const g = Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * mix);
  const bl = Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * mix);
  return `rgba(${r},${g},${bl},${alpha})`;
}

function transitionStrength(time, halfWidth = 0.7) {
  const t = ((time % 18) + 18) % 18;
  let max = 0;
  for (const b of BOUNDARIES) {
    const d = Math.abs(t - b);
    if (d < halfWidth) {
      const s = 1 - d / halfWidth;
      const eased = s * s * (3 - 2 * s);
      if (eased > max) max = eased;
    }
  }
  return max;
}

// ── Nebula background ──────────────────────────────────────────────────────
function NebulaBackground() {
  const t = useTime();
  const ax = 32 + Math.sin(t * 0.16) * 10 + t * 0.18;
  const ay = 38 + Math.cos(t * 0.14) * 8;
  const bx = 68 + Math.cos(t * 0.12) * 11 - t * 0.14;
  const by = 62 + Math.sin(t * 0.18) * 8;
  const c1 = sceneColor(t, 0.38);
  const c2 = sceneColor(t + 0.6, 0.28);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        radial-gradient(ellipse 80% 60% at ${ax}% ${ay}%, ${c1} 0%, transparent 55%),
        radial-gradient(ellipse 70% 55% at ${bx}% ${by}%, ${c2} 0%, transparent 60%),
        radial-gradient(ellipse 100% 100% at 50% 50%, #0a1626 0%, #04070d 75%)
      `,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 3px)',
        mixBlendMode: 'overlay',
        opacity: 0.6,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ── Aurora ribbon ──────────────────────────────────────────────────────────
function AuroraRibbon({ baseY = 540, amp = 90, period = 7, thickness = 140, opacity = 0.45, phase = 0 }) {
  const t = useTime();
  const cy = baseY + Math.sin((t + phase) / period * Math.PI * 2) * amp;
  const cy2 = baseY + Math.cos((t + phase) / (period * 1.3) * Math.PI * 2) * amp * 0.8;
  const d = `M -200,${cy} C 480,${cy - 220} 1440,${cy2 + 240} 2120,${cy2}`;
  const colMain = sceneColor(t, 0.95);
  const colEdge = sceneColor(t + 0.4, 0);
  const gradId = `aurora-grad-${phase}`;
  return (
    <svg
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        opacity, filter: 'blur(10px)',
        pointerEvents: 'none', mixBlendMode: 'screen',
      }}
      viewBox="0 0 1920 1080" preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor={colEdge} />
          <stop offset="45%" stopColor={colMain} />
          <stop offset="55%" stopColor={colMain} />
          <stop offset="100%" stopColor={colEdge} />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke={`url(#${gradId})`} strokeWidth={thickness} strokeLinecap="round" />
    </svg>
  );
}

// ── Stellar stream ─────────────────────────────────────────────────────────
function StellarStream({ count = 95, seed = 7 }) {
  const t = useTime();
  const particles = React.useMemo(() => {
    const out = [];
    let s = seed;
    const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < count; i++) {
      out.push({
        baseY: -10 + r() * 120,
        amp: 2 + r() * 8,
        period: 3 + r() * 7,
        phase: r() * 6.28,
        speed: 5 + r() * 14,
        offset: r() * 130,
        size: 1 + r() * 2.6,
        depth: 0.35 + r() * 0.65,
        streak: r() < 0.22,
        rise: -2 + r() * 4,
      });
    }
    return out;
  }, [count, seed]);

  const transition = transitionStrength(t, 1.1);
  const speedMult = 0.72 + transition * 0.24;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p, i) => {
        let x = ((p.offset + t * p.speed * speedMult) % 130) - 15;
        let y = p.baseY + Math.sin(t / p.period * 6.28 + p.phase) * p.amp + t * p.rise * 0.5;
        y = ((y % 120) + 120) % 120 - 10;

        const col = sceneColor(t, (0.35 + p.depth * 0.45));
        const colCore = sceneColor(t, 0.95);

        if (p.streak) {
          const len = 44 + p.size * 22 + transition * 34;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              width: len, height: Math.max(1, p.size * 0.7),
              background: `linear-gradient(90deg, transparent 0%, ${col} 55%, ${colCore} 100%)`,
              transform: 'translate(-100%, -50%)',
              borderRadius: 999,
              opacity: p.depth,
              filter: `blur(${0.3 + p.depth * 0.6}px)`,
              boxShadow: `0 0 ${p.size * 8}px ${col}`,
            }} />
          );
        }
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            width: p.size, height: p.size,
            background: colCore,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: p.depth * (0.55 + 0.45 * Math.sin(t * 1.4 + p.phase)),
            boxShadow: `0 0 ${p.size * 5}px ${col}`,
            filter: 'blur(0.3px)',
          }} />
        );
      })}
    </div>
  );
}

// ── Warp burst ─────────────────────────────────────────────────────────────
function WarpBurst() {
  const t = useTime();
  const tt = ((t % 18) + 18) % 18;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {BOUNDARIES.map((b, i) => {
        const dt = tt - b;
        if (dt < -0.5 || dt > 1.4) return null;
        const local = clamp((dt + 0.5) / 1.9, 0, 1);
        const eased = Easing.easeOutQuart(local);

        const ringOut = sceneColor(b - 0.05, 0.85);
        const ringSize = 100 + eased * 2400;
        const ringOpacity = Math.max(0, 1 - local) * 0.7;

        const ringIn = sceneColor(b + 0.4, 0.9);
        const ringInLocal = clamp((dt + 0.1) / 0.8, 0, 1);
        const ringInEased = 1 - Easing.easeInCubic(1 - ringInLocal);
        const ringInSize = 1800 - ringInEased * 1500;
        const ringInOpacity = ringInLocal < 1 ? (1 - ringInLocal) * 0.5 : 0;

        const flareT = clamp(1 - Math.abs(dt) / 0.5, 0, 1);
        const flareSize = 600 + flareT * 800;
        const flareOpacity = flareT * 0.7;
        const flareCol = sceneColor(b, 1);

        return (
          <React.Fragment key={i}>
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              width: ringSize, height: ringSize,
              marginLeft: -ringSize / 2, marginTop: -ringSize / 2,
              borderRadius: '50%',
              border: `2px solid ${ringOut}`,
              opacity: ringOpacity,
              filter: 'blur(2px)',
              boxShadow: `0 0 80px ${ringOut}, inset 0 0 60px ${ringOut}`,
              mixBlendMode: 'screen',
            }} />
            {ringInOpacity > 0 && (
              <div style={{
                position: 'absolute', left: '50%', top: '50%',
                width: ringInSize, height: ringInSize,
                marginLeft: -ringInSize / 2, marginTop: -ringInSize / 2,
                borderRadius: '50%',
                border: `1.5px solid ${ringIn}`,
                opacity: ringInOpacity,
                filter: 'blur(3px)',
                boxShadow: `0 0 60px ${ringIn}`,
                mixBlendMode: 'screen',
              }} />
            )}
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              width: flareSize, height: flareSize,
              marginLeft: -flareSize / 2, marginTop: -flareSize / 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${flareCol} 0%, transparent 55%)`,
              opacity: flareOpacity,
              filter: 'blur(30px)',
              mixBlendMode: 'screen',
            }} />
          </React.Fragment>
        );
      })}
    </div>
  );
}

function sceneMix(localTime, duration, entry = 0.75, exit = 0.5) {
  const exitStart = duration - exit;
  let enterT = clamp(localTime / entry, 0, 1);
  let exitT = clamp((localTime - exitStart) / exit, 0, 1);
  const holdSpan = Math.max(0.001, exitStart - entry);
  let holdT = clamp((localTime - entry) / holdSpan, 0, 1);
  return { enterT, holdT, exitT };
}

// ── Persistent collection rail ─────────────────────────────────────────────
// A small "constellation" of all 6 products tucked into the bottom edge,
// visible throughout the whole video. The active one is highlighted with
// the scene's glow color; the rest sit dim. This satisfies the "show all
// products even while animation is going" intent — the viewer always
// knows the full lineup, even mid-zoom.
function CollectionRail() {
  const t = useTime();
  const tt = ((t % 18) + 18) % 18;
  // Active product index (matches the scene timing)
  let active = 0;
  if (tt < 2.6) active = 0;
  else if (tt < 5.2) active = 1;
  else if (tt < 7.8) active = 2;
  else if (tt < 10.4) active = 3;
  else if (tt < 13.0) active = 4;
  else if (tt < 15.6) active = 5;
  else active = -1; // collection finale — no single active item

  // Hide rail during the finale (it appears properly in the finale)
  const finaleFade = tt < 15.0 ? 1 : tt < 15.6 ? 1 - (tt - 15.0) / 0.6 : 0;

  return (
    <div style={{
      position: 'absolute',
      left: 0, right: 0, bottom: 50,
      display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
      gap: 28,
      pointerEvents: 'none',
      opacity: finaleFade,
      transition: 'opacity 200ms',
      zIndex: 20,
    }}>
      {PRODUCTS.map((p, i) => {
        const isActive = i === active;
        const scale = isActive ? 1.15 : 0.92;
        const pulse = isActive ? 0.6 + 0.4 * Math.sin(t * 3) : 0;
        return (
          <div key={p.id} style={{
            position: 'relative',
            width: 76, height: 76,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${scale})`,
            transition: 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}>
            {isActive && (
              <div style={{
                position: 'absolute', inset: -6,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${p.glow}aa 0%, ${p.glow}33 40%, transparent 70%)`,
                filter: 'blur(8px)',
                opacity: 0.4 + 0.4 * pulse,
              }} />
            )}
            <img src={p.src} alt={p.shortName} style={{
              position: 'relative',
              width: '100%', height: '100%',
              objectFit: 'contain',
              opacity: isActive ? 1 : 0.32,
              filter: isActive
                ? `drop-shadow(0 0 12px ${p.glow}cc)`
                : 'grayscale(0.6) brightness(0.85)',
              transition: 'opacity 400ms, filter 400ms',
            }} />
            <div style={{
              position: 'absolute',
              bottom: -22,
              left: '50%', transform: 'translateX(-50%)',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 9,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: isActive ? BRAND.white : 'rgba(255,255,255,0.35)',
              whiteSpace: 'nowrap',
              transition: 'color 400ms',
            }}>
              {p.shortName}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Product reveal scene ───────────────────────────────────────────────────
function ProductScene({ src, name, tagline, eyebrow, glowColor = BRAND.cyan, rotateDir = 1, startScale = 1, endScale = 1.08 }) {
  const { localTime, duration } = useSprite();
  const { enterT, holdT, exitT } = sceneMix(localTime, duration, 1.15, 1.1);

  const eEnter = Easing.easeOutSine(enterT);
  const eExit = Easing.easeInOutSine(exitT);
  const driftT = Easing.easeInOutSine(holdT);

  const scale = startScale + (endScale - startScale) * driftT - (1 - eEnter) * 0.08 - eExit * 0.035;
  const opacity = eEnter * (1 - eExit);
  const rotY = rotateDir * (-3.5 + 7 * driftT) + Math.sin(localTime * 0.32) * 0.55;
  const rotX = -1.2 + Math.cos(localTime * 0.28) * 0.9;
  const ty = (1 - eEnter) * 18 + Math.sin(localTime * 0.42) * 3 - eExit * 16;
  const tx = (1 - eEnter) * -10 * rotateDir + eExit * 12 * rotateDir;

  const glowPulse = 0.92 + 0.08 * Math.sin(localTime * 0.62);
  const glowOpacity = eEnter * (1 - eExit * 0.45);

  const captionEase = Easing.easeOutSine(clamp(localTime / 1.25, 0, 1));
  const captionY = (1 - captionEase) * 18;
  const captionOp = captionEase * (1 - eExit);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 1100, height: 1100, marginLeft: -550, marginTop: -550,
        background: `radial-gradient(circle, ${glowColor} 0%, ${glowColor}aa 12%, ${glowColor}33 35%, transparent 65%)`,
        opacity: 0.55 * glowOpacity * glowPulse,
        filter: 'blur(40px)',
        transform: `translate3d(${tx * 0.2}px, ${ty * 0.2}px, 0) scale(${1 + driftT * 0.04})`,
        mixBlendMode: 'screen',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 600, height: 600, marginLeft: -300, marginTop: -300,
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 60%)`,
        opacity: 0.4 * glowOpacity,
        filter: 'blur(20px)',
        transform: `translate3d(${tx * 0.35}px, ${ty * 0.35}px, 0)`,
        mixBlendMode: 'screen',
      }} />

      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 920, height: 920, marginLeft: -460, marginTop: -460,
        opacity,
        transform: `translate3d(${tx}px, ${ty}px, 0) perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`,
        transformOrigin: 'center',
        willChange: 'transform, opacity',
      }}>
        <img src={src} alt="" style={{
          width: '100%', height: '100%', objectFit: 'contain',
          filter: `contrast(1.06) saturate(1.1) brightness(1.04) drop-shadow(0 50px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 80px ${glowColor}66)`,
        }} />
      </div>

      <div style={{
        position: 'absolute',
        left: '50%', bottom: 230,
        width: 700, height: 24,
        marginLeft: -350,
        background: `radial-gradient(ellipse, ${glowColor}99 0%, transparent 70%)`,
        opacity: 0.5 * glowOpacity,
        filter: 'blur(8px)',
        transform: `translate3d(${tx * 0.25}px, 0, 0)`,
      }} />

      <div style={{
        position: 'absolute', left: 100, top: 110,
        opacity: captionOp,
        transform: `translate3d(0, ${captionY}px, 0)`,
      }}>
        <div style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: 16, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: BRAND.cyan,
          marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ display: 'inline-block', width: 36, height: 1, background: BRAND.cyan }} />
          {eyebrow}
        </div>
        <div style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700, fontSize: 84, letterSpacing: '-0.03em',
          color: BRAND.white, lineHeight: 0.95,
          textShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}>
          {name[0]}<br/>{name[1]}
        </div>
        <div style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 400, fontSize: 22, color: BRAND.mute,
          marginTop: 18, letterSpacing: '0.01em',
          maxWidth: 520, lineHeight: 1.4,
        }}>
          {tagline}
        </div>
      </div>
    </div>
  );
}

// ── Collection finale ──────────────────────────────────────────────────────
// All 6 products converge into a single hero frame. Logo + tagline + CTAs
// occupy the upper-middle; the 6 products line up across the lower band,
// each lit by its signature glow. Caption: "The Zedx Collection".
function CollectionFinale() {
  const { localTime, duration } = useSprite();

  // Title block (top)
  const titleT = Easing.easeOutCubic(clamp(localTime / 1.1, 0, 1));
  const titleOp = titleT;
  const titleY = (1 - titleT) * 30;

  // Logo
  const logoT = Easing.easeOutCubic(clamp((localTime - 0.2) / 1.0, 0, 1));
  const logoBlur = (1 - logoT) * 18;
  const logoScale = 0.85 + 0.15 * logoT;

  // Tagline
  const tagT = Easing.easeOutCubic(clamp((localTime - 0.7) / 0.9, 0, 1));

  // CTAs
  const ctaT = Easing.easeOutCubic(clamp((localTime - 1.3) / 0.7, 0, 1));

  // Product row enters with stagger
  const productStagger = 0.14;
  const productBase = 0.5;

  // Exit (last 0.4s, looping back to scene 1)
  const exitT = clamp((localTime - (duration - 0.5)) / 0.5, 0, 1);
  const groupOp = 1 - exitT * 0.95;
  const groupScale = 1 + exitT * 0.04;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity: groupOp,
      transform: `scale(${groupScale})`,
    }}>
      {/* big central glow */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 420,
        width: 1400, height: 1000,
        marginLeft: -700, marginTop: -500,
        background: `radial-gradient(ellipse, ${BRAND.cyan}55 0%, ${BRAND.cyan}15 30%, transparent 60%)`,
        opacity: logoT * (0.7 + 0.3 * Math.sin(localTime * 2)),
        filter: 'blur(50px)',
        mixBlendMode: 'screen',
      }} />

      {/* Eyebrow */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 150,
        transform: `translate(-50%, ${titleY}px)`,
        opacity: titleOp,
        fontFamily: 'Poppins, sans-serif',
        fontSize: 16,
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        color: BRAND.cyan,
        display: 'flex', alignItems: 'center', gap: 16,
        whiteSpace: 'nowrap',
      }}>
        <span style={{ width: 60, height: 1, background: BRAND.cyan }} />
        The Zedx Collection
        <span style={{ width: 60, height: 1, background: BRAND.cyan }} />
      </div>

      {/* Logo */}
      <img
        src="assets/logo.webp"
        alt="zedx"
        style={{
          position: 'absolute',
          left: '50%', top: 230,
          transform: `translate(-50%, 0) scale(${logoScale})`,
          height: 150,
          opacity: logoT,
          filter: `blur(${logoBlur}px) drop-shadow(0 0 40px ${BRAND.cyan}aa)`,
        }}
      />

      {/* Tagline */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 430,
        transform: `translate(-50%, ${(1 - tagT) * 20}px)`,
        opacity: tagT,
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 300,
        fontSize: 42,
        letterSpacing: '0.02em',
        color: BRAND.white,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        Engineered for the everyday.
      </div>

      {/* CTA row */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 520,
        transform: `translate(-50%, ${(1 - ctaT) * 16}px)`,
        opacity: ctaT,
        display: 'flex', gap: 18,
      }}>
        <div style={{
          padding: '16px 32px',
          background: BRAND.cyan, color: BRAND.ink,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600, fontSize: 14,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          borderRadius: 4,
          boxShadow: `0 8px 32px ${BRAND.cyan}66, 0 0 0 1px ${BRAND.cyan}`,
        }}>
          Shop the range
        </div>
        <div style={{
          padding: '16px 32px',
          color: BRAND.white,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500, fontSize: 14,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.25)',
        }}>
          Learn more →
        </div>
      </div>

      {/* Product line-up */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        bottom: 90,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        gap: 24,
      }}>
        {PRODUCTS.map((p, i) => {
          const delay = productBase + i * productStagger;
          const pT = Easing.easeOutCubic(clamp((localTime - delay) / 0.8, 0, 1));
          const pY = (1 - pT) * 70;
          const pOp = pT;
          const float = Math.sin(localTime * 1.0 + i * 0.7) * 5;
          const pulse = 0.85 + 0.15 * Math.sin(localTime * 1.6 + i * 0.9);
          return (
            <div key={p.id} style={{
              position: 'relative',
              width: 270, height: 270,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: pOp,
              transform: `translateY(${pY + float}px)`,
            }}>
              {/* outer halo */}
              <div style={{
                position: 'absolute',
                left: '50%', top: '50%',
                width: 320, height: 320,
                marginLeft: -160, marginTop: -160,
                background: `radial-gradient(circle, ${p.glow} 0%, ${p.glow}66 22%, transparent 65%)`,
                opacity: 0.55 * pulse,
                filter: 'blur(28px)',
                mixBlendMode: 'screen',
              }} />
              {/* inner punch */}
              <div style={{
                position: 'absolute',
                left: '50%', top: '50%',
                width: 200, height: 200,
                marginLeft: -100, marginTop: -100,
                background: `radial-gradient(circle, ${p.glow} 0%, transparent 60%)`,
                opacity: 0.6,
                filter: 'blur(14px)',
                mixBlendMode: 'screen',
              }} />
              <img src={p.src} alt="" style={{
                position: 'relative',
                width: 250, height: 250,
                objectFit: 'contain',
                filter: `contrast(1.06) saturate(1.12) brightness(1.06) drop-shadow(0 18px 28px rgba(0,0,0,0.7)) drop-shadow(0 0 30px ${p.glow}cc)`,
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Bottom ticker ──────────────────────────────────────────────────────────
function BottomTicker() {
  const t = useTime();
  const tt = ((t % 18) + 18) % 18;
  // Hide in finale (collection has its own UI)
  const fade = tt < 15.0 ? 1 : tt < 15.6 ? 1 - (tt - 15.0) / 0.6 : 0;
  return (
    <div style={{
      position: 'absolute',
      right: 100, top: 110,
      opacity: 0.85 * fade,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'Poppins, sans-serif',
      fontSize: 12,
      letterSpacing: '0.24em',
      color: BRAND.mute,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      <span>Engineered · Tested · Verified</span>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: BRAND.cyan,
        boxShadow: `0 0 10px ${BRAND.cyan}`,
        opacity: 0.55 + 0.45 * Math.sin(t * 3),
        flexShrink: 0,
      }} />
    </div>
  );
}

// ── Scene counter ──────────────────────────────────────────────────────────
function SceneIndexCounter() {
  const t = useTime();
  const tt = ((t % 18) + 18) % 18;
  const TOTAL = 7;
  let idx;
  if (tt < 2.6) idx = 1;
  else if (tt < 5.2) idx = 2;
  else if (tt < 7.8) idx = 3;
  else if (tt < 10.4) idx = 4;
  else if (tt < 13.0) idx = 5;
  else if (tt < 15.6) idx = 6;
  else idx = 7;
  // Hide during finale
  const fade = tt < 15.0 ? 1 : tt < 15.6 ? 1 - (tt - 15.0) / 0.6 : 0;
  return (
    <div style={{
      position: 'absolute',
      left: 100, top: 110,
      opacity: fade,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'Poppins, sans-serif',
      fontSize: 13,
      letterSpacing: '0.28em',
      color: 'rgba(255,255,255,0.55)',
    }}>
      <span style={{ color: BRAND.cyan, fontSize: 22, fontWeight: 600 }}>
        {String(idx).padStart(2, '0')}
      </span>
      <span style={{ width: 80, height: 1, background: 'rgba(255,255,255,0.18)', display: 'block' }}>
        <span style={{
          display: 'block',
          height: '100%',
          width: `${(idx / TOTAL) * 100}%`,
          background: BRAND.cyan,
          boxShadow: `0 0 8px ${BRAND.cyan}`,
        }} />
      </span>
      <span>{String(TOTAL).padStart(2, '0')}</span>
    </div>
  );
}

// ── Timestamp label (for review/comments) ──────────────────────────────────
function TimestampLabel() {
  const t = useTime();
  const sec = Math.floor(t);
  React.useEffect(() => {
    const root = document.querySelector('[data-video-root]');
    if (root) root.setAttribute('data-screen-label', `t=${sec}s`);
  }, [sec]);
  return null;
}

// ── Master scene composition ──────────────────────────────────────────────
function HeroVideo() {
  return (
    <React.Fragment>
      <NebulaBackground />
      <AuroraRibbon baseY={420} amp={70} period={14} thickness={135} opacity={0.24} phase={0}   />
      <AuroraRibbon baseY={680} amp={52} period={16} thickness={96} opacity={0.20} phase={3.5} />
      <StellarStream count={72} seed={7} />

      {/* Per-product scenes use long overlaps for a slower product-launch flow. */}
      <Sprite start={0.0}  end={3.45}>
        <ProductScene src={PRODUCTS[0].src} eyebrow={PRODUCTS[0].eyebrow} name={PRODUCTS[0].name} tagline={PRODUCTS[0].tagline} glowColor={PRODUCTS[0].glow} rotateDir={1} />
      </Sprite>
      <Sprite start={2.6}  end={6.05}>
        <ProductScene src={PRODUCTS[1].src} eyebrow={PRODUCTS[1].eyebrow} name={PRODUCTS[1].name} tagline={PRODUCTS[1].tagline} glowColor={PRODUCTS[1].glow} rotateDir={-1} />
      </Sprite>
      <Sprite start={5.2}  end={8.65}>
        <ProductScene src={PRODUCTS[2].src} eyebrow={PRODUCTS[2].eyebrow} name={PRODUCTS[2].name} tagline={PRODUCTS[2].tagline} glowColor={PRODUCTS[2].glow} rotateDir={1} />
      </Sprite>
      <Sprite start={7.8}  end={11.25}>
        <ProductScene src={PRODUCTS[3].src} eyebrow={PRODUCTS[3].eyebrow} name={PRODUCTS[3].name} tagline={PRODUCTS[3].tagline} glowColor={PRODUCTS[3].glow} rotateDir={-1} />
      </Sprite>
      <Sprite start={10.4} end={13.85}>
        <ProductScene src={PRODUCTS[4].src} eyebrow={PRODUCTS[4].eyebrow} name={PRODUCTS[4].name} tagline={PRODUCTS[4].tagline} glowColor={PRODUCTS[4].glow} rotateDir={1} />
      </Sprite>
      <Sprite start={13.0} end={16.45}>
        <ProductScene src={PRODUCTS[5].src} eyebrow={PRODUCTS[5].eyebrow} name={PRODUCTS[5].name} tagline={PRODUCTS[5].tagline} glowColor={PRODUCTS[5].glow} rotateDir={-1} startScale={0.94} endScale={1.02} />
      </Sprite>

      {/* Collection finale */}
      <Sprite start={15.6} end={18.0}>
        <CollectionFinale />
      </Sprite>

      <BottomTicker />
      <TimestampLabel />

      <div style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent 0%, ${BRAND.cyan} 50%, transparent 100%)`,
        opacity: 0.6,
      }} />
    </React.Fragment>
  );
}

Object.assign(window, {
  HeroVideo, STAGE_W, STAGE_H, BRAND, PRODUCTS,
  sceneColor, transitionStrength,
});
