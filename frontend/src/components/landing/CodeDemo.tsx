"use client";

import { useState } from "react";

export function CodeDemo() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'config'>('terminal');

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10 bg-black/40 backdrop-blur-xl">
      {/* Header Tabs */}
      <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 gap-4">
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`text-xs font-mono px-3 py-1 rounded-md transition-all duration-300 ${activeTab === 'terminal' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          terminal
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`text-xs font-mono px-3 py-1 rounded-md transition-all duration-300 ${activeTab === 'config' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          app.json
        </button>
      </div>

      {/* Content */}
      <div className="p-6 font-mono text-sm leading-relaxed h-[280px] overflow-y-auto overflow-x-hidden">
        {activeTab === 'terminal' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="text-white/50 mb-2">$ npx zenota-cli publish</div>
            <div className="text-blue-400 mb-1">ℹ Building Expo bundle...</div>
            <div className="text-white/70 mb-1">✓ JavaScript bundle (iOS/Android) created</div>
            <div className="text-white/70 mb-1">✓ Assets processed and hashed</div>
            <div className="text-blue-400 mb-1">ℹ Uploading to ZenOTA Edge Network...</div>
            <div className="text-white/70 mb-4">✓ Upload complete (4.2MB)</div>
            <div className="text-green-400 font-bold">✨ Success! Update v1.0.4 is now live.</div>
            <div className="text-white/50 mt-2 flex items-center gap-2">
              <span className="text-blue-400">~/my-expo-app</span>
              <span className="w-2 h-4 bg-white/80 animate-pulse inline-block" />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-white/70">
            <pre>
              <code className="text-[13px] leading-relaxed">
                {`{
  "expo": {
    "name": "my-expo-app",
    "updates": {
      "url": "https://api-zenota.diesestudio.com/api/update/manifest/{your-app-slug}"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}`}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
