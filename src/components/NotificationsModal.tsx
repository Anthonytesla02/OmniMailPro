import React, { useState } from 'react';
import { Account, AppNotificationConfig, NotificationItem } from '../types/mail';
import {
  X,
  Bell,
  BellRing,
  Volume2,
  Moon,
  Send,
  CheckCircle,
  Smartphone,
  Shield,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  config: AppNotificationConfig;
  onUpdateConfig: (newConfig: Partial<AppNotificationConfig>) => void;
  onUpdateAccountNotification: (
    accountId: string,
    updates: { notificationsEnabled?: boolean; notifyPriorityOnly?: boolean; soundEnabled?: boolean }
  ) => void;
  onTriggerTestPush: (accountId: string) => void;
  notificationLog: NotificationItem[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  accounts,
  config,
  onUpdateConfig,
  onUpdateAccountNotification,
  onTriggerTestPush,
  notificationLog,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings');
  const [testSentId, setTestSentId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestBrowserPermission = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        onUpdateConfig({ browserPermission: perm });
        if (perm === 'granted') {
          new Notification('OmniMail Pro Active', {
            body: 'Push notifications are now enabled across all business inboxes!',
            icon: '/vite.svg',
          });
        }
      } catch (e) {
        console.error('Notification error:', e);
      }
    }
  };

  const handleSendTest = (accId: string) => {
    onTriggerTestPush(accId);
    setTestSentId(accId);
    setTimeout(() => setTestSentId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">
                  Multi-Inbox Push Notification Engine
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Per-Inbox Tuning
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Manage APNs, FCM, and Web Push alerts for each of your {accounts.length} business inboxes.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'settings'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Per-Inbox Configuration ({accounts.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Live Dispatch Log</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {notificationLog.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'settings' ? (
            <>
              {/* Browser Permission Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Desktop &amp; Mobile Web Push Permission
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Status:{' '}
                      <strong className="text-emerald-400 capitalize">
                        {config.browserPermission}
                      </strong>
                    </div>
                  </div>
                </div>

                {config.browserPermission !== 'granted' && (
                  <button
                    onClick={handleRequestBrowserPermission}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-500/20 transition cursor-pointer"
                  >
                    Enable Browser Push
                  </button>
                )}
              </div>

              {/* Global Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-xs font-medium text-white">Master Alerts</div>
                      <div className="text-[10px] text-slate-400">All inboxes active</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.globalEnabled}
                    onChange={(e) => onUpdateConfig({ globalEnabled: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 w-4 h-4"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-medium text-white">Audio Chime</div>
                      <div className="text-[10px] text-slate-400">Crisp notification bell</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.soundEnabled}
                    onChange={(e) => onUpdateConfig({ soundEnabled: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 w-4 h-4"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-xs font-medium text-white">Quiet Hours</div>
                      <div className="text-[10px] text-slate-400">22:00 – 07:00 Suppressed</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.quietHours}
                    onChange={(e) => onUpdateConfig({ quietHours: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 w-4 h-4"
                  />
                </div>
              </div>

              {/* Per-Account Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Accounts Push Tuning Matrix ({accounts.length} Inboxes)
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Individual background push delivery rules
                  </span>
                </div>

                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/80">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/50 transition"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: acc.color }}
                        >
                          {acc.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-white truncate">
                              {acc.displayName}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              {acc.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">
                            {acc.email}
                          </div>
                        </div>
                      </div>

                      {/* Controls for this inbox */}
                      <div className="flex items-center space-x-4 self-end sm:self-center shrink-0">
                        <label className="flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={acc.notificationsEnabled}
                            onChange={(e) =>
                              onUpdateAccountNotification(acc.id, {
                                notificationsEnabled: e.target.checked,
                              })
                            }
                            className="rounded bg-slate-900 border-slate-700 text-emerald-500 w-3.5 h-3.5"
                          />
                          <span className="text-[11px]">Enabled</span>
                        </label>

                        <label className="flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={!acc.notificationsEnabled}
                            checked={acc.notifyPriorityOnly}
                            onChange={(e) =>
                              onUpdateAccountNotification(acc.id, {
                                notifyPriorityOnly: e.target.checked,
                              })
                            }
                            className="rounded bg-slate-900 border-slate-700 text-blue-500 w-3.5 h-3.5 disabled:opacity-40"
                          />
                          <span className="text-[11px]">VIP Only</span>
                        </label>

                        {/* Test Push trigger */}
                        <button
                          type="button"
                          onClick={() => handleSendTest(acc.id)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
                        >
                          <Send className="w-3 h-3 text-cyan-400" />
                          <span>
                            {testSentId === acc.id ? 'Dispatched!' : 'Test Push'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Dispatch History */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Push Dispatches
                </span>
                <span className="text-[11px] text-slate-400">
                  Real-time broadcast history
                </span>
              </div>

              {notificationLog.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No notifications recorded yet. Click "Test Push" on any inbox to test!
                </div>
              ) : (
                <div className="space-y-2">
                  {notificationLog.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">
                            {item.senderName}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">
                            → {item.accountEmail}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium">
                          {item.subject}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {item.snippet}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 shrink-0">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            Expo Push Token API: <code className="text-slate-300 font-mono text-[10px]">ExponentPushToken[...]</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
