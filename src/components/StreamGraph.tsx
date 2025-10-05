import { useEffect, useRef, useState } from 'react';

interface StreamGraphProps {
  data: number[];
  label: string;
  color: string;
}

export function StreamGraph({ data, label, color }: StreamGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 600, height: 80 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.min(80, Math.max(60, width * 0.15));
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);

    let offset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();

      const points = Math.min(150, dimensions.width / 4);
      for (let i = 0; i < points; i++) {
        const x = (i / points) * dimensions.width;
        const dataIndex = Math.floor((i + offset) % data.length);
        const value = data[dataIndex];
        const y = dimensions.height / 2 + (value * dimensions.height) / 3;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = color + '15';
      ctx.lineTo(dimensions.width, dimensions.height);
      ctx.lineTo(0, dimensions.height);
      ctx.closePath();
      ctx.fill();

      offset += 0.8;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, color, dimensions]);

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg bg-slate-50/50"
      />
      <div className="absolute top-3 left-4 text-xs sm:text-sm font-bold text-slate-700 bg-white/90 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm">
        {label}
      </div>
    </div>
  );
}
