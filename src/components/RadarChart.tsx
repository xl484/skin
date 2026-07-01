import { useMemo } from "react";
import { SkinMetrics } from "../types";

interface RadarChartProps {
  metrics: SkinMetrics;
}

export default function RadarChart({ metrics }: RadarChartProps) {
  // Compute points on a 100x100 coord system centered at (50, 50).
  // Axis angles (in radians):
  // 0: Acne (top, -PI/2)
  // 1: Oil (top-right, -PI/2 + 2*PI/5)
  // 2: Hydration (bottom-right, -PI/2 + 4*PI/5)
  // 3: Wrinkles (bottom-left, -PI/2 + 6*PI/5)
  // 4: Sensitivity (top-left, -PI/2 + 8*PI/5)

  const radius = 38; // Max radius length
  const center = 50;

  const points = useMemo(() => {
    const keys: Array<keyof SkinMetrics> = ["acne", "oil", "hydration", "wrinkle", "sensitivity"];
    return keys.map((key, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const value = metrics[key] / 100; // normalized (0 - 1)
      const r = value * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        labelX: center + (radius + 12) * Math.cos(angle),
        labelY: center + (radius + 12) * Math.sin(angle),
        angle,
      };
    });
  }, [metrics]);

  const backgroundWebs = useMemo(() => {
    const levels = [0.25, 0.5, 0.75, 1.0];
    return levels.map((lvl) => {
      const r = lvl * radius;
      return Array.from({ length: 5 }).map((_, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
      }).join(" ");
    });
  }, []);

  const polygonPointsStr = useMemo(() => {
    return points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  }, [points]);

  return (
    <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(0,251,251,0.25)]"
      >
        {/* Radar Web Rings */}
        {backgroundWebs.map((ptsStr, idx) => (
          <polygon
            key={idx}
            points={ptsStr}
            fill="none"
            stroke="rgba(0,251,251,0.15)"
            strokeWidth="0.4"
          />
        ))}

        {/* Axis Lines */}
        {points.map((p, idx) => {
          const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / 5;
          const outerX = center + radius * Math.cos(angle);
          const outerY = center + radius * Math.sin(angle);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={outerX}
              y2={outerY}
              stroke="rgba(0,251,251,0.25)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Data Area Polygon */}
        <polygon
          points={polygonPointsStr}
          fill="rgba(0, 251, 251, 0.15)"
          stroke="#00fbfb"
          strokeWidth="1.2"
          className="transition-all duration-1000 ease-out"
        />

        {/* Glowing Data Dots */}
        {points.map((p, idx) => {
          // Highlight warnings for high oil/sensitivity
          let color = "#00fbfb";
          if (idx === 1 && metrics.oil > 80) color = "#ffb59c"; // Oil warning
          if (idx === 4 && metrics.sensitivity > 70) color = "#ffb4ab"; // Sensitivity warning

          return (
            <g key={idx} className="transition-all duration-1000 ease-out">
              <circle
                cx={p.x}
                cy={p.y}
                r="1.8"
                fill={color}
                className={idx === 1 || idx === 4 ? "animate-pulse" : ""}
              />
            </g>
          );
        })}
      </svg>

      {/* Absolute Positioned HTML Labels for better crisp rendering over SVG text */}
      {points.map((p, idx) => {
        let label = "痤疮";
        let score = metrics.acne;
        let styleClass = "text-on-surface-variant opacity-75";

        if (idx === 1) {
          label = "油脂";
          score = metrics.oil;
          styleClass = "text-tertiary-fixed-dim font-bold";
        } else if (idx === 2) {
          label = "水分";
          score = metrics.hydration;
          styleClass = "text-primary-fixed font-bold";
        } else if (idx === 3) {
          label = "皱纹";
          score = metrics.wrinkle;
        } else if (idx === 4) {
          label = "敏感度";
          score = metrics.sensitivity;
          styleClass = "text-error font-bold";
        }

        // Convert centered percentage coords (-50 to 50) to viewport style offsets
        const leftOffset = p.labelX; // 0 - 100
        const topOffset = p.labelY;  // 0 - 100

        return (
          <div
            key={idx}
            className={`absolute -translate-x-1/2 -translate-y-1/2 text-center select-none whitespace-nowrap ${styleClass}`}
            style={{
              left: `${leftOffset}%`,
              top: `${topOffset}%`,
            }}
          >
            <div className="font-sans text-[11px] tracking-wide uppercase">{label}</div>
            <div className="font-mono text-[10px] opacity-90 mt-0.5">{score}%</div>
          </div>
        );
      })}
    </div>
  );
}
