"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Target } from "lucide-react";
import { useEffect, useRef } from "react";

function FrequencyVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const BAR_COUNT = 48;
    const bars = Array.from({ length: BAR_COUNT }, () => ({
      current: Math.random() * 0.5,
      target: Math.random() * 0.8,
      speed: 0.02 + Math.random() * 0.03,
    }));

    let frame: number;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const gap = 3;
      const barWidth = (w - gap * (BAR_COUNT - 1)) / BAR_COUNT;
      const maxHeight = h * 0.85;

      bars.forEach((bar, i) => {
        if (Math.random() < 0.03) {
          bar.target = 0.1 + Math.random() * 0.9;
        }
        bar.current += (bar.target - bar.current) * bar.speed;

        const barHeight = bar.current * maxHeight;
        const x = i * (barWidth + gap);
        const y = h - barHeight;

        const gradient = ctx.createLinearGradient(x, h, x, y);
        gradient.addColorStop(0, "rgba(0, 180, 230, 0.15)");
        gradient.addColorStop(1, "rgba(0, 212, 255, 0.9)");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      });

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-24 sm:h-32"
      aria-hidden="true"
    />
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto text-center relative z-10 max-w-3xl">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-primary mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-ring" />
          Deepfake Audio Analysis
        </div>

        {/* Frequency Visualizer — the signature element */}
        <div
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <FrequencyVisualizer />
        </div>

        {/* Headline */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 text-balance animate-fade-in-up leading-[1.08] tracking-tight"
          style={{ animationDelay: "0.25s" }}
        >
          Deteksi{" "}
          <span className="text-primary">Deepfake Audio</span>{" "}
          dengan CekSound!
        </h1>

        <p
          className="text-base sm:text-lg text-muted-foreground text-balance mb-10 max-w-xl mx-auto animate-fade-in-up leading-relaxed"
          style={{ animationDelay: "0.4s" }}
        >
          Verifikasi instan apakah audio adalah rekaman asli manusia atau
          hasil manipulasi AI. Berbasis model machine learning.
        </p>

        {/* CTA */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.55s" }}
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 text-sm font-semibold rounded-lg transition-all duration-200 glow-cyan hover:glow-cyan-strong group"
          >
            <Link href="/register">
              Mulai Analisis
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border text-foreground px-8 py-5 text-sm font-semibold rounded-lg hover:bg-accent transition-all duration-200"
          >
            <a href="#how-it-works">Cara Kerja</a>
          </Button>
        </div>

        {/* Trust indicators — icons only, no emojis */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 mt-14 animate-fade-in-up"
          style={{ animationDelay: "0.7s" }}
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium tracking-wide">
            <Shield className="w-3.5 h-3.5 text-primary" />
            Privasi Terjamin
          </div>
          <div className="hidden sm:block w-px h-3 bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium tracking-wide">
            <Zap className="w-3.5 h-3.5 text-primary" />
            Hasil Instan
          </div>
          <div className="hidden sm:block w-px h-3 bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium tracking-wide">
            <Target className="w-3.5 h-3.5 text-primary" />
            Akurasi Tinggi
          </div>
        </div>
      </div>
    </section>
  );
}
