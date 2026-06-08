"use client";

import { useState, useEffect, useCallback } from "react";
import { TRANSLATIONS } from "@/lib/cmor-data";
import type { ServiceCategory, SiteContent } from "@/lib/cmor-data";
import SynapseCanvas from "@/components/cmor/SynapseCanvas";
import AntigravityCanvas from "@/components/cmor/AntigravityCanvas";
import { ServiceGrid, DetailModal } from "@/components/cmor/ServiceGrid";
import { FAQSection } from "@/components/cmor/FAQSection";
import { PrivacyModal } from "@/components/cmor/PrivacyModal";
import { CTASection } from "@/components/cmor/CTASection";
import {
  Sun,
  Moon,
  Languages,
  ArrowRight,
  MessageCircle,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Network,
} from "lucide-react";

type Lang = "es" | "en";
type ParticleMode = "synapse" | "antigravity";

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<Lang>("es");
  const [selectedDetail, setSelectedDetail] = useState<
    ServiceCategory["details"][0] | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [particleMode, setParticleMode] = useState<ParticleMode>("synapse");

  const content: SiteContent = TRANSLATIONS[lang];

  // Sync dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Scroll detection for nav
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Update html lang
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleOpenDetail = useCallback(
    (detail: ServiceCategory["details"][0], category: ServiceCategory) => {
      setSelectedDetail(detail);
      setSelectedCategory(category);
    },
    []
  );

  const handleCloseDetail = useCallback(() => {
    setSelectedDetail(null);
    setSelectedCategory(null);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  }, []);

  return (
    <div
      className={`relative min-h-screen flex flex-col transition-colors duration-500 ${
        isDark ? "bg-[#0a0a0b] text-white" : "bg-[#fafafa] text-gray-900"
      }`}
    >
      {particleMode === "synapse" ? (
        <SynapseCanvas isDark={isDark} />
      ) : (
        <AntigravityCanvas isDark={isDark} />
      )}

      {/* --- NAV --- */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDark
              ? "bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5"
              : "bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/logo-full.png"
              alt="CMOR Protocol"
              className={`h-16 md:h-20 w-auto ${
                isDark ? "brightness-0 invert" : ""
              }`}
            />
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo("servicios")}
              className={`text-sm font-medium transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {content.nav.services}
            </button>
            <button
              onClick={() => scrollTo("proceso")}
              className={`text-sm font-medium transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {content.nav.process}
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className={`text-sm font-medium transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {content.nav.faq}
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />

            {/* Particle Mode Toggle */}
            <button
              onClick={() => setParticleMode(particleMode === "synapse" ? "antigravity" : "synapse")}
              className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 ${
                particleMode === "antigravity"
                  ? isDark
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : isDark
                    ? "text-gray-400 hover:text-white hover:bg-white/5"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-label="Toggle particle mode"
              title={particleMode === "synapse" ? (lang === "es" ? "Enjambre" : "Swarm") : (lang === "es" ? "Sinapsis" : "Synapse")}
            >
              {particleMode === "synapse" ? (
                <Network className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {particleMode === "synapse"
                ? (lang === "es" ? "Sinapsis" : "Synapse")
                : (lang === "es" ? "Enjambre" : "Swarm")
              }
            </button>

            {/* Language */}
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-label="Toggle language"
            >
              <Languages className="w-4 h-4" />
              {lang.toUpperCase()}
            </button>

            {/* Theme */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            {/* Particle toggle - mobile */}
            <button
              onClick={() => setParticleMode(particleMode === "synapse" ? "antigravity" : "synapse")}
              className={`p-1.5 rounded transition-colors ${
                particleMode === "antigravity"
                  ? isDark ? "text-emerald-400" : "text-emerald-600"
                  : isDark ? "text-gray-400" : "text-gray-600"
              }`}
              aria-label="Toggle particles"
              title={particleMode === "synapse" ? (lang === "es" ? "Enjambre" : "Swarm") : (lang === "es" ? "Sinapsis" : "Synapse")}
            >
              {particleMode === "synapse" ? (
                <Network className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className={`text-xs font-bold px-2 py-1 rounded ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {lang.toUpperCase()}
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-1.5 rounded ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 rounded ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-t px-6 py-4 space-y-3 ${
              isDark
                ? "bg-[#0a0a0b]/95 backdrop-blur-xl border-white/5"
                : "bg-white/95 backdrop-blur-xl border-gray-200/50"
            }`}
          >
            <button
              onClick={() => scrollTo("servicios")}
              className={`block w-full text-left text-sm font-medium py-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {content.nav.services}
            </button>
            <button
              onClick={() => scrollTo("proceso")}
              className={`block w-full text-left text-sm font-medium py-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {content.nav.process}
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className={`block w-full text-left text-sm font-medium py-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {content.nav.faq}
            </button>
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 flex-1">
        {/* HERO */}
        <header className="min-h-[90vh] flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border ${
              isDark
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {lang === "es"
              ? "Agentes de IA que trabajan por ti"
              : "AI Agents that work for you"}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6">
            {content.heroHeadline}{" "}
            <span
              className={`${
                isDark
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"
              }`}
            >
              {content.heroHighlight}
            </span>
          </h1>

          <p
            className={`text-lg md:text-xl max-w-2xl leading-relaxed mb-10 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {content.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
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
              {content.heroCta}
              <ArrowRight className="w-5 h-5" />
            </a>
            <button
              onClick={() => scrollTo("servicios")}
              className={`inline-flex items-center gap-2 px-6 py-4 rounded-xl font-semibold text-base transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {content.heroSecondary}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <div
              className={`w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2 ${
                isDark ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <div
                className={`w-1 h-2.5 rounded-full ${
                  isDark ? "bg-gray-600" : "bg-gray-400"
                }`}
              />
            </div>
          </div>
        </header>

        {/* SERVICES */}
        <section id="servicios" className="scroll-mt-24 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-14">
            <h2
              className={`text-3xl md:text-5xl font-bold tracking-tight mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {content.sectionServicesTitle}
            </h2>
            <p
              className={`text-base md:text-lg leading-relaxed ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {content.sectionServicesSub}
            </p>
          </div>

          <ServiceGrid
            services={content.services}
            isDark={isDark}
            onOpenDetail={handleOpenDetail}
          />
        </section>

        {/* PROCESS */}
        <section id="proceso" className="scroll-mt-24 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-14">
            <h2
              className={`text-3xl md:text-5xl font-bold tracking-tight mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {content.sectionProcessTitle}
            </h2>
            <p
              className={`text-base md:text-lg leading-relaxed ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {content.sectionProcessSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.processSteps.map((step) => (
              <div
                key={step.num}
                className={`relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? "bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/30"
                    : "bg-white border-gray-200 hover:border-emerald-300"
                }`}
              >
                <div
                  className={`text-4xl font-black mb-4 ${
                    isDark
                      ? "text-emerald-500/30"
                      : "text-emerald-200"
                  }`}
                >
                  {step.num}
                </div>
                <h3
                  className={`text-lg font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <CTASection content={content} isDark={isDark} />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <FAQSection content={content} isDark={isDark} />
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer
        className={`relative z-10 border-t mt-auto ${
          isDark ? "border-white/5" : "border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <img
              src="/logo-full.png"
              alt="CMOR Protocol"
              className={`h-24 w-auto mb-3 ${
                isDark ? "brightness-0 invert" : ""
              }`}
            />
            <p
              className={`text-sm ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {content.footerTagline}
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => setShowPrivacy(true)}
              className={`font-medium transition-colors ${
                isDark
                  ? "text-gray-500 hover:text-white"
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              {lang === "es" ? "Política de Privacidad" : "Privacy Policy"}
            </button>
            <span className={isDark ? "text-gray-700" : "text-gray-300"}>|</span>
            <span className={isDark ? "text-gray-500" : "text-gray-400"}>
              &copy; 2026 CMOR Protocol
            </span>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <DetailModal
        detail={selectedDetail}
        category={selectedCategory}
        isDark={isDark}
        lang={lang}
        onClose={handleCloseDetail}
      />

      {showPrivacy && (
        <PrivacyModal
          content={content}
          isDark={isDark}
          onClose={() => setShowPrivacy(false)}
        />
      )}
    </div>
  );
}
