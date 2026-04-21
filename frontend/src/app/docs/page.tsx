"use client";

import { Copy, Terminal, Download, Globe, Zap, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { DocsNavbar, DocsSidebarDesktop } from "@/components/docs/DocsNavbar";

const NAV_SECTIONS = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "prerequisites", label: "Prerequisites" },
      { id: "quickstart", label: "Quick Start" },
    ],
  },
  {
    title: "CLI Reference",
    items: [
      { id: "installation", label: "Installation" },
      { id: "authentication", label: "Authentication" },
      { id: "publishing", label: "Publishing Updates" },
    ],
  },
  {
    title: "Platform",
    items: [
      { id: "api-keys", label: "API Keys" },
      { id: "manifest", label: "Manifest & Versioning" },
    ],
  },
];

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

  const handleNavClick = (id: string) => {
    setActiveSection(id);
  };

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
      <div className="relative z-10 flex flex-row max-w-[1200px] mx-auto px-4 md:px-6">

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
          className="flex-1 min-w-0 md:pl-14 py-10 md:py-20 flex flex-col gap-28 max-w-4xl"
        >
          {/* ── Introduction ── */}
          <section id="introduction" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border self-start"
                style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Introduction
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">What is ZenOTA?</h1>
            </div>

            <p className="text-base md:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              ZenOTA is an enterprise-grade <strong className="text-white font-semibold">Over-The-Air (OTA)</strong> update platform for React Native Expo apps. Ship JavaScript bundles and assets directly to user devices without App Store delays — your own self-hosted alternative to EAS Update.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Zap, title: "Instant Delivery", desc: "Edge CDN ensures updates reach users in milliseconds worldwide." },
                { icon: Globe, title: "Flat Pricing", desc: "No bandwidth billing. One subscription for all your apps." },
                { icon: Terminal, title: "Powerful CLI", desc: "One command to export, compress, and deploy your bundle." }
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
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Prerequisites</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>Configure your Expo project for OTA updates before using ZenOTA.</p>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                ZenOTA replaces the default EAS Update endpoint with its own. For this to work, you need the <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-sm">expo-updates</code> library installed and the update configuration initialized in your project.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  Step 1 — Install expo-updates
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
                  Step 2 — Initialize EAS Update config
                </div>
                <CodeBlock
                  id="eas-update-configure"
                  label="Terminal"
                  code="npx eas update:configure"
                />
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  This will add a <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-sm">runtimeVersion</code> and an <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-sm">updates.url</code> field to your <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-sm">app.json</code>.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  Step 3 — Configure ZenOTA Endpoint
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Finally, you'll need to update the <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-sm">updates.url</code> in your <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-sm">app.json</code> to point to your ZenOTA manifest endpoint.
                </p>
                <div
                  className="group flex items-center gap-2 self-start text-[13px] font-bold text-white/40 hover:text-white transition-colors cursor-pointer"
                  onClick={() => handleNavClick('manifest')}
                >
                  See how to configure app.json <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </div>

              <div
                className="rounded-xl px-5 py-5 border text-[13px] leading-relaxed"
                style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.4)" }}
              >
                <strong className="text-white/80">Critical:</strong> You must complete these steps <strong className="text-white/80">before</strong> installing the ZenOTA CLI. Without <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-xs">expo-updates</code>, the CLI export command will fail.
              </div>
            </div>
          </section>

          {/* ── Quick Start ── */}
          <section id="quickstart" className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Quick Start</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>Ship your first update in under 5 minutes.</p>
            </div>

            <ol className="flex flex-col gap-14">
              {[
                {
                  step: 1,
                  title: "Install the ZenOTA CLI",
                  desc: "Install the CLI globally via npm or yarn.",
                  code: "npm install -g zenota-cli",
                  label: "Terminal",
                },
                {
                  step: 2,
                  title: "Generate an API Key",
                  desc: "Go to your Dashboard → CLI Access Tokens → Generate New Key. Copy the key immediately — it won't be shown again.",
                  code: null,
                  label: null,
                },
                {
                  step: 3,
                  title: "Authenticate the CLI",
                  desc: "Run the login command and paste your API key when prompted.",
                  code: "zenota login",
                  label: "Terminal",
                },
                {
                  step: 4,
                  title: "Publish your update",
                  desc: "Navigate to your Expo project root. Run publish and choose your target platform (Android, iOS, or both) from the interactive menu.",
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
              Explore CLI Reference <CheckCircle2 className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">CLI Reference</h2>
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>All commands and flags available in the <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-sm">zenota-cli</code>.</p>
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
                        <th className="text-left px-5 py-4 font-bold text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.25)" }}>Flag</th>
                        <th className="text-left px-5 py-4 font-bold text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.25)" }}>Default</th>
                        <th className="text-left px-5 py-4 font-bold text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.25)" }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { flag: "--channel, -c", default: "production", desc: "Target deployment channel (e.g., production, staging)." },
                        { flag: "--platform, -p", default: "interactive", desc: "Target platform: ios, android, or all. Opens a menu if omitted." },
                        { flag: "--version, -v", default: "—", desc: "Show the current CLI version." },
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
              Learn about API Keys <CheckCircle2 className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </section>

          {/* ── API Keys ── */}
          <section id="api-keys" className="flex flex-col mt-4 gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">API Keys</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>Secure your CLI deployments with scoped API tokens.</p>
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
                <p className="text-sm font-bold text-white/90">One-time display policy</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  API keys are only shown once at creation time. Copy and store them in a secure place (e.g., a password manager or CI/CD secret store). If you lose a key, you must revoke and regenerate it.
                </p>
              </div>
            </div>

            <ol className="flex flex-col gap-5 mt-2">
              {[
                { step: 1, text: "Go to your Dashboard → CLI Access Tokens." },
                { step: 2, text: 'Click "Generate New Key". The raw key is shown only once.' },
                { step: 3, text: 'Run `zenota login` in your terminal and paste the key when prompted.' },
                { step: 4, text: "The CLI stores the key securely in ~/.zenota-config.json." },
              ].map(({ step, text }) => (
                <li key={step} className="flex items-center gap-4 group">
                  <span
                    className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border border-white/10 group-hover:border-white/30 transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}
                  >
                    {step}
                  </span>
                  <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{text}</span>
                </li>
              ))}
            </ol>

            <button
              onClick={() => handleNavClick('manifest')}
              className="group flex items-center gap-2 self-start mt-4 text-[13px] font-bold text-white/40 hover:text-white transition-colors"
            >
              Understand Manifests & Versioning <CheckCircle2 className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </section>

          {/* ── Manifest & Versioning ── */}
          <section id="manifest" className="flex mt-4 flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white/90">Manifest & Versioning</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>How ZenOTA matches updates to native builds.</p>
            </div>

            <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              ZenOTA generates <strong className="text-white/80 font-semibold">Expo-compatible manifests</strong>. Your app's native build must have a matching <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-[13px]">runtimeVersion</code> configured in <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-[13px]">app.json</code> for an update to be applied.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                Recommended Configuration
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
              <strong className="text-white/80">Pro Tip:</strong> Use the <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-xs">sdkVersion</code> policy during development and switch to a <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded text-xs">nativeVersion</code> policy for production after your first App Store submission.
            </div>
          </section>

          {/* Footer */}
          <footer
            className="flex flex-col sm:flex-row items-center mt-4 justify-between gap-6 pt-12 border-t"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <p className="text-[12px] text-center sm:text-left" style={{ color: "rgba(255,255,255,0.2)" }}>
              ZenOTA Docs — Last updated April 2024
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