'use client';

import { useEffect, useRef } from 'react';

interface MossBlob {
  dx: number;
  dy: number;
  r: number;
  cr: number;
  cg: number;
  cb: number;
  a: number;
}

interface Crack {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Spot {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  len: number;
  opacity: number;
  wind: number;
}

interface Stone {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  g: number;
  b: number;
  z: number;
  moss: MossBlob[];
  cracks: Crack[];
  spots: Spot[];
}

export default function InteractiveBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stonesRef = useRef<Stone[]>([]);
  const rainRef = useRef<RainDrop[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef(0);
  const stormRef = useRef({
    state: 'normal' as 'normal' | 'storm',
    timer: 15,
    lightningTimer: 1.5 + Math.random() * 2,
    rainIntensity: 0,
    lightning: { active: false, intensity: 0, flickerTimer: 0, pattern: 0 as 0 | 1 | 2 },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SW = 110;
    const SH = 52;
    const GAP = 5;
    const FL_RADIUS = 340;

    const getTheme = () => (document.documentElement.getAttribute('data-theme') || 'dark');

    const themeConfig = (theme: string) => {
      if (theme === 'sore') return { bg: '#080808', ambient: 0.08, stones: true, storm: true, flashlight: true, tint: 1.1, warm: '255,185,120' };
      return { bg: '#08080a', ambient: 0.04, stones: true, storm: true, flashlight: true, tint: 1.0, warm: '255,210,170' };
    };

    const palettes = [
      { r: 40, g: 43, b: 50 },
      { r: 50, g: 46, b: 42 },
      { r: 44, g: 48, b: 54 },
      { r: 53, g: 46, b: 38 },
      { r: 34, g: 38, b: 42 },
      { r: 42, g: 46, b: 38 },
      { r: 48, g: 43, b: 48 },
      { r: 38, g: 40, b: 36 },
    ];

    const mossColors = [
      { r: 48, g: 65, b: 38 },
      { r: 55, g: 72, b: 42 },
      { r: 42, g: 55, b: 35 },
      { r: 62, g: 70, b: 45 },
      { r: 50, g: 60, b: 40 },
      { r: 58, g: 68, b: 50 },
    ];

    const initRain = (w: number, h: number) => {
      const drops: RainDrop[] = [];
      for (let i = 0; i < 350; i++) {
        drops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          speed: 4 + Math.random() * 5,
          len: 2 + Math.random() * 3,
          opacity: 0.15 + Math.random() * 0.2,
          wind: 0.4 + Math.random() * 0.4,
        });
      }
      rainRef.current = drops;
    };

    const init = () => {
      const stones: Stone[] = [];
      const w = canvas.width;
      const h = canvas.height;
      const cols = Math.ceil(w / (SW + GAP)) + 4;
      const rows = Math.ceil(h / (SH + GAP)) + 4;
      for (let r = 0; r < rows; r++) {
        const offsetX = r % 2 === 0 ? 0 : (SW + GAP) / 2;
        for (let c = 0; c < cols; c++) {
          const pal = palettes[Math.floor(Math.random() * palettes.length)];
          const v = 0.85 + Math.random() * 0.3;

          const moss: MossBlob[] = [];
          if (Math.random() > 0.35) {
            const numClusters = 1 + Math.floor(Math.random() * 2);
            for (let cl = 0; cl < numClusters; cl++) {
              const ccx = Math.random() * (SW - GAP - 28) + 10;
              const ccy = Math.random() * (SH - GAP - 24) + 10;
              const numBlobs = 4 + Math.floor(Math.random() * 5);
              for (let b = 0; b < numBlobs; b++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * 12;
                const mc = mossColors[Math.floor(Math.random() * mossColors.length)];
                moss.push({
                  dx: ccx + Math.cos(angle) * dist,
                  dy: ccy + Math.sin(angle) * dist,
                  r: 1.5 + Math.random() * 4,
                  cr: mc.r + Math.floor((Math.random() - 0.5) * 10),
                  cg: mc.g + Math.floor((Math.random() - 0.5) * 10),
                  cb: mc.b + Math.floor((Math.random() - 0.5) * 6),
                  a: 0.3 + Math.random() * 0.45,
                });
              }
            }
            const numScatter = Math.floor(Math.random() * 6);
            for (let i = 0; i < numScatter; i++) {
              const mc = mossColors[Math.floor(Math.random() * mossColors.length)];
              moss.push({
                dx: Math.random() * (SW - GAP - 16) + 6,
                dy: Math.random() * (SH - GAP - 14) + 5,
                r: 1 + Math.random() * 2.5,
                cr: mc.r + Math.floor((Math.random() - 0.5) * 14),
                cg: mc.g + Math.floor((Math.random() - 0.5) * 12),
                cb: mc.b + Math.floor((Math.random() - 0.5) * 8),
                a: 0.15 + Math.random() * 0.3,
              });
            }
          }

          const cracks: Crack[] = [];
          if (Math.random() > 0.55) {
            const sx = Math.random() * (SW - GAP - 12) + 4;
            const sy = Math.random() * (SH - GAP - 12) + 4;
            cracks.push({
              x1: sx,
              y1: sy,
              x2: sx + (Math.random() - 0.5) * 32,
              y2: sy + (Math.random() - 0.5) * 22,
            });
            if (Math.random() > 0.6) {
              cracks.push({
                x1: cracks[0].x2,
                y1: cracks[0].y2,
                x2: cracks[0].x2 + (Math.random() - 0.5) * 18,
                y2: cracks[0].y2 + (Math.random() - 0.5) * 14,
              });
            }
          }

          const spots: Spot[] = [];
          const numSpots = Math.floor(Math.random() * 5);
          for (let i = 0; i < numSpots; i++) {
            spots.push({
              dx: Math.random() * (SW - GAP - 14) + 4,
              dy: Math.random() * (SH - GAP - 10) + 4,
              dw: 2 + Math.random() * 12,
              dh: 1 + Math.random() * 7,
            });
          }

          stones.push({
            x: c * (SW + GAP) + offsetX - SW * 2,
            y: r * (SH + GAP) - SH * 2,
            w: SW - GAP,
            h: SH - GAP,
            r: Math.floor(pal.r * v),
            g: Math.floor(pal.g * v),
            b: Math.floor(pal.b * v),
            z: Math.random() * 100,
            moss,
            cracks,
            spots,
          });
        }
      }
      stonesRef.current = stones;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
      initRain(canvas.width, canvas.height);
    };

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / canvas.width,
        y: e.clientY / canvas.height,
      };
    };

    const drawStone = (stone: Stone, mpx: number, mpy: number, cfg: ReturnType<typeof themeConfig>) => {
      const { x, y, w, h, r, g, b, moss, cracks, spots } = stone;
      const cx = x + w / 2;
      const cy = y + h / 2;
      const dist = Math.sqrt((cx - mpx) ** 2 + (cy - mpy) ** 2);
      const fl = cfg.flashlight ? Math.max(0, 1 - dist / FL_RADIUS) : 1;
      const intensity = cfg.ambient + fl * (1 - cfg.ambient);
      const tint = cfg.tint || 1;

      const aR = Math.floor(r * cfg.ambient);
      const aG = Math.floor(g * cfg.ambient);
      const aB = Math.floor(b * cfg.ambient);

      const warm = fl * 0.12;
      const lR = Math.min(255, Math.floor(r * (0.75 + warm) * tint));
      const lG = Math.min(255, Math.floor(g * (0.7 + warm) / tint));
      const lB = Math.min(255, Math.floor(b * (0.65 + warm) / tint));

      const pR = Math.floor(aR + (lR - aR) * intensity);
      const pG = Math.floor(aG + (lG - aG) * intensity);
      const pB = Math.floor(aB + (lB - aB) * intensity);

      const bev = 2;
      ctx.fillStyle = `rgb(${Math.min(255, pR + 14)},${Math.min(255, pG + 11)},${Math.min(255, pB + 9)})`;
      ctx.fillRect(x, y, w, bev);
      ctx.fillRect(x, y + bev, bev, h - bev);

      ctx.fillStyle = `rgb(${Math.max(0, pR - 12)},${Math.max(0, pG - 9)},${Math.max(0, pB - 7)})`;
      ctx.fillRect(x, y + h - bev, w, bev);
      ctx.fillRect(x + w - bev, y + bev, bev, h - bev * 2);

      ctx.fillStyle = `rgb(${pR},${pG},${pB})`;
      ctx.fillRect(x + bev, y + bev, w - bev * 2, h - bev * 2);

      for (const spot of spots) {
        ctx.fillStyle = `rgba(0,0,0,${0.025 + fl * 0.025})`;
        ctx.fillRect(x + bev + spot.dx, y + bev + spot.dy, spot.dw, spot.dh);
        ctx.fillStyle = `rgba(255,255,255,${0.01 + fl * 0.01})`;
        ctx.fillRect(x + bev + spot.dx + 1, y + bev + spot.dy + 1, spot.dw * 0.4, spot.dh * 0.4);
      }

      for (const blob of moss) {
        const ma = blob.a * (0.2 + fl * 0.8);
        ctx.beginPath();
        ctx.arc(x + blob.dx, y + blob.dy, blob.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${blob.cr},${blob.cg},${blob.cb},${ma})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + blob.dx + 1, y + blob.dy, blob.r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.min(255, blob.cr + 8)},${Math.min(255, blob.cg + 6)},${Math.min(255, blob.cb + 4)},${ma * 0.4})`;
        ctx.fill();
      }

      for (const crack of cracks) {
        ctx.strokeStyle = `rgba(0,0,0,${0.35 + fl * 0.45})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x + crack.x1, y + crack.y1);
        ctx.lineTo(x + crack.x2, y + crack.y2);
        ctx.stroke();
      }

      const glow = Math.max(0, 1 - dist / 200);
      if (glow > 0) {
        ctx.save();
        ctx.shadowColor = `rgba(255,210,170,${glow * 0.2})`;
        ctx.shadowBlur = glow * 20;
        ctx.fillStyle = `rgba(255,210,170,${0.01 + glow * 0.03})`;
        ctx.fillRect(x + bev, y + bev, w - bev * 2, h - bev * 2);
        ctx.restore();
      }
    };

    const draw = () => {
      frameRef.current = requestAnimationFrame(draw);
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      const theme = getTheme();
      const cfg = themeConfig(theme);
      const dt = 16.67;
      const storm = stormRef.current;

      if (cfg.storm) {
        storm.timer += dt / 1000;
        if (storm.state === 'normal') {
          if (storm.timer >= 15) {
            storm.state = 'storm';
            storm.timer = 0;
            storm.lightningTimer = 0;
          }
          storm.rainIntensity = Math.max(0, storm.rainIntensity - 0.003);
        } else {
          storm.rainIntensity = Math.min(1, storm.rainIntensity + 0.003);
          storm.lightningTimer += dt / 1000;
          if (storm.lightningTimer >= 1.5 + Math.random() * 2.5) {
            storm.lightning.active = true;
            storm.lightning.pattern = (Math.floor(Math.random() * 3)) as 0 | 1 | 2;
            const base = [0.15, 0.3, 0.5];
            storm.lightning.intensity = base[storm.lightning.pattern] + Math.random() * 0.15;
            storm.lightning.flickerTimer = 0;
            storm.lightningTimer = 0;
          }
          if (storm.timer >= 30) {
            storm.state = 'normal';
            storm.timer = 0;
          }
        }
      } else {
        storm.rainIntensity = 0;
        storm.lightning.active = false;
        storm.lightning.intensity = 0;
        storm.state = 'normal';
        storm.timer = 0;
      }

      if (storm.lightning.active) {
        storm.lightning.flickerTimer += dt / 1000;
        const p = storm.lightning.pattern;
        if (p === 0) {
          if (storm.lightning.flickerTimer < 0.05) {
          } else if (storm.lightning.flickerTimer < 0.09) {
            storm.lightning.intensity *= 0.3;
          } else if (storm.lightning.flickerTimer < 0.15) {
            storm.lightning.intensity *= 2.5;
          } else {
            storm.lightning.intensity *= 0.85;
          }
          if (storm.lightning.flickerTimer > 0.4) { storm.lightning.active = false; storm.lightning.intensity = 0; }
        } else if (p === 1) {
          if (storm.lightning.flickerTimer < 0.04) {
          } else if (storm.lightning.flickerTimer < 0.08) {
            storm.lightning.intensity *= 0.3;
          } else if (storm.lightning.flickerTimer < 0.12) {
            storm.lightning.intensity *= 2;
          } else if (storm.lightning.flickerTimer < 0.16) {
            storm.lightning.intensity *= 0.2;
          } else if (storm.lightning.flickerTimer < 0.2) {
            storm.lightning.intensity *= 3;
          } else if (storm.lightning.flickerTimer < 0.26) {
            storm.lightning.intensity *= 0.15;
          } else {
            storm.lightning.intensity *= 0.82;
          }
          if (storm.lightning.flickerTimer > 0.55) { storm.lightning.active = false; storm.lightning.intensity = 0; }
        } else {
          if (storm.lightning.flickerTimer < 0.06) {
          } else if (storm.lightning.flickerTimer < 0.1) {
            storm.lightning.intensity *= 0.2;
          } else if (storm.lightning.flickerTimer < 0.14) {
            storm.lightning.intensity *= 3.5;
          } else if (storm.lightning.flickerTimer < 0.18) {
            storm.lightning.intensity *= 0.3;
          } else if (storm.lightning.flickerTimer < 0.22) {
            storm.lightning.intensity *= 2;
          } else if (storm.lightning.flickerTimer < 0.26) {
            storm.lightning.intensity *= 0.1;
          } else {
            storm.lightning.intensity *= 0.8;
          }
          if (storm.lightning.flickerTimer > 0.65) { storm.lightning.active = false; storm.lightning.intensity = 0; }
        }
      }

      if (storm.rainIntensity > 0.01) {
        for (const drop of rainRef.current) {
          drop.y += drop.speed;
          drop.x -= drop.wind;
          if (drop.y > h + 20) { drop.y = -20; drop.x = Math.random() * w; }
          if (drop.x < -20) { drop.x = w + 20; }
        }
      }

      const mpx = mouseRef.current.x * w;
      const mpy = mouseRef.current.y * h;

      ctx.fillStyle = cfg.bg;
      ctx.fillRect(0, 0, w, h);

      const sorted = [...stonesRef.current].sort((a, b) => a.z - b.z);
      for (const stone of sorted) {
        if (stone.x + stone.w < -50 || stone.x > w + 50 || stone.y + stone.h < -50 || stone.y > h + 50) continue;
        drawStone(stone, mpx, mpy, cfg);
      }

      if (cfg.flashlight && mpx > 0 && mpy > 0) {
        const grad = ctx.createRadialGradient(mpx, mpy, 0, mpx, mpy, FL_RADIUS);
        grad.addColorStop(0, `rgba(${cfg.warm},0.045)`);
        grad.addColorStop(0.4, `rgba(${cfg.warm},0.018)`);
        grad.addColorStop(1, `rgba(${cfg.warm},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      if (theme === 'sore') {
        const sunset = ctx.createRadialGradient(w * 0.5, h * 0.05, 0, w * 0.5, h * 0.05, w * 0.6);
        sunset.addColorStop(0, 'rgba(255,180,90,0.18)');
        sunset.addColorStop(0.4, 'rgba(220,120,80,0.08)');
        sunset.addColorStop(1, 'rgba(200,100,100,0)');
        ctx.fillStyle = sunset;
        ctx.fillRect(0, 0, w, h);
      }

      if (storm.rainIntensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, storm.rainIntensity * 2);
        for (const drop of rainRef.current) {
          ctx.fillStyle = `rgba(180,195,215,${drop.opacity})`;
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.len * 0.5, 0, Math.PI * 2);
          ctx.fill();
          if (drop.len > 2) {
            ctx.fillStyle = `rgba(200,215,235,${drop.opacity * 0.4})`;
            ctx.beginPath();
            ctx.arc(drop.x - 0.5, drop.y - drop.len * 0.3, drop.len * 0.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      if (storm.lightning.active && storm.lightning.intensity > 0.01) {
        ctx.fillStyle = `rgba(200,215,240,${storm.lightning.intensity * 0.2})`;
        ctx.fillRect(0, 0, w, h);
      }
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
