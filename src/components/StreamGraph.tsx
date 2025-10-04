import { useEffect, useRef } from 'react';

interface StreamGraphProps {
  data: number[];
  label: string;
  color: string;
}

export function StreamGraph({ data, label, color }: StreamGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let offset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const points = 100;
      for (let i = 0; i < points; i++) {
        const x = (i / points) * width;
        const dataIndex = Math.floor((i + offset) % data.length);
        const value = data[dataIndex];
        const y = height / 2 + (value * height) / 4;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      ctx.fillStyle = color + '20';
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      offset += 0.5;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, color]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={600}
        height={120}
        className="w-full h-full rounded-lg"
      />
      <div className="absolute top-2 left-4 text-xs font-semibold text-slate-700 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}
