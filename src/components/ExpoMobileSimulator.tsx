import React, { useState } from 'react';
import { Account, Email, Folder, NotificationItem } from '../types/mail';
import {
  Layers,
  Inbox,
  PenSquare,
  Bell,
  Settings,
  ChevronDown,
  Star,
  Paperclip,
  Plus,
  Search,
  Check,
  Smartphone,
  Wifi,
  Battery,
  ChevronLeft,
  Reply,
  Trash2,
  Archive,
  FolderInput
} from 'lucide-react';

interface ExpoMobileSimulatorProps {
  accounts: Account[];
  emails: Email[];
  folders: Folder[];
  activeAccountId: string;
  onSelectAccount: (accountId: string) => void;
  onOpenCompose: () => void;
  onOpenAddAccount: () => void;
  onOpenNotifications: () => void;
  onOpenCodemagic: () => void;
  onToggleStar: (emailId: string) => void;
  onMarkRead: (emailId: string, isRead: boolean) => void;
  onMoveFolder: (emailId: string, folderId: string) => void;
  unreadMap: Record<string, number>;
  totalUnread: number;
}

export const ExpoMobileSimulator: React.FC<ExpoMobileSimulatorProps> = ({
  accounts,
  emails,
  folders,
  activeAccountId,
  onSelectAccount,
  onOpenCompose,
  onOpenAddAccount,
  onOpenNotifications,
  onOpenCodemagic,
  onToggleStar,
  onMarkRead,
  onMoveFolder,
  unreadMap,
  totalUnread,
}) => {
  const [currentTab, setCurrentTab] = useState<'inbox' | 'accounts' | 'alerts'>('inbox');
  const [selectedMobileEmailId, setSelectedMobileEmailId] = useState<string | null>(null);
  const [showAccountDrawer, setShowAccountDrawer] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
  const [activeMobileFolder, setActiveMobileFolder] = useState('inbox');

  const activeAccount = accounts.find((a) => a.id === activeAccountId);
  const selectedEmail = emails.find((e) => e.id === selectedMobileEmailId);

  // Filter emails for mobile
  let filtered = emails;
  if (activeAccountId !== 'unified') {
    filtered = filtered.filter((e) => e.accountId === activeAccountId);
  }
  if (activeMobileFolder === 'starred') {
    filtered = filtered.filter((e) => e.isStarred);
  } else {
    filtered = filtered.filter((e) => e.folder === activeMobileFolder);
  }
  if (mobileSearch.trim()) {
    const q = mobileSearch.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.subject.toLowerCase().includes(q) ||
        e.from.name.toLowerCase().includes(q) ||
        e.snippet.toLowerCase().includes(q)
    );
  }

  return (
    <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 overflow-y-auto">
      {/* Mobile Device Mockup (iPhone 16 Pro styling) */}
      <div className="w-[390px] h-[812px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-700/80 flex flex-col relative overflow-hidden">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500/80 animate-pulse" />
        </div>

        {/* Mobile Screen Container */}
        <div className="flex-1 bg-slate-950 rounded-[40px] flex flex-col overflow-hidden text-slate-200 relative">
          {/* iOS Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs font-semibold text-slate-300 select-none">
            <span>9:41</span>
            <div className="flex items-center space-x-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[10px]">5G</span>
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content based on active state */}
          {selectedEmail ? (
            /* Email Detail Screen */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <button
                  onClick={() => setSelectedMobileEmailId(null)}
                  className="flex items-center text-xs font-semibold text-blue-400"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleStar(selectedEmail.id)}
                    className="p-1 rounded text-slate-400"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        selectedEmail.isStarred
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-400'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => {
                      onMoveFolder(selectedEmail.id, 'trash');
                      setSelectedMobileEmailId(null);
                    }}
                    className="p-1 rounded text-slate-400"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {selectedEmail.subject}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                      {selectedEmail.from.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        {selectedEmail.from.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {selectedEmail.from.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed pt-2 border-t border-slate-800/80">
                  {selectedEmail.body}
                </div>
              </div>
            </div>
          ) : currentTab === 'inbox' ? (
            /* Main Inboxes Screen */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Mobile Header with Account Dropdown */}
              <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/80">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowAccountDrawer(true)}
                    className="flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                  >
                    {activeAccountId === 'unified' ? (
                      <Layers className="w-4 h-4 text-blue-400" />
                    ) : (
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: activeAccount?.color }}
                      />
                    )}
                    <span className="text-xs font-bold text-white max-w-[170px] truncate">
                      {activeAccountId === 'unified'
                        ? 'Unified (10+)'
                        : activeAccount?.displayName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={onOpenNotifications}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onOpenCodemagic}
                      className="p-1.5 rounded-lg text-cyan-400"
                      title="Codemagic"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile Search Input */}
                <div className="mt-2 relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={mobileSearch}
                    onChange={(e) => setMobileSearch(e.target.value)}
                    placeholder="Search all 10+ business inboxes..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mobile Folders Quick Row */}
              <div className="flex gap-1 px-4 py-2 border-b border-slate-800/80 overflow-x-auto scrollbar-none text-[11px]">
                {['inbox', 'starred', 'sent', 'invoices', 'client_vip'].map((fId) => {
                  const fObj = folders.find((f) => f.id === fId);
                  const isAct = activeMobileFolder === fId;
                  return (
                    <button
                      key={fId}
                      onClick={() => setActiveMobileFolder(fId)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                        isAct
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fObj?.name || fId}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Email Stream */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No emails in this view.
                  </div>
                ) : (
                  filtered.map((em) => {
                    const acc = accounts.find((a) => a.id === em.accountId);
                    return (
                      <div
                        key={em.id}
                        onClick={() => {
                          setSelectedMobileEmailId(em.id);
                          if (!em.isRead) onMarkRead(em.id, true);
                        }}
                        className="p-2.5 rounded-xl transition cursor-pointer hover:bg-slate-900"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-1.5 min-w-0">
                            {!em.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            )}
                            <span
                              className={`text-xs truncate ${
                                !em.isRead ? 'font-bold text-white' : 'text-slate-300'
                              }`}
                            >
                              {em.from.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(em.date).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        {/* Mobile Account tag */}
                        {acc && (
                          <div className="flex items-center space-x-1 mb-1">
                            <span
                              className="text-[9px] font-semibold px-1.5 py-0.2 rounded truncate max-w-[180px]"
                              style={{
                                backgroundColor: `${acc.color}20`,
                                color: acc.color,
                              }}
                            >
                              {acc.displayName}
                            </span>
                          </div>
                        )}

                        <div className="text-xs text-slate-200 font-medium truncate">
                          {em.subject}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {em.snippet}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : currentTab === 'accounts' ? (
            /* Accounts List Screen */
            <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white">Connected Inboxes</h3>
                <button
                  onClick={onOpenAddAccount}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      onSelectAccount(acc.id);
                      setCurrentTab('inbox');
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0"
                        style={{ backgroundColor: acc.color }}
                      >
                        {acc.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {acc.displayName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {acc.email}
                        </div>
                      </div>
                    </div>
                    {unreadMap[acc.id] > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                        {unreadMap[acc.id]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Settings & Packaging Tab */
            <div className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
              <h3 className="text-sm font-bold text-white">App &amp; Cloud Settings</h3>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">Codemagic.io Packaging</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Export YAML &amp; deploy your Expo React Native build to Google Play and Apple App Store.
                </p>
                <button
                  onClick={onOpenCodemagic}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition"
                >
                  Open Codemagic Hub
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">Per-Inbox Push Engine</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Configure background push notification frequencies for each of the {accounts.length} inboxes.
                </p>
                <button
                  onClick={onOpenNotifications}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                >
                  Manage Push Alerts
                </button>
              </div>
            </div>
          )}

          {/* Floating Mobile Compose Button */}
          {!selectedEmail && (
            <button
              onClick={onOpenCompose}
              className="absolute bottom-16 right-4 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 cursor-pointer active:scale-95 transition"
              aria-label="Compose New Email"
            >
              <PenSquare className="w-5 h-5" />
            </button>
          )}

          {/* Mobile Bottom Tab Bar */}
          <div className="h-14 border-t border-slate-800 bg-slate-900/90 flex items-center justify-around px-2 text-slate-400 select-none">
            <button
              onClick={() => {
                setSelectedMobileEmailId(null);
                setCurrentTab('inbox');
              }}
              className={`flex flex-col items-center space-y-0.5 text-[10px] ${
                currentTab === 'inbox' ? 'text-blue-400 font-bold' : ''
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Inboxes</span>
            </button>

            <button
              onClick={() => setCurrentTab('accounts')}
              className={`flex flex-col items-center space-y-0.5 text-[10px] ${
                currentTab === 'accounts' ? 'text-blue-400 font-bold' : ''
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Accounts ({accounts.length})</span>
            </button>

            <button
              onClick={() => setCurrentTab('alerts')}
              className={`flex flex-col items-center space-y-0.5 text-[10px] ${
                currentTab === 'alerts' ? 'text-blue-400 font-bold' : ''
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Build / Config</span>
            </button>
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="h-4 flex items-center justify-center bg-slate-900 pb-1">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>

        {/* Mobile Account Switcher Sheet / Drawer */}
        {showAccountDrawer && (
          <div className="absolute inset-0 z-50 bg-black/60 flex flex-col justify-end">
            <div className="bg-slate-900 rounded-t-3xl border-t border-slate-800 p-4 max-h-[70%] flex flex-col space-y-2">
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-2" />
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Switch Business Account</span>
                <button
                  onClick={() => setShowAccountDrawer(false)}
                  className="text-xs text-blue-400"
                >
                  Done
                </button>
              </div>

              <div className="overflow-y-auto space-y-1 flex-1 py-1">
                <button
                  onClick={() => {
                    onSelectAccount('unified');
                    setShowAccountDrawer(false);
                  }}
                  className={`w-full p-2 rounded-xl flex items-center justify-between text-left ${
                    activeAccountId === 'unified'
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs font-semibold">Unified (All {accounts.length} Inboxes)</span>
                  </div>
                  {totalUnread > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                      {totalUnread}
                    </span>
                  )}
                </button>

                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      onSelectAccount(acc.id);
                      setShowAccountDrawer(false);
                    }}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-left ${
                      activeAccountId === acc.id
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: acc.color }}
                      />
                      <span className="text-xs font-medium truncate">{acc.displayName}</span>
                    </div>
                    {activeAccountId === acc.id && (
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
