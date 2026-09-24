"use client";

import { Copy, Terminal, Download, Globe, Zap, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import { DocsNavbar, DocsSidebarDesktop } from "@/components/docs/DocsNavbar";
import { useTranslations } from "next-intl";

function CodeBlock({ code, id, label }: { code: string; id: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl border border-white/10 bg-[#080808] overflow-hidden shadow-2xl transition-all hover:border-white/20">
      {label && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-2">{label}</span>
          </div>
        </div>
      )}
      <div className="relative">
        <pre className="px-5 py-5 font-mono text-[13px] text-white/80 leading-relaxed overflow-x-auto selection:bg-white selection:text-black">
          <code>{code}</code>
        </pre>
        <button
          onClick={copy}
          className="absolute right-4 top-4 p-2 rounded-lg border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white hover:text-black hover:border-white transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
        >
          {copied ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const t = useTranslations("Docs");

  const NAV_SECTIONS = useMemo(() => [
    {
      title: t("sections.gettingStarted.title"),
      items: [
        { id: "introduction", label: t("sections.gettingStarted.intro") },
        { id: "prerequisites", label: t("sections.gettingStarted.prerequisites") },
        { id: "quickstart", label: t("sections.gettingStarted.quickstart") },
      ],
    },
    {
      title: t("sections.cliReference.title"),
      items: [
        { id: "installation", label: t("sections.cliReference.installation") },
        { id: "authentication", label: t("sections.cliReference.authentication") },
        { id: "publishing", label: t("sections.cliReference.publishing") },
      ],
    },
    {
      title: t("sections.platform.title"),
      items: [
        { id: "api-keys", label: t("sections.platform.apiKeys") },
        { id: "manifest", label: t("sections.platform.manifest") },
      ],
    },
    {
      title: t("sections.selfHosting.title"),
      items: [
        { id: "selfhost-quickstart", label: t("sections.selfHosting.quickstart") },
        { id: "selfhost-docker", label: t("sections.selfHosting.docker") },
      ],
    },
    {
      title: t("sections.releaseOps.title"),
      items: [
        { id: "rollouts", label: t("sections.releaseOps.rollouts") },
        { id: "rollback", label: t("sections.releaseOps.rollback") },
      ],
    },
  ], [t]);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
  };

  const codeTag = (chunks: React.ReactNode) => (
    <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-sm">
      {chunks}
    </code>
  );

  const bold = (chunks: React.ReactNode) => (
    <strong className="text-white font-semibold">
      {chunks}
    </strong>
  );

  return (
    <div
      style={{ backgroundColor: "#000000", minHeight: "100vh", color: "white" }}
      className="font-sans antialiased"
    >
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Premium Glow effect */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.4]"
        style={{
          background: "radial-gradient(1000px circle at 50% 0px, rgba(255,255,255,0.06), transparent)",
        }}
      />

      {/* Navbar (Header + Mobile Drawer) */}
      <DocsNavbar
        navSections={NAV_SECTIONS}
        activeSection={activeSection}
        onNavClick={handleNavClick}
        version="v1.0.0"
      />

      {/* Page Body: Sidebar + Content */}
      <div className="relative z-10 flex flex-row max-w-[1200px] mx-auto px-4 md:px-4">

        {/* Desktop Sidebar */}
        <DocsSidebarDesktop
          navSections={NAV_SECTIONS}
          activeSection={activeSection}
          onNavClick={handleNavClick}
        />

        {/* Vertical Divider (Desktop only) */}
        <div className="hidden md:block" style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.06)", alignSelf: "stretch", marginTop: "40px", marginBottom: "40px" }} />

        {/* Main Content */}
        <main
          className="flex-1 min-w-0 md:pl-14 px-10 py-10 md:py-20 flex flex-col gap-28 max-w-4xl"
        >
          {/* ── Introduction ── */}
          <section id="introduction" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border self-start"
                style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {t('introduction.badge')}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">{t('introduction.title')}</h1>
            </div>

            <p className="text-base md:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              {t.rich('introduction.desc', { bold })}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Zap, title: t('introduction.features.instant.title'), desc: t('introduction.features.instant.desc') },
                { icon: Globe, title: t('introduction.features.pricing.title'), desc: t('introduction.features.pricing.desc') },
                { icon: Terminal, title: t('introduction.features.cli.title'), desc: t('introduction.features.cli.desc') }
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="flex flex-col gap-3 rounded-xl p-5 border transition-all hover:border-white/20 hover:bg-white/[0.04] group/card"
                    style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}
                  >
                    <Icon className="h-4 w-4 transition-colors group-hover/card:text-white" style={{ color: "rgba(255,255,255,0.4)" }} />
                    <div>
                      <p className="text-[13px] font-bold mb-1 text-white/90">{card.title}</p>
                      <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{card.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Prerequisites ── */}
          <section id="prerequisites" className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('prerequisites.title')}</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>{t('prerequisites.subtitle')}</p>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                {t.rich('prerequisites.desc', { codeTag })}
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  {t('prerequisites.step1')}
                </div>
                <CodeBlock
                  id="install-expo-updates"
                  label="Terminal"
                  code="npx expo install expo-updates"
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  {t('prerequisites.step2')}
                </div>
                <CodeBlock
                  id="eas-update-configure"
                  label="Terminal"
                  code="npx eas update:configure"
                />
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {t.rich('prerequisites.step2Desc', { codeTag })}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  {t('prerequisites.step3')}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {t.rich('prerequisites.step3Desc', { codeTag })}
                </p>
                <div
                  className="group flex items-center gap-2 self-start text-[13px] font-bold text-white/40 hover:text-white transition-colors cursor-pointer"
                  onClick={() => handleNavClick('manifest')}
                >
                  {t('prerequisites.seeManifest')} <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </div>

              <div
                className="rounded-xl px-5 py-5 border text-[13px] leading-relaxed"
                style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.4)" }}
              >
                {t.rich('prerequisites.critical', { bold, codeTag })}
              </div>
            </div>
          </section>

          {/* ── Quick Start ── */}
          <section id="quickstart" className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('quickstart.title')}</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>{t('quickstart.subtitle')}</p>
            </div>

            <ol className="flex flex-col gap-14">
              {[
                {
                  step: 1,
                  title: t('quickstart.steps.1.title'),
                  desc: t('quickstart.steps.1.desc'),
                  code: "npm install -g zenota-cli",
                  label: "Terminal",
                },
                {
                  step: 2,
                  title: t('quickstart.steps.2.title'),
                  desc: t('quickstart.steps.2.desc'),
                  code: null,
                  label: null,
                },
                {
                  step: 3,
                  title: t('quickstart.steps.3.title'),
                  desc: t('quickstart.steps.3.desc'),
                  code: "zenota login",
                  label: "Terminal",
                },
                {
                  step: 4,
                  title: t('quickstart.steps.4.title'),
                  desc: t('quickstart.steps.4.desc'),
                  code: "zenota publish",
                  label: "Terminal",
                },
              ].map(({ step, title, desc, code, label }) => (
                <li key={step} className="flex gap-6">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    style={{ backgroundColor: "white", color: "black" }}
                  >
                    {step}
                  </div>
                  <div className="flex flex-col gap-4 flex-1 min-w-0">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-white/90">{title}</h3>
                      <p className="text-[15px] mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</p>
                    </div>
                    {code && <CodeBlock id={`step-${step}`} code={code} label={label ?? undefined} />}
                  </div>
                </li>
              ))}
            </ol>

            <button
              onClick={() => handleNavClick('publishing')}
              className="group flex items-center gap-2 self-start mt-4 text-[13px] font-bold text-white/40 hover:text-white transition-colors"
            >
              {t('quickstart.exploreCLI')} <CheckCircle2 className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </section>

          {/* ── CLI Reference ── */}
          <section id="publishing" className="flex flex-col gap-8">
            <div
              className="flex flex-col gap-2 pb-8 border-b"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-3">
                <Terminal className="h-4 w-4" style={{ color: "rgba(255,255,255,0.5)" }} />
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('cliReference.title')}</h2>
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>{t.rich('cliReference.subtitle', { codeTag })}</p>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-white/80">zenota publish</h3>
                <CodeBlock id="cli-publish" code="zenota publish [options]" label="Syntax" />
              </div>

              <div className="rounded-xl border overflow-hidden bg-white/[0.01]" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.03)" }}>
                        <th className="text-left px-5 py-4 font-bold text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.25)" }}>{t('cliReference.table.flag')}</th>
                        <th className="text-left px-5 py-4 font-bold text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.25)" }}>{t('cliReference.table.default')}</th>
                        <th className="text-left px-5 py-4 font-bold text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.25)" }}>{t('cliReference.table.description')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { flag: "--channel, -c", default: "production", desc: t('cliReference.flags.channel') },
                        { flag: "--platform, -p", default: "interactive", desc: t('cliReference.flags.platform') },
                        { flag: "--version, -v", default: "—", desc: t('cliReference.flags.version') },
                      ].map((row) => (
                        <tr key={row.flag} className="hover:bg-white/[0.02] transition-colors" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          <td className="px-5 py-5 font-mono text-[13px] font-bold" style={{ color: "rgba(255,255,255,0.8)" }}>{row.flag}</td>
                          <td className="px-5 py-5 font-mono text-[11px] italic" style={{ color: "rgba(255,255,255,0.3)" }}>{row.default}</td>
                          <td className="px-5 py-5 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('api-keys')}
              className="group flex items-center gap-2 self-start mt-4 text-[13px] font-bold text-white/40 hover:text-white transition-colors"
            >
              {t('cliReference.learnAPI')} <CheckCircle2 className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </section>

          {/* ── API Keys ── */}
          <section id="api-keys" className="flex flex-col mt-4 gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('apiKeys.title')}</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>{t('apiKeys.subtitle')}</p>
            </div>

            <div
              className="flex gap-5 items-start rounded-xl p-6 border bg-white/[0.02]"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border border-white/5 bg-white/5"
              >
                <span className="text-lg">⚠️</span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-white/90">{t('apiKeys.warning.title')}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {t('apiKeys.warning.desc')}
                </p>
              </div>
            </div>

            <ol className="flex flex-col gap-5 mt-2">
              {(t.raw('apiKeys.steps') as string[]).map((text, index) => (
                <li key={index} className="flex items-center gap-4 group">
                  <span
                    className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border border-white/10 group-hover:border-white/30 transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{text}</span>
                </li>
              ))}
            </ol>

            <button
              onClick={() => handleNavClick('manifest')}
              className="group flex items-center gap-2 self-start mt-4 text-[13px] font-bold text-white/40 hover:text-white transition-colors"
            >
              {t('apiKeys.seeVersioning')} <CheckCircle2 className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </section>

          {/* ── Manifest & Versioning ── */}
          <section id="manifest" className="flex mt-4 flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white/90">{t('manifest.title')}</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>{t('manifest.subtitle')}</p>
            </div>

            <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              {t.rich('manifest.desc', { bold, codeTag })}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                {t('manifest.config')}
              </div>
              <CodeBlock
                id="manifest-config"
                label="app.json"
                code={`{
  "expo": {
    "runtimeVersion": {
      "policy": "sdkVersion"
    },
    "updates": {
      "url": "https://api-zenota.diesestudio.com/api/update/manifest/{your-app-slug}"
    }
  }
}`}
              />
            </div>

            <div
              className="rounded-xl px-6 py-5 border text-[13px] leading-relaxed"
              style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.4)" }}
            >
              {t.rich('manifest.proTip', { codeTag, bold })}
            </div>
          </section>

          {/* ── Self-Hosting: Quickstart ── */}
          <section id="selfhost-quickstart" className="flex mt-8 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 self-start border border-blue-500/20">
                Self-Host Community
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white/90">
                Installation 1-Ligne sur votre VPS
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>
                Déployez ZenOTA en moins de 2 minutes sur n'importe quel serveur Ubuntu / Debian / macOS.
              </p>
            </div>

            <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Exécutez notre script d'installation officiel avec les privilèges root. Il télécharge le binaire CLI serveur et vérifie vos prérequis Docker :
            </p>

            <CodeBlock
              id="selfhost-curl"
              label="terminal (sur votre vps)"
              code="curl -fsSL https://get-zenota.diesestudio.com | sh"
            />

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
                Initialisation et Commandes de Gestion
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-400">zenota init</div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Assistant interactif : détecte Docker, génère les secrets sécurisés et démarre la stack complète.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
                  <div className="text-xs font-mono font-bold text-blue-400">zenota status</div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Vérifie l'état de santé de vos conteneurs (Postgres, MinIO, Backend, Frontend).
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
                  <div className="text-xs font-mono font-bold text-purple-400">zenota logs</div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Affiche en direct les journaux du serveur pour surveiller les téléchargements d'OTA.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] space-y-2">
                  <div className="text-xs font-mono font-bold text-amber-400">zenota restart</div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Redémarre l'ensemble des services en cas de mise à jour système.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Self-Hosting: Docker Compose ── */}
          <section id="selfhost-docker" className="flex mt-8 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white/90">
                Architecture Docker & MinIO
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>
                La stack complète ZenOTA est orchestrée via Docker Compose sans usine à gaz.
              </p>
            </div>

            <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Contrairement à d'autres solutions qui imposent des clusters lourds comme ClickHouse ou Kafka, ZenOTA s'appuie sur une pile ultra-légère et robuste :
            </p>

            <ul className="space-y-3 text-xs text-white/60">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <strong className="text-white">PostgreSQL 16</strong> : Stocke les métadonnées de déploiement, canaux et applications.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <strong className="text-white">MinIO (S3 compatible)</strong> : Stocke les bundles JS et les assets avec des URLs pré-signées ou publiques.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <strong className="text-white">NestJS API & Next.js UI</strong> : Moteur de distribution d'updates et tableau de bord.
              </li>
            </ul>

            <CodeBlock
              id="docker-compose-snippet"
              label="docker-compose.yml"
              code={`version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: zenota
      POSTGRES_USER: zenota
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: \${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: \${MINIO_ROOT_PASSWORD}
    volumes:
      - minio_data:/data

  backend:
    image: ghcr.io/kamadosama/zenota-backend:latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://zenota:\${POSTGRES_PASSWORD}@postgres:5432/zenota"
      STORAGE_DRIVER: "s3"
      S3_ENDPOINT: "http://minio:9000"`}
            />
          </section>

          {/* ── Progressive Rollouts ── */}
          <section id="rollouts" className="flex mt-8 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 self-start border border-emerald-500/20">
                Canary Releases
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white/90">
                Déploiements Progressifs (%)
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>
                Diffusez en toute sécurité vos mises à jour à un pourcentage déterminé de vos utilisateurs.
              </p>
            </div>

            <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              ZenOTA utilise un algorithme de hachage déterministe basé sur l'identifiant unique de l'appareil (<code className="text-emerald-300 font-mono">Expo-Client-Id</code>).
              Un utilisateur assigné à la nouvelle version y restera de manière stable.
            </p>

            <CodeBlock
              id="cli-rollout-snippet"
              label="terminal"
              code="# Déployer d'abord à 25% des appareils
npx zenota publish --channel production --rollout 25

# Puis augmenter à 50%
npx zenota publish --channel production --rollout 50

# Et enfin basculer à 100% pour l'ensemble du parc
npx zenota publish --channel production --rollout 100"
            />
          </section>

          {/* ── Instant Rollback ── */}
          <section id="rollback" className="flex mt-8 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 self-start border border-amber-500/20">
                Zero-Downtime Rollback
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white/90">
                Instant Rollback (Annulation en 1 Clic)
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>
                Annulez immédiatement une version défectueuse en moins de 200ms sans reconstruire de bundle.
              </p>
            </div>

            <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              En cas de régression inattendue en production, lancez simplement la commande rollback. ZenOTA révoque immédiatement l'update défectueuse et réassigne le channel vers la version stable précédente :
            </p>

            <CodeBlock
              id="cli-rollback-snippet"
              label="terminal"
              code="npx zenota rollback --channel production"
            />

            <div
              className="rounded-xl px-6 py-5 border text-[13px] leading-relaxed"
              style={{ borderColor: "rgba(245,158,11,0.2)", backgroundColor: "rgba(245,158,11,0.03)", color: "rgba(255,255,255,0.6)" }}
            >
              <strong className="text-amber-300">Restauration sans recompilation :</strong> Les appareils qui ont téléchargé la mauvaise version téléchargeront automatiquement la version saine lors de leur prochain check-in.
            </div>
          </section>

          {/* Footer */}
          <footer
            className="flex flex-col sm:flex-row items-center mt-4 justify-between gap-6 pt-12 border-t"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <p className="text-[12px] text-center sm:text-left" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t('footer.lastUpdated')}
            </p>

            <div className="flex items-center gap-6">
              <a href="#" className="text-[12px] font-medium transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)" }}>GitHub</a>
              <a href="#" className="text-[12px] font-medium transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)" }}>Discord</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}