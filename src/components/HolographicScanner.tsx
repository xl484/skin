import { motion } from "motion/react";

interface Hotspot {
  name: string;
  level: string;
  type: string;
  x: number;
  y: number;
}

interface HolographicScannerProps {
  isScanning: boolean;
  showHotspots: boolean;
  hotspots?: Hotspot[];
  progress?: number;
}

// Procedural 3D particle face mesh generator to ensure pristine mathematical density and depth
const faceParticles = (() => {
  const list = [];
  let id = 0;
  // Dense 3D point cloud arrangement to construct realistic facial structure
  for (let x = 70; x <= 250; x += 5.5) {
    for (let y = 60; y <= 310; y += 5.5) {
      // Normalize values relative to center coordinates (160, 185)
      const dx = (x - 160) / 85;
      const dy = (y - 185) / 120;
      
      const r2 = dx * dx + dy * dy;
      // Beautiful oval human face contour with a natural, rounded jawline
      const widthFactor = dy > 0 ? (1 - dy * 0.12) : 1.0;
      const insideFace = (dx * dx) / (widthFactor * widthFactor) + dy * dy <= 0.82;

      if (insideFace) {
        // Depth factor (z-axis hemisphere projection)
        const zValue = Math.sqrt(Math.max(0.04, 1 - r2));
        
        // Dynamic organic micro-vibrations representing bio-activity
        const xOffset = Math.sin(y * 0.2) * 1.0;
        const yOffset = Math.cos(x * 0.2) * 1.0;

        // Distinct facial landmark coordinates to differentiate particle styles
        const dLeftEye = Math.hypot(x - 120, y - 145);
        const dRightEye = Math.hypot(x - 200, y - 145);
        const dMouth = Math.hypot((x - 160) * 1.25, y - 230);
        const dNose = Math.hypot(x - 160, y - 175);

        let baseSize = 0.6;
        let particleType = "general";

        if (dLeftEye < 11 || dRightEye < 11) {
          baseSize = 1.4;
          particleType = "eye";
        } else if (dMouth < 12) {
          baseSize = 1.1;
          particleType = "mouth";
        } else if (dNose < 15) {
          baseSize = 1.3;
          particleType = "nose";
        } else {
          baseSize = 0.5 + zValue * 0.7;
        }

        list.push({
          id: id++,
          x: x + xOffset,
          y: y + yOffset,
          origY: y,
          size: baseSize,
          zValue,
          particleType,
        });
      }
    }
  }
  return list;
})();

export default function HolographicScanner({
  isScanning,
  showHotspots,
  hotspots = [],
  progress = 100,
}: HolographicScannerProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/40 overflow-hidden rounded-lg border border-primary-fixed/15">
      {/* Dynamic CSS animations for 3D light-sweeping particles & laser streams */}
      <style>{`
        @keyframes flowGlow {
          0% {
            stroke-dashoffset: 400;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .glowing-flow-path {
          stroke-dasharray: 60 140;
          animation: flowGlow 5s linear infinite;
        }
        .glowing-flow-path-fast {
          stroke-dasharray: 30 90;
          animation: flowGlow 3s linear infinite;
        }
        .glowing-flow-path-reverse {
          stroke-dasharray: 45 110;
          animation: flowGlow 4s linear infinite reverse;
        }

        /* 3D Particle light scanning pulse wave */
        @keyframes particleSweep {
          0%, 100% {
            fill: rgba(0, 251, 251, 0.15);
            opacity: 0.35;
          }
          12% {
            fill: #00fbfb;
            opacity: 1;
            filter: drop-shadow(0 0 3px rgba(0, 251, 251, 0.95));
          }
          25% {
            fill: #72ff70;
            opacity: 0.9;
            filter: drop-shadow(0 0 2px rgba(114, 255, 112, 0.7));
          }
          40% {
            fill: rgba(0, 251, 251, 0.35);
            opacity: 0.55;
            filter: none;
          }
        }
        .particle-point {
          animation: particleSweep 1.75s infinite linear;
        }
      `}</style>

      {/* Tech HUD Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,251,251,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,251,251,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Cyber Corner Brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary-fixed/40" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary-fixed/40" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary-fixed/40" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary-fixed/40" />

      {/* Side Status Bars / Telemetry */}
      <div className="absolute left-3 top-10 flex flex-col gap-1 text-[8px] font-mono text-primary-fixed/60 select-none hidden sm:flex">
        <span>SYS.STATUS: ACTIVE</span>
        <span>RADAR_FREQ: 5.8GHz</span>
        <span>RESOLUTION: 3D_MATRIX</span>
        <span>DYN_GRID: SCANNING</span>
      </div>

      <div className="absolute right-3 top-10 flex flex-col items-end gap-1 text-[8px] font-mono text-primary-fixed/60 select-none hidden sm:flex">
        <span>FRAME_RECON: OK</span>
        <span>SENSITIVITY: HIGH</span>
        <span>PARTICLES: {faceParticles.length} PTS</span>
        <span>THERMAL_MAP: {showHotspots ? "CALIBRATED" : "SYNCED"}</span>
      </div>

      {/* Holographic Diagnostic Main SVG Stage */}
      <svg
        className="w-80 h-96 relative z-10 select-none pointer-events-none"
        viewBox="0 0 320 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Rotating Target Ring */}
        <motion.circle
          cx="160"
          cy="185"
          r="135"
          stroke="rgba(0, 251, 251, 0.08)"
          strokeWidth="1"
          strokeDasharray="4 8"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx="160"
          cy="185"
          r="145"
          stroke="rgba(0, 251, 251, 0.04)"
          strokeWidth="1.5"
          strokeDasharray="20 40"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Center Targeting Reticle Crosshairs */}
        <line x1="160" y1="35" x2="160" y2="45" stroke="rgba(0, 251, 251, 0.2)" strokeWidth="1" />
        <line x1="160" y1="325" x2="160" y2="335" stroke="rgba(0, 251, 251, 0.2)" strokeWidth="1" />
        <line x1="10" y1="185" x2="20" y2="185" stroke="rgba(0, 251, 251, 0.2)" strokeWidth="1" />
        <line x1="300" y1="185" x2="310" y2="185" stroke="rgba(0, 251, 251, 0.2)" strokeWidth="1" />

        {/* Outer HUD brackets inside SVG */}
        <path d="M 30,185 A 130,130 0 0,1 290,185" stroke="rgba(0,251,251,0.12)" strokeWidth="0.75" />
        <path d="M 30,185 A 130,130 0 0,0 290,185" stroke="rgba(0,251,251,0.12)" strokeWidth="0.75" />

        {/* ==========================================
            3D Particle Face Model & Sweeping Wave
            ========================================== */}
        <g>
          {faceParticles.map((p) => {
            // Negative delay synchronizes the animation to align perfectly with the laser sweeping line.
            const animationDelay = `${((p.origY - 60) / 250) * -1.75}s`;
            
            return (
              <circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={p.size}
                className={isScanning ? "particle-point" : ""}
                style={isScanning ? { animationDelay } : { fill: "rgba(0, 251, 251, 0.35)", opacity: 0.6 }}
              />
            );
          })}
        </g>

        {/* Diagnostic heatmap color overlays and glowing circles when showing HOTSPOTS */}
        {showHotspots && (
          <g>
            {/* T-Zone Sebaceous Gland hyper-activity overlay (Glowing orange-red) */}
            <radialGradient id="tzone-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff5555" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#ffaa44" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffaa44" stopOpacity="0" />
            </radialGradient>
            <ellipse cx="160" cy="115" rx="35" ry="40" fill="url(#tzone-glow)" />

            {/* U-Zone inflammation spots (glowing amber) */}
            <radialGradient id="left-cheek-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff3333" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff3333" stopOpacity="0" />
            </radialGradient>
            <circle cx="120" cy="200" r="28" fill="url(#left-cheek-glow)" />

            <radialGradient id="right-cheek-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff3333" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff3333" stopOpacity="0" />
            </radialGradient>
            <circle cx="200" cy="200" r="28" fill="url(#right-cheek-glow)" />

            {/* Render direct HUD pointer dots on the face wireframe */}
            {hotspots.map((h, i) => {
              const mappedX = (h.x / 100) * 320;
              const mappedY = (h.y / 100) * 380;
              const color = h.type === "oil" ? "#ffaa00" : "#ff3333";

              return (
                <g key={i}>
                  {/* Pulsing indicator core */}
                  <circle cx={mappedX} cy={mappedY} r="4" fill={color} />
                  <motion.circle
                    cx={mappedX}
                    cy={mappedY}
                    r="9"
                    stroke={color}
                    strokeWidth="1.5"
                    animate={{ r: [6, 14, 6], opacity: [0.6, 0.1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                  />
                  {/* Text identifier anchor */}
                  <text
                    x={mappedX > 160 ? mappedX + 12 : mappedX - 12}
                    y={mappedY - 12}
                    textAnchor={mappedX > 160 ? "start" : "end"}
                    fill={color}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="drop-shadow-lg"
                  >
                    {h.type === "oil" ? "T_SEBUM_OVER" : "U_BARRIER_FAIL"}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Telemetry Footer */}
      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center font-mono text-[8px] text-primary-fixed/55 z-20">
        <span>MODE: BIO_METRICS</span>
        <span>SCAN_RECON: {progress}%</span>
        <span>SECURE_LINK: YES</span>
      </div>
    </div>
  );
}
