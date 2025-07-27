import React, { useRef, useEffect } from "react";

const Particle = class {
  constructor(x, y, size, speedX, speedY, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
  }

  update(canvasWidth, canvasHeight) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvasWidth || this.x < 0) this.speedX = -this.speedX;
    if (this.y > canvasHeight || this.y < 0) this.speedY = -this.speedY;
  }

  draw(ctx) {
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 4
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
};

const DivineComplexLoader = () => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpi = window.devicePixelRatio || 1;

    let width = canvas.clientWidth * dpi;
    let height = canvas.clientHeight * dpi;

    canvas.width = width;
    canvas.height = height;
    ctx.scale(dpi, dpi);

    // ایجاد ذرات با خصوصیات تصادفی
    particles.current = Array.from({ length: 60 }, () => {
      const size = Math.random() * 4 + 1;
      const x = Math.random() * width / dpi;
      const y = Math.random() * height / dpi;
      const speedX = (Math.random() - 0.5) * 0.6;
      const speedY = (Math.random() - 0.5) * 0.6;
      const colors = ["#a78bfa", "#8b5cf6", "#c084fc", "#7c3aed"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return new Particle(x, y, size, speedX, speedY, color);
    });

    function animate() {
      ctx.clearRect(0, 0, width / dpi, height / dpi);

      // پس‌زمینه نیمه شفاف سیاه برای رد حرکت
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(0, 0, width / dpi, height / dpi);

      // رسم و بروزرسانی ذرات
      particles.current.forEach((p) => {
        p.update(width / dpi, height / dpi);
        p.draw(ctx);
      });

      // رسم خطوط اتصال ذرات نزدیک به هم
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p1 = particles.current[i];
          const p2 = particles.current[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(139,92,246,${1 - dist / 120})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black rounded-3xl p-8 select-none relative overflow-hidden w-full h-96">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-3xl"
        style={{ display: "block" }}
      />
      <span className="absolute bottom-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 text-2xl font-extrabold tracking-wide select-none animate-pulse">
        در حال ایجاد معجزه...
      </span>
    </div>
  );
};

export default DivineComplexLoader;
