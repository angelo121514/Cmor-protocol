"use client";

import type { SiteContent } from "@/lib/cmor-data";
import {
  ChevronDown,
  HelpCircle,
} from "lucide-react";

interface FAQSectionProps {
  content: SiteContent;
  isDark: boolean;
}

export function FAQSection({ content, isDark }: FAQSectionProps) {
  return (
    <section id="faq" className="w-full scroll-mt-24">
      <div className="flex items-center gap-4 mb-10">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark
              ? "bg-emerald-500/10 border border-emerald-500/20"
              : "bg-emerald-50 border border-emerald-200"
          }`}
        >
          <HelpCircle
            className={`w-6 h-6 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          />
        </div>
        <h2
          className={`text-3xl md:text-4xl font-bold tracking-tight ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {content.faqTitle}
        </h2>
      </div>

      <div className="space-y-3">
        {content.faq.map((item, idx) => (
          <details
            key={idx}
            className={`group rounded-xl border overflow-hidden transition-all duration-300 ${
              isDark
                ? "bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/30"
                : "bg-white border-gray-200 hover:border-emerald-300"
            }`}
          >
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
              <span
                className={`text-base font-semibold leading-snug pr-4 ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {item.q}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-open:rotate-180 ${
                  isDark
                    ? "bg-emerald-500/10"
                    : "bg-emerald-50"
                }`}
              >
                <ChevronDown
                  className={`w-4 h-4 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </div>
            </summary>
            <div className="px-5 pb-5">
              <p
                className={`text-[0.95rem] leading-relaxed ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
