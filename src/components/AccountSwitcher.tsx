import React, { useState } from 'react';
import { Account, AccountCategory } from '../types/mail';
import { 
  Inbox, 
  Plus, 
  Bell, 
  BellOff, 
  Check, 
  ChevronRight, 
  Layers,
  Search,
  SlidersHorizontal,
  MailCheck
} from 'lucide-react';

interface AccountSwitcherProps {
  accounts: Account[];
  activeAccountId: string;
  onSelectAccount: (accountId: string) => void;
  onOpenAddAccount: () => void;
  onOpenNotifications: () => void;
  unreadMap: Record<string, number>;
  totalUnread: number;
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
  accounts,
  activeAccountId,
  onSelectAccount,
  onOpenAddAccount,
  onOpenNotifications,
  unreadMap,
  totalUnread,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: AccountCategory[] = [
    'Executive',
    'Sales',
    'Support',
    'Finance',
    'Marketing',
    'Operations',
    'Client Inbox',
  ];

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch = 
      acc.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || acc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-200 select-none">
      {/* Brand & Workspace Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg">
            Ω
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              OmniMail Pro
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                10+ Multi
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Business Inbox Cloud</p>
          </div>
        </div>

        <button
          onClick={onOpenNotifications}
          aria-label="Push notifications settings"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition relative"
          title="Push Notifications Hub"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Unified All Inboxes Pill */}
      <div className="p-3 pb-1">
        <button
          onClick={() => onSelectAccount('unified')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition text-left group ${
            activeAccountId === 'unified'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
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
                All {accounts.length} business accounts
              </div>
            </div>
          </div>

          {totalUnread > 0 && (
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
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

      {/* Quick Search & Filter Bar */}
      <div className="px-3 pt-2 pb-1 space-y-1.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search accounts or emails..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2 py-0.5 rounded-md whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-slate-700 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All ({accounts.length})
          </button>
          {categories.map((cat) => {
            const count = accounts.filter((a) => a.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-md whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Accounts List */}
      <div className="flex-1 overflow-y-auto px-3 py-1.5 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Connected Accounts ({filteredAccounts.length})
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live Sync
          </span>
        </div>

        {filteredAccounts.map((account) => {
          const isActive = activeAccountId === account.id;
          const unread = unreadMap[account.id] || 0;

          return (
            <button
              key={account.id}
              onClick={() => onSelectAccount(account.id)}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition text-left group ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                {/* Account Avatar with Color Accent */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white relative shrink-0 shadow-sm"
                  style={{ backgroundColor: account.color }}
                >
                  {account.initials}
                  {account.notificationsEnabled ? (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                  ) : (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-slate-500 border-2 border-slate-900" />
                  )}
                </div>

                {/* Account Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-semibold truncate block">
                      {account.displayName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {account.email}
                  </div>
                </div>
              </div>

              {/* Badges / Unread */}
              <div className="flex items-center space-x-1.5 shrink-0 pl-1">
                {unread > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {unread}
                  </span>
                )}
                {isActive && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Actions: Add Account & Sync Status */}
      <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/40">
        <button
          onClick={onOpenAddAccount}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Account #{accounts.length + 1}</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
          <span className="flex items-center gap-1.5">
            <MailCheck className="w-3.5 h-3.5 text-emerald-400" />
            All Inboxes Monitored
          </span>
          <span className="text-slate-500 font-mono text-[10px]">v1.4 PRO</span>
        </div>
      </div>
    </div>
  );
};
