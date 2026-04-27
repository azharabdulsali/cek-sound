"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background dark:from-primary/10 dark:via-background" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 left-[10%] w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/15 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fade-in-up border border-primary/20">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Powered by AI & Machine Learning
        </div>

        {/* Animated sound wave — deterministic heights to avoid hydration mismatch */}
        <div
          className="flex items-end justify-center gap-1 mb-8 h-12 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          {[
            28, 36, 18, 42, 30, 22, 38, 14, 44, 26, 34, 20, 40, 16, 46, 24, 32,
            12, 48, 28, 36, 22, 40, 18,
          ].map((h, i) => (
            <div
              key={i}
              className="sound-wave-bar animate-wave opacity-60"
              style={{
                height: `${h}px`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>

        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance animate-fade-in-up leading-[1.1]"
          style={{ animationDelay: "0.2s" }}
        >
          Deteksi <span className="gradient-text">Deepfake Audio</span> dengan
          CekSound!
        </h1>

        <p
          className="text-lg sm:text-xl text-muted-foreground text-balance mb-10 max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.35s" }}
        >
          Lindungi diri Anda dari manipulasi suara. Verifikasi instan apakah
          audio adalah rekaman asli manusia atau hasil rekayasa AI.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] group"
          >
            <Link href="/register">
              Mulai Gratis
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border text-foreground px-8 py-6 text-base font-semibold rounded-xl hover:bg-accent transition-all duration-300"
          >
            <a href="#how-it-works">Pelajari Cara Kerja</a>
          </Button>
        </div>

        {/* Trust badges */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 mt-14 animate-fade-in-up"
          style={{ animationDelay: "0.65s" }}
        >
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="text-lg">🔒</span> Privasi Terjamin
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="text-lg">⚡</span> Analisis Instan
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="text-lg">🎯</span> Akurasi Tinggi
          </div>
        </div>
      </div>
    </section>
  );
}
