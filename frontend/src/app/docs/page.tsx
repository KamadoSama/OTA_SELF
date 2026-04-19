"use client";

import { Copy, Terminal, Download, Globe, Zap, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { DocsNavbar, DocsSidebarDesktop } from "@/components/docs/DocsNavbar";

const NAV_SECTIONS = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction" },
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
    <div className="relative group rounded-lg border border-white/10 bg-[#0a0a0a] overflow-hidden">
      {label && (
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{label}</span>
        </div>
      )}
      <div className="relative">
        <pre className="px-4 py-4 font-mono text-sm text-white/70 leading-relaxed overflow-x-auto">
          <code>{code}</code>
        </pre>
        <button
          onClick={copy}
          className="absolute right-3 top-3 p-1.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
        >
          {copied ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
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
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
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
          className="flex-1 min-w-0 md:pl-14 py-10 md:py-20 flex flex-col gap-20"
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
                { icon: Terminal, title: "Powerful CLI", desc: "One command to export, compress, and deploy your bundle." },
                { icon: Download, title: "Self-hosted", desc: "Full control over your data with MinIO S3-compatible storage." },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="flex flex-col gap-3 rounded-lg p-4 border transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}
                  >
                    <Icon className="h-4 w-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                    <div>
                      <p className="text-sm font-bold mb-1">{card.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{card.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Quick Start ── */}
          <section id="quickstart" className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Quick Start</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>Ship your first update in under 5 minutes.</p>
            </div>

            <ol className="flex flex-col gap-10">
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
                <li key={step} className="flex gap-4">
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mr-2 mt-0.5"
                    style={{ backgroundColor: "white", color: "black" }}
                  >
                    {step}
                  </div>
                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <div>
                      <h3 className="text-base font-bold">{title}</h3>
                      <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</p>
                    </div>
                    {code && <CodeBlock id={`step-${step}`} code={code} label={label ?? undefined} />}
                  </div>
                </li>
              ))}
            </ol>
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

            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold">zenota publish</h3>
              <CodeBlock id="cli-publish" code="zenota publish [options]" label="Syntax" />

              <div className="rounded-lg border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Flag</th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Default</th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { flag: "--channel, -c", default: "production", desc: "Target deployment channel (e.g., production, staging)." },
                        { flag: "--platform, -p", default: "interactive", desc: "Target platform: ios, android, or all. Opens a menu if omitted." },
                        { flag: "--version, -v", default: "—", desc: "Show the current CLI version." },
                      ].map((row) => (
                        <tr key={row.flag} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          <td className="px-4 py-4 font-mono text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>{row.flag}</td>
                          <td className="px-4 py-4 font-mono text-xs italic" style={{ color: "rgba(255,255,255,0.35)" }}>{row.default}</td>
                          <td className="px-4 py-4 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{row.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* ── API Keys ── */}
          <section id="api-keys" className="flex flex-col mt-4 gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">API Keys</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>Secure your CLI deployments with scoped API tokens.</p>
            </div>

            <div
              className="flex gap-4 items-start rounded-lg p-4 border"
              style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <div
                className="h-8 w-8 rounded flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <span className="text-sm">⚠️</span>
              </div>
              <div>
                <p className="text-sm font-bold mb-1">One-time display</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  API keys are only shown once at creation time. Copy and store them in a secure place (e.g., a password manager or CI/CD secret store). If you lose a key, you must revoke and regenerate it.
                </p>
              </div>
            </div>

            <ol className="flex flex-col gap-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {[
                { step: 1, text: "Go to your Dashboard → CLI Access Tokens." },
                { step: 2, text: 'Click "Generate New Key". The raw key is shown only once.' },
                { step: 3, text: 'Run `zenota login` in your terminal and paste the key when prompted.' },
                { step: 4, text: "The CLI stores the key securely in ~/.zenota-config.json." },
              ].map(({ step, text }) => (
                <li key={step} className="flex items-start gap-4">
                  <span
                    className="h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                  >
                    {step}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* ── Manifest & Versioning ── */}
          <section id="manifest" className="flex mt-4 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Manifest & Versioning</h2>
              <p style={{ color: "rgba(255,255,255,0.45)" }}>How ZenOTA matches updates to native builds.</p>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              ZenOTA generates <strong className="text-white">Expo-compatible manifests</strong>. Your app's native build must have a matching <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">runtimeVersion</code> configured in <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">app.json</code> for an update to be applied.
            </p>

            <CodeBlock
              id="manifest-config"
              label="app.json"
              code={`{
  "expo": {
    "runtimeVersion": {
      "policy": "sdkVersion"
    },
    "updates": {
      "url": "https://your-zenota-server.com/api/update/manifest"
    }
  }
}`}
            />

            <div
              className="rounded-lg px-4 py-4 border text-sm"
              style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.45)" }}
            >
              <strong className="text-white">Tip:</strong> Use the <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">sdkVersion</code> policy during development and switch to a <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">nativeVersion</code> policy for production after your first App Store submission.
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
