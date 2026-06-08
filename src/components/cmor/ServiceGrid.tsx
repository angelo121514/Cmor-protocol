"use client";

import { useState } from "react";
import { DynamicIcon } from "./DynamicIcon";
import type { ServiceCategory } from "@/lib/cmor-data";
import {
  ChevronRight,
  ArrowRight,
  Users,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";

interface ServiceGridProps {
  services: ServiceCategory[];
  isDark: boolean;
  onOpenDetail: (detail: ServiceCategory["details"][0], category: ServiceCategory) => void;
}

export function ServiceGrid({ services, isDark, onOpenDetail }: ServiceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          isDark={isDark}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}

function ServiceCard({
  service,
  isDark,
  onOpenDetail,
}: {
  service: ServiceCategory;
  isDark: boolean;
  onOpenDetail: (detail: ServiceCategory["details"][0], category: ServiceCategory) => void;
}) {
  return (
    <div
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-default ${
        isDark
          ? "bg-white/[0.03] border-white/10 hover:border-emerald-500/30 hover:shadow-emerald-900/20"
          : "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-emerald-100/60"
      }`}
    >
      {/* Service Image */}
      <div className="relative w-full h-44 overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay on image */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isDark
              ? "from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent"
              : "from-white via-white/60 to-transparent"
          }`}
        />
        {/* Icon badge on image */}
        <div
          className={`absolute bottom-3 left-4 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 ${
            isDark
              ? "bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm"
              : "bg-white/90 border border-emerald-200 shadow-sm backdrop-blur-sm"
          }`}
        >
          <DynamicIcon
            name={service.icon}
            className={`w-5 h-5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6">
        {/* Title */}
        <h3
          className={`text-lg font-bold mb-2 tracking-tight leading-snug ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          className={`text-sm leading-relaxed mb-5 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {service.desc}
        </p>

        {/* Sub-services */}
        <div className="space-y-2">
          {service.details.map((detail) => (
            <button
              key={detail.id}
              onClick={() => onOpenDetail(detail, service)}
              className={`w-full text-left flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 group/sub hover:translate-x-1 ${
                isDark
                  ? "bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/10"
                  : "bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover/sub:scale-110 ${
                  isDark
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-emerald-50 border border-emerald-200"
                }`}
              >
                <DynamicIcon
                  name={detail.icon}
                  className={`w-3.5 h-3.5 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </div>
              <span
                className={`text-sm font-semibold flex-1 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {detail.title}
              </span>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-300 group-hover/sub:translate-x-1 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Target clients */}
        <div
          className={`flex items-center gap-2 mt-4 text-xs font-medium ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          {service.details[0]?.targetClients}
        </div>
      </div>
    </div>
  );
}

// --- Detail Modal ---
interface DetailModalProps {
  detail: ServiceCategory["details"][0] | null;
  category: ServiceCategory | null;
  isDark: boolean;
  lang: string;
  onClose: () => void;
}

export function DetailModal({ detail, category, isDark, lang, onClose }: DetailModalProps) {
  if (!detail || !category) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-sm transition-all duration-300"
      style={{ backgroundColor: isDark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className={`max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 max-h-[90vh] flex flex-col ${
          isDark
            ? "bg-[#141414] border border-white/10"
            : "bg-white border border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Header */}
        {category.image && (
          <div className="relative w-full h-48 md:h-56 overflow-hidden">
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${
                isDark
                  ? "from-[#141414] via-[#141414]/70 to-transparent"
                  : "from-white via-white/70 to-transparent"
              }`}
            />
            {/* Close button on image */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-colors backdrop-blur-sm ${
                isDark
                  ? "hover:bg-white/10 text-white/70 hover:text-white"
                  : "hover:bg-black/10 text-black/50 hover:text-black"
              }`}
              aria-label={lang === "es" ? "Cerrar" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>
            {/* Icon + category on image */}
            <div className="absolute bottom-4 left-6 flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${category.gradient} shadow-lg`}
              >
                <DynamicIcon name={detail.icon} className="w-6 h-6 text-white" />
              </div>
              <div>
                <div
                  className={`text-xs font-semibold uppercase tracking-widest ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  {category.title}
                </div>
                <h2
                  className={`text-xl md:text-2xl font-bold tracking-tight leading-tight ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {detail.title}
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* Fallback header if no image */}
        {!category.image && (
          <div
            className={`p-6 md:p-8 border-b flex items-start gap-5 ${
              isDark ? "border-white/10" : "border-gray-100"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${category.gradient}`}
            >
              <DynamicIcon name={detail.icon} className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {category.title}
              </div>
              <h2
                className={`text-2xl md:text-3xl font-bold tracking-tight leading-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {detail.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors shrink-0 ${
                isDark
                  ? "hover:bg-white/10 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
              aria-label={lang === "es" ? "Cerrar" : "Close"}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8">
          {/* Description */}
          <div>
            <h3
              className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {lang === "es" ? "Descripción" : "Description"}
            </h3>
            <p
              className={`text-base leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {detail.desc}
            </p>
          </div>

          {/* Practical Use */}
          <div
            className={`rounded-xl p-6 border ${
              isDark
                ? "bg-emerald-500/[0.06] border-emerald-500/20"
                : "bg-emerald-50 border-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap
                className={`w-4 h-4 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
              <h4
                className={`text-sm font-bold uppercase tracking-wider ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {lang === "es" ? "Caso de Uso Real" : "Real Use Case"}
              </h4>
            </div>
            <p
              className={`text-base leading-relaxed italic font-medium ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              &ldquo;{detail.practicalUse}&rdquo;
            </p>
          </div>

          {/* Target */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? "bg-white/[0.05]" : "bg-gray-100"
              }`}
            >
              <Users
                className={`w-5 h-5 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>
            <div>
              <div
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {lang === "es" ? "Para quién" : "Who it's for"}
              </div>
              <div
                className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {detail.targetClients}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-6 md:p-8 border-t ${
            isDark ? "border-white/10" : "border-gray-100"
          }`}
        >
          <a
            href="https://wa.me/56956249647?text=Hola,%20me%20interesa%20el%20servicio%20de%20IA"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 hover:shadow-lg active:scale-[0.98] ${
              isDark
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
                : "bg-gray-900 hover:bg-gray-800 text-white shadow-gray-900/20"
            }`}
          >
            {lang === "es" ? "Quiero este servicio" : "I want this service"}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
