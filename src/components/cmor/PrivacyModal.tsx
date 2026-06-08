"use client";

import type { SiteContent } from "@/lib/cmor-data";
import { X } from "lucide-react";

interface PrivacyModalProps {
  content: SiteContent;
  isDark: boolean;
  onClose: () => void;
}

export function PrivacyModal({ content, isDark, onClose }: PrivacyModalProps) {
  const privacy = content;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 backdrop-blur-sm"
      style={{ backgroundColor: isDark ? "rgba(0,0,0,0.88)" : "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className={`max-w-3xl w-full rounded-2xl p-6 md:p-10 overflow-y-auto max-h-[90vh] shadow-2xl relative border ${
          isDark
            ? "bg-[#141414] border-white/10"
            : "bg-white border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={`absolute top-6 right-6 p-2 rounded-lg transition-colors ${
            isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"
          }`}
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h1
          className={`text-2xl md:text-4xl font-bold mb-3 tracking-tight pr-8 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {privacy.privacyTitle}
        </h1>
        <p
          className={`text-sm font-semibold mb-8 ${
            isDark ? "text-emerald-400" : "text-emerald-600"
          }`}
        >
          {privacy.privacyUpdate}
        </p>

        <div className="space-y-8">
          <p
            className={`text-base leading-relaxed font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {privacy.privacyIntro}
          </p>

          {privacy.privacySections.map((section, sIdx) => (
            <div key={sIdx}>
              <h2
                className={`text-lg font-bold mb-3 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {section.t}
              </h2>
              <ul className="space-y-2">
                {section.c.map((item, iIdx) => (
                  <li
                    key={iIdx}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      isDark
                        ? "bg-white/[0.02] border-white/[0.06]"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                        isDark ? "bg-emerald-400" : "bg-emerald-600"
                      }`}
                    />
                    <span
                      className={`text-sm leading-snug ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <footer
          className={`mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
            isDark ? "border-white/10" : "border-gray-200"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {privacy.privacyFooter}
          </p>
          <p
            className={`text-xs ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {privacy.privacyContact}
          </p>
        </footer>
      </div>
    </div>
  );
}
