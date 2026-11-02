import React, { useState } from 'react';
import { Account, Folder } from '../types/mail';
import {
  X,
  Layers,
  Inbox,
  Star,
  Send,
  FileText,
  Archive,
  AlertOctagon,
  Trash2,
  Folder as FolderIcon,
  Receipt,
  Crown,
  FileCheck,
  TrendingUp,
  Plus,
  Bell,
  Smartphone,
  Search,
  Check,
  Tag,
  ChevronDown,
  MailCheck
} from 'lucide-react';

interface MobileCollapsibleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  activeAccountId: string;
  onSelectAccount: (accountId: string) => void;
  folders: Folder[];
  activeFolderId: string;
  onSelectFolder: (folderId: string) => void;
  onOpenAddAccount: () => void;
  onOpenAddFolder: () => void;
  onOpenNotifications: () => void;
  onOpenCodemagic: () => void;
  selectedLabel: string | null;
  onSelectLabel: (label: string | null) => void;
  availableLabels: string[];
  unreadMap: Record<string, number>;
  totalUnread: number;
}

export const MobileCollapsibleSidebar: React.FC<MobileCollapsibleSidebarProps> = ({
  isOpen,
  onClose,
  accounts,
  activeAccountId,
  onSelectAccount,
  folders,
  activeFolderId,
  onSelectFolder,
  onOpenAddAccount,
  onOpenAddFolder,
  onOpenNotifications,
  onOpenCodemagic,
  selectedLabel,
  onSelectLabel,
  availableLabels,
  unreadMap,
  totalUnread,
}) => {
  const [accountSearch, setAccountSearch] = useState('');
  const [showAccountsSection, setShowAccountsSection] = useState(true);
  const [showFoldersSection, setShowFoldersSection] = useState(true);
  const [showLabelsSection, setShowLabelsSection] = useState(false);

  if (!isOpen) return null;

  const renderIcon = (iconName: string, color?: string) => {
    const props = { className: 'w-4 h-4', style: color ? { color } : undefined };
    switch (iconName) {
      case 'Inbox':
        return <Inbox {...props} />;
      case 'Star':
        return <Star {...props} />;
      case 'Send':
        return <Send {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'Archive':
        return <Archive {...props} />;
      case 'AlertOctagon':
        return <AlertOctagon {...props} />;
      case 'Trash2':
        return <Trash2 {...props} />;
      case 'Receipt':
        return <Receipt {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      case 'FileCheck':
        return <FileCheck {...props} />;
      case 'TrendingUp':
        return <TrendingUp {...props} />;
      default:
        return <FolderIcon {...props} />;
    }
  };

  const filteredAccounts = accounts.filter(
    (a) =>
      a.displayName.toLowerCase().includes(accountSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(accountSearch.toLowerCase())
  );

  const systemFolders = folders.filter((f) => f.isSystem);
  const customFolders = folders.filter((f) => !f.isSystem);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-250">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-500/20">
              Ω
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                OmniMail Pro
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {accounts.length} Inboxes
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Mobile Business Suite</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unified Multi-Inbox Card */}
        <div className="p-3 pb-1">
          <button
            onClick={() => {
              onSelectAccount('unified');
              onClose();
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left ${
              activeAccountId === 'unified'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  activeAccountId === 'unified'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-500/20 text-indigo-400'
                }`}
              >
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">Unified Multi-Inbox</div>
                <div
                  className={`text-[10px] ${
                    activeAccountId === 'unified' ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  All {accounts.length} Inboxes Combined
                </div>
              </div>
            </div>

            {totalUnread > 0 && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeAccountId === 'unified'
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {totalUnread}
              </span>
            )}
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Section 1: Connected Business Accounts (10+) */}
          <div>
            <div
              className="flex items-center justify-between px-1 py-1 cursor-pointer select-none text-slate-400 hover:text-slate-200"
              onClick={() => setShowAccountsSection(!showAccountsSection)}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Connected Accounts ({accounts.length})
              </span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAddAccount();
                    onClose();
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title="Add Account"
                >
                  <Plus className="w-3 h-3 text-blue-400" />
                </button>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    showAccountsSection ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {showAccountsSection && (
              <div className="space-y-1 mt-1">
                {/* Search input for accounts */}
                <div className="relative mb-2">
                  <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={accountSearch}
                    onChange={(e) => setAccountSearch(e.target.value)}
                    placeholder="Filter accounts..."
                    className="w-full pl-7 pr-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {filteredAccounts.map((acc) => {
                  const isActive = activeAccountId === acc.id;
                  const unread = unreadMap[acc.id] || 0;

                  return (
                    <button
                      key={acc.id}
                      onClick={() => {
                        onSelectAccount(acc.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                        isActive
                          ? 'bg-slate-800 text-white border border-slate-700'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: acc.color }}
                        >
                          {acc.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate">
                            {acc.displayName}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {acc.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        {unread > 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400">
                            {unread}
                          </span>
                        )}
                        {isActive && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    onOpenAddAccount();
                    onClose();
                  }}
                  className="w-full py-1.5 px-2 mt-1 border border-dashed border-slate-800 hover:border-slate-700 rounded-xl text-[11px] font-medium text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-3 h-3 text-blue-400" />
                  <span>Connect Account #{accounts.length + 1}</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Standard Folders */}
          <div>
            <div
              className="flex items-center justify-between px-1 py-1 cursor-pointer select-none text-slate-400 hover:text-slate-200"
              onClick={() => setShowFoldersSection(!showFoldersSection)}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Mail Folders
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showFoldersSection ? 'rotate-180' : ''
                }`}
              />
            </div>

            {showFoldersSection && (
              <div className="space-y-0.5 mt-1">
                {systemFolders.map((f) => {
                  const isActive = activeFolderId === f.id && !selectedLabel;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        onSelectLabel(null);
                        onSelectFolder(f.id);
                        onClose();
                      }}
                      className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {renderIcon(f.iconName)}
                      <span>{f.name}</span>
                    </button>
                  );
                })}

                {/* Custom Business Folders */}
                <div className="pt-2">
                  <div className="flex items-center justify-between px-2 pb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Business Folders
                    </span>
                    <button
                      onClick={() => {
                        onOpenAddFolder();
                        onClose();
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Add Custom Folder"
                    >
                      <Plus className="w-3 h-3 text-blue-400" />
                    </button>
                  </div>

                  {customFolders.map((cf) => {
                    const isActive = activeFolderId === cf.id && !selectedLabel;
                    return (
                      <button
                        key={cf.id}
                        onClick={() => {
                          onSelectLabel(null);
                          onSelectFolder(cf.id);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                          isActive
                            ? 'bg-blue-600/15 text-blue-400 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {renderIcon(cf.iconName, cf.color)}
                          <span>{cf.name}</span>
                        </div>
                        {cf.color && (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cf.color }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Labels */}
          {availableLabels.length > 0 && (
            <div>
              <div
                className="flex items-center justify-between px-1 py-1 cursor-pointer select-none text-slate-400 hover:text-slate-200"
                onClick={() => setShowLabelsSection(!showLabelsSection)}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Labels ({availableLabels.length})
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    showLabelsSection ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {showLabelsSection && (
                <div className="space-y-0.5 mt-1">
                  {availableLabels.map((lbl) => {
                    const isSelected = selectedLabel === lbl;
                    return (
                      <button
                        key={lbl}
                        onClick={() => {
                          onSelectLabel(isSelected ? null : lbl);
                          onClose();
                        }}
                        className={`w-full flex items-center space-x-2 px-2.5 py-1 rounded-lg text-xs transition text-left ${
                          isSelected
                            ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <Tag className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{lbl}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Bottom Quick Action Tools */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-2">
          <button
            onClick={() => {
              onOpenCodemagic();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 hover:border-cyan-400 transition"
          >
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">Codemagic.io CI/CD</div>
                <div className="text-[10px] text-slate-400">Package APK, AAB &amp; iOS IPA</div>
              </div>
            </div>
            <span className="text-xs text-cyan-400 font-bold">→</span>
          </button>

          <button
            onClick={() => {
              onOpenNotifications();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition text-slate-300"
          >
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold">Push Notifications Hub</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <div className="flex items-center justify-between pt-1 px-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <MailCheck className="w-3 h-3" /> All {accounts.length} Inboxes Synced
            </span>
            <span className="font-mono">v1.5 Expo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
