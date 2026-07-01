import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particles array
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      pulse: number;
    }> = [];

    // Initialize particles
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI,
      });
    }

    // Side streams of scrolling hex codes (distributed to prevent overlapping)
    const columnCount = 4;
    const streamSpeed = 1.5;

    const getColumnX = (colIndex: number, currentWidth: number) => {
      if (colIndex === 0) return 25;
      if (colIndex === 1) return 135;
      if (colIndex === 2) return currentWidth - 235;
      return currentWidth - 125;
    };

    const streams: Array<{
      x: number;
      y: number;
      texts: string[];
      size: number;
      colIndex: number;
    }> = [];

    for (let i = 0; i < columnCount; i++) {
      const texts: string[] = [];
      for (let j = 0; j < 25; j++) {
        texts.push(
          Math.random() > 0.5
            ? `0x${Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, "0")}`
            : `SEQ_${Math.floor(Math.random() * 9999).toString().padStart(4, "0")} OK`
        );
      }
      streams.push({
        x: getColumnX(i, width),
        y: -350 - (i * 280), // Staggered start to prevent clumping
        texts,
        size: 10,
        colIndex: i,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      streams.forEach((stream) => {
        stream.x = getColumnX(stream.colIndex, width);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Draw frame
    let time = 0;
    const draw = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw grid background
      ctx.strokeStyle = "rgba(0, 251, 251, 0.025)";
      ctx.lineWidth = 1;
      const gridSize = 45;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Draw side data streams (scrolling biotech metadata)
      ctx.fillStyle = "rgba(0, 251, 251, 0.12)";
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      streams.forEach((stream) => {
        stream.y += streamSpeed;
        if (stream.y > height) {
          stream.y = -stream.texts.length * 16 - 100;
          stream.x = getColumnX(stream.colIndex, width);
        }

        stream.texts.forEach((text, idx) => {
          const textY = stream.y + idx * 16;
          if (textY >= 0 && textY <= height) {
            ctx.fillText(text, stream.x, textY);
          }
        });
      });

      // 3. Update & Draw Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.015;

        // Bounce borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Attracted slightly to mouse
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x += (dx / dist) * 0.35;
          p.y += (dy / dist) * 0.35;
        }

        const sizeOffset = Math.sin(p.pulse) * 0.5;
        const finalSize = Math.max(0.5, p.size + sizeOffset);

        ctx.fillStyle = `rgba(0, 251, 251, ${p.alpha * (0.6 + sizeOffset * 0.4)})`;
        ctx.shadowColor = "#00fbfb";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // 4. Draw glowing vertical scanning laser lines (very subtle)
      const laserY = (Math.sin(time * 0.3) * 0.5 + 0.5) * height;
      const gradient = ctx.createLinearGradient(0, laserY - 10, 0, laserY + 10);
      gradient.addColorStop(0, "rgba(0, 251, 251, 0)");
      gradient.addColorStop(0.5, "rgba(0, 251, 251, 0.05)");
      gradient.addColorStop(1, "rgba(0, 251, 251, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, laserY - 10, width, 20);

      // Draw subtle solid laser center line
      ctx.strokeStyle = "rgba(0, 251, 251, 0.08)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, laserY);
      ctx.lineTo(width, laserY);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none scanlines-overlay bg-background"
    />
  );
}
