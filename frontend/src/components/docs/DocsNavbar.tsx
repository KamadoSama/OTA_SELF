"use client";

import { ArrowLeft, CloudLightning, Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface NavSection {
  title: string;
  items: { id: string; label: string }[];
}

interface DocsNavbarProps {
  navSections: NavSection[];
  activeSection: string;
  onNavClick: (id: string) => void;
  version?: string;
}

export function DocsNavbar({
  navSections,
  activeSection,
  onNavClick,
  version = "v1.0.0",
}: DocsNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fermer le menu en appuyant sur Échap
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Bloquer le scroll du body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (id: string) => {
    onNavClick(id);
    setIsOpen(false);
  };

  const NavContent = () => (
    <div className="flex flex-col gap-8">
      {navSections.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <p
            className="font-bold uppercase tracking-widest mb-3 text-[10px]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            {section.title}
          </p>
          {section.items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className="text-sm font-medium py-1.5 pl-3 transition-all border-l-2"
              style={{
                color: activeSection === item.id ? "white" : "rgba(255,255,255,0.4)",
                borderLeftColor: activeSection === item.id ? "white" : "transparent",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      ))}

      <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />

      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>
          Resources
        </p>
        <a href="#" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)" }}>GitHub</a>
        <a href="#" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)" }}>Discord</a>
        <a href="#" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)" }}>Changelog</a>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Top Header Bar ── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between border-b"
        style={{
          height: "60px",
          padding: "0 20px",
          backgroundColor: "rgba(0,0,0,0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger — visible uniquement sur mobile */}
          <button
            onClick={() => {console.log("is open") ; setIsOpen(true)}}
            aria-label="Ouvrir le menu de navigation"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo size={24} className="rounded-md" />
            <span className="text-sm font-bold tracking-tight text-white">ZenOTA</span>
            <span className="hidden sm:inline text-sm font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
              / Docs
            </span>
          </div>
        </div>

        {/* Right: Back link + Version */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm transition-colors group"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline group-hover:text-white transition-colors">Accueil</span>
          </Link>
          <span
            className="hidden sm:inline text-[11px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border"
            style={{
              color: "rgba(255,255,255,0.25)",
              borderColor: "rgba(255,255,255,0.08)",
              backgroundColor: "rgba(255,255,255,0.03)",
            }}
          >
            {version}
          </span>
        </div>
      </header>


      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300  md:hidden ${ isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* Panneau coulissant */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#0a0a0a] border-r flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0 " : "hidden"
        }`}
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        {/* Header du drawer */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2">
            <Logo size={20} className="rounded-md" />
            <span className="text-sm font-bold text-white">ZenOTA Docs</span>
          </div>


          <button
            onClick={() => { setIsOpen(false)}}
            aria-label="Fermer le menu"
            className="flex items-center justify-center w-8 h-8 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

        </div>

        {/* Navigation dans le drawer */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <NavContent />
        </div>

        {/* Footer du drawer */}
        <div
          className="px-5 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-sm transition-colors group"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="group-hover:text-white transition-colors">Retour à l'accueil</span>
          </Link>
        </div>
      </aside>

      {/* ── Desktop Sidebar (statique, intégrée dans le layout parent) ── */}
      {/* 
        La sidebar desktop est gérée dans le fichier page.tsx parent
        pour respecter l'architecture flex layout. Ce composant gère 
        uniquement le header + le drawer mobile.
      */}
    </>
  );
}

/**
 * Sidebar desktop réutilisable — à placer dans le layout parent
 */
export function DocsSidebarDesktop({
  navSections,
  activeSection,
  onNavClick,
}: Pick<DocsNavbarProps, "navSections" | "activeSection" | "onNavClick">) {
  return (
    <aside
      className="hidden md:flex flex-col gap-8 sticky"
      style={{
        top: "60px",
        width: "220px",
        minWidth: "220px",
        maxHeight: "calc(100vh - 60px)",
        overflowY: "auto",
        paddingTop: "40px",
        paddingBottom: "40px",
        paddingRight: "32px",
      }}
    >
      {navSections.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <p
            className="font-bold uppercase tracking-widest mb-3 text-[10px]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            {section.title}
          </p>
          {section.items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => onNavClick(item.id)}
              className="text-sm font-medium py-1.5 pl-3 transition-all border-l-2"
              style={{
                color: activeSection === item.id ? "white" : "rgba(255,255,255,0.4)",
                borderLeftColor: activeSection === item.id ? "white" : "transparent",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      ))}

      <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />

      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>
          Resources
        </p>
        <a href="#" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)" }}>GitHub</a>
        <a href="#" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)" }}>Discord</a>
        <a href="#" className="text-sm font-medium transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)" }}>Changelog</a>
      </div>
    </aside>
  );
}
