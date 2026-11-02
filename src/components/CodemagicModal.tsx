import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { CODEMAGIC_YAML, EXPO_APP_JSON, EXPO_PACKAGE_JSON } from '../data/codemagicTemplates';

interface CodemagicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodemagicModal: React.FC<CodemagicModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'yaml' | 'appjson' | 'steps' | 'expo'>('yaml');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-bold text-sm">
              CM
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">
                  Codemagic.io Expo Mobile Packaging Hub
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Ready-to-Build
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automated cloud CI/CD pipelines to package APK, AAB &amp; iOS IPA for your multi-inbox Gmail app.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="https://codemagic.io"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold mr-2"
            >
              <span>codemagic.io</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('yaml')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'yaml'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>codemagic.yaml</span>
          </button>

          <button
            onClick={() => setActiveTab('appjson')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'appjson'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>app.json (Expo)</span>
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'steps'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Step-by-Step CI/CD Packaging Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('expo')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'expo'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Push Notifications &amp; Keystore</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'yaml' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Ready-to-Use Codemagic Workflow Configuration
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Place this <code className="text-cyan-400 font-mono">codemagic.yaml</code> in the root of your Git repository. Codemagic will auto-detect Android &amp; iOS builds.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(CODEMAGIC_YAML, 'yaml')}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                  >
                    {copiedKey === 'yaml' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy YAML</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadFile('codemagic.yaml', CODEMAGIC_YAML)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto max-h-[460px] leading-relaxed select-all">
                {CODEMAGIC_YAML}
              </pre>
            </div>
          )}

          {activeTab === 'appjson' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Expo Configuration (<code className="text-cyan-400 font-mono">app.json</code>)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Pre-configured for Expo SDK 52, background push notifications (<code className="text-slate-300">expo-notifications</code>), and production bundle ID.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(EXPO_APP_JSON, 'appjson')}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                  >
                    {copiedKey === 'appjson' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadFile('app.json', EXPO_APP_JSON)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-[460px] leading-relaxed select-all">
                {EXPO_APP_JSON}
              </pre>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Step-by-Step Instructions to Package on Codemagic.io
              </h4>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3.5">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-white">Create Repository on GitHub / GitLab</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Initialize a repository and include your project files alongside <code className="text-cyan-400 font-mono">codemagic.yaml</code> and <code className="text-cyan-400 font-mono">app.json</code>.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3.5">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-white">Connect Your Repo to Codemagic.io</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Go to <a href="https://codemagic.io" target="_blank" rel="noreferrer" className="text-cyan-400 underline">https://codemagic.io</a>, sign in with GitHub, and click <strong>"Add application"</strong>. Select <em>React Native / Expo</em>.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3.5">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-white">Codemagic Auto-Detection</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Codemagic detects <code className="text-cyan-400 font-mono">codemagic.yaml</code> automatically and registers the <strong>expo-android-release</strong> and <strong>expo-ios-release</strong> workflows.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3.5">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-white">Trigger Build &amp; Download APK / IPA</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Click <strong>"Start new build"</strong>. Codemagic will run Expo Prebuild, compile native binaries, sign the package, and send the finished <code className="text-emerald-400 font-mono">.apk</code> and <code className="text-emerald-400 font-mono">.ipa</code> directly to your email (<code className="text-slate-300">buybesttraffic@gmail.com</code>).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expo' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Push Notifications &amp; Signing Setup
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Android Push (Firebase FCM)</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    1. Create a Firebase project and add your Android app package (<code className="text-slate-300 font-mono">com.omnimail.business</code>).<br />
                    2. Download <code className="text-cyan-400 font-mono">google-services.json</code> and place in project root.<br />
                    3. Codemagic builds will bundle FCM credentials for instant background push.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>iOS Push (Apple APNs)</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    1. In Apple Developer Portal, generate an APNs Key (.p8).<br />
                    2. Upload the key to Expo / Codemagic under <em>Code Signing &gt; iOS Push</em>.<br />
                    3. Notifications will wake up the iOS background fetch task for all 10+ inboxes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/70">
          <span className="text-[11px] text-slate-400">
            Target Bundle: <code className="text-cyan-400 font-mono">com.omnimail.business</code>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
