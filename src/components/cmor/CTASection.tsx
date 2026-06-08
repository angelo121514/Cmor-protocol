"use client";

import type { SiteContent } from "@/lib/cmor-data";
import { ArrowRight, MessageCircle } from "lucide-react";

interface CTASectionProps {
  content: SiteContent;
  isDark: boolean;
}

export function CTASection({ content, isDark }: CTASectionProps) {
  const cta = content.ctaSection;
  return (
    <section
      className={`w-full rounded-2xl border p-8 md:p-12 lg:p-16 text-center relative overflow-hidden ${
        isDark
          ? "bg-emerald-500/[0.04] border-emerald-500/20"
          : "bg-emerald-50 border-emerald-200"
      }`}
    >
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-teal-600/5 pointer-events-none" />

      <div className="relative z-10">
        <h2
          className={`text-2xl md:text-4xl font-bold tracking-tight mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {cta.title}
        </h2>
        <p
          className={`text-base md:text-lg mb-8 max-w-lg mx-auto ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {cta.subtitle}
        </p>
        <a
          href="https://wa.me/56956249647?text=Hola,%20me%20interesa%20implementar%20agentes%20de%20IA%20en%20mi%20empresa"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:shadow-xl active:scale-[0.98] ${
            isDark
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
              : "bg-gray-900 hover:bg-gray-800 text-white shadow-gray-900/20"
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          {cta.btn}
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
