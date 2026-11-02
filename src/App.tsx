import React, { useState, useEffect } from 'react';
import { Account, Email, Folder, AppNotificationConfig, NotificationItem, EmailAttachment } from './types/mail';
import { INITIAL_ACCOUNTS, INITIAL_FOLDERS, INITIAL_EMAILS } from './data/initialAccounts';
import {
  filterEmails,
  calculateUnreadCounts,
  moveEmail,
  toggleStar,
  markEmailRead,
  shouldTriggerPushNotification,
  createNotificationFromEmail,
} from './utils/mailManager';
import { MobileCollapsibleSidebar } from './components/MobileCollapsibleSidebar';
import { ComposeModal } from './components/ComposeModal';
import { AddAccountModal } from './components/AddAccountModal';
import { AddFolderModal } from './components/AddFolderModal';
import { NotificationsModal } from './components/NotificationsModal';
import { CodemagicModal } from './components/CodemagicModal';
import { CODEMAGIC_YAML, EXPO_APP_JSON } from './data/codemagicTemplates';
import {
  Menu,
  Search,
  RefreshCw,
  Inbox,
  Layers,
  Folder as FolderIcon,
  Bell,
  Smartphone,
  PenSquare,
  Star,
  Paperclip,
  Check,
  ChevronLeft,
  Trash2,
  Archive,
  Reply,
  Forward,
  FolderInput,
  Send,
  Plus,
  ShieldCheck,
  Tag,
  Copy,
  Download,
  ExternalLink,
  Wifi,
  Battery,
  X,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // State with LocalStorage persistence
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('omnimail_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('omnimail_folders');
    return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
  });

  const [emails, setEmails] = useState<Email[]>(() => {
    const saved = localStorage.getItem('omnimail_emails');
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });

  const [notificationConfig, setNotificationConfig] = useState<AppNotificationConfig>(() => {
    const saved = localStorage.getItem('omnimail_notif_config');
    return saved
      ? JSON.parse(saved)
      : {
          globalEnabled: true,
          browserPermission: (typeof window !== 'undefined' && 'Notification' in window)
            ? Notification.permission
            : 'default',
          soundEnabled: true,
          quietHours: false,
          quietHoursStart: '22:00',
          quietHoursEnd: '07:00',
        };
  });

  const [notificationLog, setNotificationLog] = useState<NotificationItem[]>([]);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  // Mobile App Navigation
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'inbox' | 'accounts' | 'folders' | 'alerts' | 'codemagic'>('inbox');
  const [activeAccountId, setActiveAccountId] = useState<string>('unified');
  const [activeFolderId, setActiveFolderId] = useState<string>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filterQuickTag, setFilterQuickTag] = useState<'all' | 'unread' | 'vip' | 'invoices'>('all');

  // Modals
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isCodemagicModalOpen, setIsCodemagicModalOpen] = useState(false);

  // Compose prefill
  const [composeInitial, setComposeInitial] = useState<{
    to?: string;
    subject?: string;
    body?: string;
  }>({});

  // Quick reply text in mobile detail
  const [quickReplyText, setQuickReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  // Copy feedback in Codemagic tab
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('omnimail_accounts', JSON.stringify(accounts));
  }, [accounts]);
  useEffect(() => {
    localStorage.setItem('omnimail_folders', JSON.stringify(folders));
  }, [folders]);
  useEffect(() => {
    localStorage.setItem('omnimail_emails', JSON.stringify(emails));
  }, [emails]);
  useEffect(() => {
    localStorage.setItem('omnimail_notif_config', JSON.stringify(notificationConfig));
  }, [notificationConfig]);

  // Derived counts
  const { accountCounts, totalUnread } = calculateUnreadCounts(emails, accounts);
  const activeAccount = accounts.find((a) => a.id === activeAccountId);
  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || null;
  const selectedEmailAccount = selectedEmail
    ? accounts.find((a) => a.id === selectedEmail.accountId)
    : undefined;

  // Filter emails
  let emailList = filterEmails(
    emails,
    activeAccountId,
    activeFolderId,
    searchQuery,
    selectedLabel
  );

  // Quick filter chips
  if (filterQuickTag === 'unread') {
    emailList = emailList.filter((e) => !e.isRead);
  } else if (filterQuickTag === 'vip') {
    emailList = emailList.filter((e) => e.priority === 'high' || e.labels.includes('VIP Clients'));
  } else if (filterQuickTag === 'invoices') {
    emailList = emailList.filter(
      (e) => e.folder === 'invoices' || e.labels.includes('Invoices & Billing')
    );
  }

  const allLabels = Array.from(new Set(emails.flatMap((e) => e.labels)));

  // Sound alert
  const playSound = () => {
    if (!notificationConfig.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio fallback
    }
  };

  const triggerNotification = (email: Email, account: Account) => {
    if (!notificationConfig.globalEnabled) return;
    const item = createNotificationFromEmail(email, account);

    setNotificationLog((prev) => [item, ...prev].slice(0, 50));
    setActiveToast(item);
    playSound();

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`[${account.displayName}] ${email.from.name}`, {
        body: email.subject,
        icon: '/vite.svg',
      });
    }

    setTimeout(() => {
      setActiveToast((current) => (current?.id === item.id ? null : current));
    }, 4500);
  };

  // Sync simulation
  const handleSyncInboxes = () => {
    const targetAcc = accounts[Math.floor(Math.random() * accounts.length)];
    const sampleSubjects = [
      'Signed Master Services Agreement & SLA attached',
      'Wire Transfer Receipt Confirmation ($42,500.00 USD)',
      'Scheduled Technical Integration Review (Thursday)',
      'New Customer Lead Request from Enterprise Tier',
      'High-Volume Traffic Audit: 750,000 Visitors Processed',
    ];
    const newMail: Email = {
      id: `mail-sync-${Date.now()}`,
      accountId: targetAcc.id,
      from: { name: 'Acme Global Strategic Partners', email: 'director@acmepartners.com' },
      to: [targetAcc.email],
      subject: sampleSubjects[Math.floor(Math.random() * sampleSubjects.length)],
      snippet: 'Please find our team comments and signature for the active contract...',
      body: `Hi,\n\nOur leadership team has reviewed the terms and provided approval.\n\nLooking forward to working together.\n\nBest regards,\nAcme Global Direct`,
      date: new Date().toISOString(),
      isRead: false,
      isStarred: false,
      isArchived: false,
      folder: 'inbox',
      labels: ['VIP Clients', 'Inquiries'],
      priority: 'high',
    };

    setEmails((prev) => [newMail, ...prev]);
    if (shouldTriggerPushNotification(newMail, targetAcc, notificationConfig.quietHours)) {
      triggerNotification(newMail, targetAcc);
    }
  };

  const handleToggleStar = (emailId: string) => {
    setEmails((prev) => toggleStar(prev, emailId));
  };

  const handleMarkRead = (emailId: string, isRead: boolean) => {
    setEmails((prev) => markEmailRead(prev, emailId, isRead));
  };

  const handleMoveFolder = (emailId: string, targetFolder: string) => {
    setEmails((prev) => moveEmail(prev, emailId, targetFolder));
  };

  const handleQuickReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail || !quickReplyText.trim()) return;
    const acc = accounts.find((a) => a.id === selectedEmail.accountId) || accounts[0];

    const replyEmail: Email = {
      id: `reply-${Date.now()}`,
      accountId: acc.id,
      from: { name: acc.displayName, email: acc.email },
      to: [selectedEmail.from.email],
      subject: `Re: ${selectedEmail.subject}`,
      snippet: quickReplyText.substring(0, 90),
      body: `${quickReplyText}\n\n---\nOn ${new Date(selectedEmail.date).toLocaleDateString()}, ${selectedEmail.from.name} wrote:\n${selectedEmail.body}`,
      date: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      isArchived: false,
      folder: 'sent',
      labels: ['Reply'],
      priority: 'normal',
    };

    setEmails((prev) => [replyEmail, ...prev]);
    setQuickReplyText('');
    setReplySuccess(true);
    setTimeout(() => setReplySuccess(false), 3000);
  };

  const handleCopyCode = (text: string, key: string) => {
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
    <div className="min-h-screen w-screen bg-slate-950 flex items-center justify-center font-sans text-slate-100 select-none overflow-hidden">
      {/* Mobile Shell Container (Max width for mobile format, 100% height) */}
      <div className="w-full max-w-md h-screen bg-slate-950 border-x border-slate-800/80 flex flex-col relative overflow-hidden shadow-2xl">
        {/* iOS-Style Mobile Status Bar */}
        <div className="pt-2.5 px-5 pb-1 flex items-center justify-between text-xs font-semibold text-slate-400 select-none bg-slate-950 z-20">
          <span>9:41</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold text-emerald-400">EXPO</span>
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[10px]">5G</span>
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile Header Bar */}
        <header className="h-13 px-4 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* Hamburger Button for Collapsible Sidebar */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Open collapsible sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Account Title & Active Context */}
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                {activeAccountId === 'unified' ? (
                  <span className="text-xs font-bold text-white truncate">
                    All Inboxes ({accounts.length})
                  </span>
                ) : (
                  <>
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: activeAccount?.color }}
                    />
                    <span className="text-xs font-bold text-white truncate">
                      {activeAccount?.displayName}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {activeAccountId === 'unified' ? 'Unified Stream' : activeAccount?.email}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-1 shrink-0">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isSearchOpen ? 'text-blue-400 bg-slate-800' : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Sync inboxes */}
            <button
              onClick={handleSyncInboxes}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Sync Inboxes & Check Alerts"
              aria-label="Sync Inboxes & Check Alerts"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Account Quick Switcher Avatar */}
            <button
              onClick={() => setActiveTab('accounts')}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm ml-1 cursor-pointer"
              style={{
                backgroundColor: activeAccountId === 'unified' ? '#2563EB' : activeAccount?.color,
              }}
              aria-label="Switch account"
              title="Switch account"
            >
              {activeAccountId === 'unified' ? 'Ω' : activeAccount?.initials}
            </button>
          </div>
        </header>

        {/* Search Bar Collapsible */}
        {isSearchOpen && (
          <div className="p-3 bg-slate-900 border-b border-slate-800 animate-in slide-in-from-top-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 10+ accounts..."
                className="w-full pl-8 pr-8 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Body View based on selection or active tab */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {/* If reading an email, show mobile reading view */}
          {selectedEmail ? (
            <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
              {/* Detail Navigation Toolbar */}
              <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <button
                  onClick={() => setSelectedEmailId(null)}
                  className="flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 mr-0.5" />
                  Back
                </button>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleToggleStar(selectedEmail.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition cursor-pointer"
                    aria-label="Star email"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        selectedEmail.isStarred ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => {
                      handleMoveFolder(selectedEmail.id, 'archive');
                      setSelectedEmailId(null);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                    aria-label="Archive email"
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      handleMoveFolder(selectedEmail.id, 'trash');
                      setSelectedEmailId(null);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    aria-label="Delete email"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
                {/* Account Tag Pill */}
                {selectedEmailAccount && (
                  <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: selectedEmailAccount.color }}
                    />
                    <div className="text-[11px] truncate">
                      <span className="text-slate-400">Account: </span>
                      <span className="font-semibold text-white">
                        {selectedEmailAccount.displayName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <h1 className="text-sm font-bold text-white leading-snug">
                    {selectedEmail.subject}
                  </h1>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {selectedEmail.labels.map((lbl) => (
                      <span
                        key={lbl}
                        className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sender info */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                      {selectedEmail.from.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1">
                        {selectedEmail.from.name}
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {selectedEmail.from.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(selectedEmail.date).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                {/* Body */}
                <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedEmail.body}
                </div>

                {/* Attachments */}
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                      Attachments ({selectedEmail.attachments.length})
                    </div>
                    {selectedEmail.attachments.map((att, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                      >
                        <span className="truncate text-slate-300">{att.name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {att.size}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Reply Form */}
                <div className="pt-2">
                  <form onSubmit={handleQuickReplySubmit} className="space-y-2">
                    <textarea
                      rows={3}
                      value={quickReplyText}
                      onChange={(e) => setQuickReplyText(e.target.value)}
                      placeholder={`Reply as ${selectedEmailAccount?.email || 'this account'}...`}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />

                    <div className="flex items-center justify-between">
                      {replySuccess ? (
                        <span className="text-[11px] font-semibold text-emerald-400">
                          Reply sent via SMTP!
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          Signature auto-attached
                        </span>
                      )}

                      <button
                        type="submit"
                        disabled={!quickReplyText.trim()}
                        className="px-4 py-1.5 rounded-lg bg-blue-600 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" /> Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : activeTab === 'inbox' ? (
            /* TAB 1: INBOX STREAM */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Quick Filter Chips */}
              <div className="flex gap-1.5 px-3 py-2 border-b border-slate-800/80 bg-slate-900/40 overflow-x-auto scrollbar-none text-[11px]">
                <button
                  onClick={() => setFilterQuickTag('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                    filterQuickTag === 'all'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({emails.length})
                </button>

                <button
                  onClick={() => setFilterQuickTag('unread')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                    filterQuickTag === 'unread'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Unread ({totalUnread})
                </button>

                <button
                  onClick={() => setFilterQuickTag('vip')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                    filterQuickTag === 'vip'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  ⭐ VIP Priority
                </button>

                <button
                  onClick={() => setFilterQuickTag('invoices')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                    filterQuickTag === 'invoices'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  💼 Invoices
                </button>
              </div>

              {/* Email rows list */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 scrollbar-thin scrollbar-thumb-slate-800">
                {emailList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No emails matching this filter.
                  </div>
                ) : (
                  emailList.map((email) => {
                    const acc = accounts.find((a) => a.id === email.accountId);

                    return (
                      <div
                        key={email.id}
                        onClick={() => {
                          setSelectedEmailId(email.id);
                          if (!email.isRead) handleMarkRead(email.id, true);
                        }}
                        className={`p-3 rounded-xl transition cursor-pointer mb-1 ${
                          !email.isRead
                            ? 'bg-slate-900/90 border-l-4 border-emerald-500 hover:bg-slate-800/70'
                            : 'hover:bg-slate-900/50 border-l-4 border-transparent'
                        }`}
                      >
                        {/* Top: Sender & Time */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-1.5 min-w-0">
                            {!email.isRead && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            )}
                            <span
                              className={`text-xs truncate ${
                                !email.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'
                              }`}
                            >
                              {email.from.name}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
                            <span>
                              {new Date(email.date).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStar(email.id);
                              }}
                              className="p-1 hover:text-amber-400 transition"
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  email.isStarred
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-500'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Account Badge Pill */}
                        {acc && (
                          <div className="flex items-center space-x-1 mb-1">
                            <span
                              className="text-[9px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[200px]"
                              style={{
                                backgroundColor: `${acc.color}20`,
                                color: acc.color,
                              }}
                            >
                              {acc.displayName}
                            </span>
                            {email.priority === 'high' && (
                              <span className="text-[8px] font-bold uppercase tracking-wider px-1 rounded bg-rose-500/20 text-rose-400">
                                Priority
                              </span>
                            )}
                          </div>
                        )}

                        {/* Subject */}
                        <div
                          className={`text-xs mb-0.5 line-clamp-1 ${
                            !email.isRead ? 'font-semibold text-slate-100' : 'text-slate-300'
                          }`}
                        >
                          {email.subject}
                        </div>

                        {/* Snippet */}
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {email.snippet}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : activeTab === 'accounts' ? (
            /* TAB 2: ACCOUNTS MANAGER (10+ ACCOUNTS) */
            <div className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Connected Business Inboxes ({accounts.length})
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Switch active account or manage credentials
                  </p>
                </div>
                <button
                  onClick={() => setIsAddAccountOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add #{accounts.length + 1}
                </button>
              </div>

              {/* All Inboxes Master Option */}
              <button
                onClick={() => {
                  setActiveAccountId('unified');
                  setActiveTab('inbox');
                }}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition ${
                  activeAccountId === 'unified'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Unified Multi-Inbox</div>
                    <div className="text-[10px] opacity-80">Stream all {accounts.length} accounts</div>
                  </div>
                </div>
                {totalUnread > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-blue-700">
                    {totalUnread}
                  </span>
                )}
              </button>

              {/* Individual Accounts Cards */}
              <div className="space-y-2">
                {accounts.map((acc) => {
                  const isCurrent = activeAccountId === acc.id;
                  const unread = accountCounts[acc.id] || 0;

                  return (
                    <div
                      key={acc.id}
                      onClick={() => {
                        setActiveAccountId(acc.id);
                        setActiveTab('inbox');
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0"
                          style={{ backgroundColor: acc.color }}
                        >
                          {acc.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold truncate">{acc.displayName}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              {acc.category}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {acc.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {unread > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                            {unread}
                          </span>
                        )}
                        {isCurrent && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'folders' ? (
            /* TAB 3: FOLDERS & LABELS */
            <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Folders &amp; Organization
                </h3>
                <button
                  onClick={() => setIsAddFolderOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Folder
                </button>
              </div>

              {/* System Folders */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Core Folders</span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {folders.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setActiveFolderId(f.id);
                        setSelectedLabel(null);
                        setActiveTab('inbox');
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition cursor-pointer ${
                        activeFolderId === f.id && !selectedLabel
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <span>{f.name}</span>
                      {f.color && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: f.color }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Labels */}
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Business Labels ({allLabels.length})
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {allLabels.map((lbl) => (
                    <button
                      key={lbl}
                      onClick={() => {
                        setSelectedLabel(selectedLabel === lbl ? null : lbl);
                        setActiveTab('inbox');
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                        selectedLabel === lbl
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{lbl}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'alerts' ? (
            /* TAB 4: PUSH NOTIFICATIONS ENGINE */
            <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Push Notifications Engine
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Independent notification rules for each of your {accounts.length} inboxes
                  </p>
                </div>
                <button
                  onClick={() => setIsNotificationsModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
                >
                  Configure
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Browser &amp; Native Push</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400">
                    Status: {notificationConfig.browserPermission}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Every connected inbox has its own push dispatch rules. Tap below to trigger a live incoming test push notification.
                </p>
                <button
                  onClick={handleSyncInboxes}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Trigger Instant Test Push Alert
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Recent Dispatches ({notificationLog.length})
                </span>
                {notificationLog.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl">
                    No push alerts yet. Click 'Trigger Instant Test Push' above.
                  </div>
                ) : (
                  notificationLog.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{notif.senderName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-slate-300 truncate">{notif.subject}</div>
                      <div className="text-[10px] text-cyan-400 font-mono">
                        → {notif.accountEmail}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* TAB 5: CODEMAGIC.IO CI/CD PACKAGING HUB */
            <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Codemagic.io CI/CD Packaging
                  </h3>
                </div>
                <a
                  href="https://codemagic.io"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 flex items-center gap-1 font-semibold"
                >
                  codemagic.io <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-500/30 space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Everything Pre-Configured for Codemagic
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Both <code className="text-cyan-400 font-mono">codemagic.yaml</code> and <code className="text-emerald-400 font-mono">app.json</code> have been written to your project root.
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleCopyCode(CODEMAGIC_YAML, 'yaml')}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'yaml' ? 'Copied YAML!' : 'Copy codemagic.yaml'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadFile('codemagic.yaml', CODEMAGIC_YAML)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-md shadow-cyan-600/20 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Codemagic 4-Step Build Flow */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Automated Build Pipeline
                </span>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-center leading-5 text-[10px]">
                      1
                    </span>
                    Push Code to GitHub / GitLab
                  </div>
                  <p className="text-[11px] text-slate-400 pl-7">
                    Repository contains <code className="text-slate-300 font-mono">codemagic.yaml</code> and <code className="text-slate-300 font-mono">app.json</code>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-center leading-5 text-[10px]">
                      2
                    </span>
                    Connect App in Codemagic.io
                  </div>
                  <p className="text-[11px] text-slate-400 pl-7">
                    Sign in to codemagic.io, choose React Native / Expo, select repo.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-center leading-5 text-[10px]">
                      3
                    </span>
                    Start Cloud Build
                  </div>
                  <p className="text-[11px] text-slate-400 pl-7">
                    Codemagic executes <code className="text-cyan-400 font-mono">npx expo prebuild</code> and Gradle/Xcode compiles APK, AAB &amp; IPA.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-center leading-5 text-[10px]">
                      4
                    </span>
                    Receive Binaries via Email
                  </div>
                  <p className="text-[11px] text-slate-400 pl-7">
                    Artifacts are published and emailed directly to <code className="text-emerald-400">buybesttraffic@gmail.com</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Floating Action Button (FAB) for composing new email */}
          {!selectedEmail && (
            <button
              onClick={() => {
                setComposeInitial({});
                setIsComposeOpen(true);
              }}
              className="absolute bottom-4 right-4 w-13 h-13 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl shadow-blue-600/50 cursor-pointer active:scale-95 transition z-20"
              aria-label="Compose new business email"
            >
              <PenSquare className="w-5 h-5" />
            </button>
          )}
        </main>

        {/* Native Mobile Bottom Navigation Bar */}
        <nav className="h-14 border-t border-slate-800/80 bg-slate-900/95 flex items-center justify-around px-2 z-30 shrink-0 select-none">
          {/* Tab 1: Inboxes */}
          <button
            onClick={() => {
              setSelectedEmailId(null);
              setActiveTab('inbox');
            }}
            className={`flex flex-col items-center space-y-0.5 text-[10px] font-medium transition cursor-pointer relative ${
              activeTab === 'inbox' && !selectedEmail ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Inbox className="w-5 h-5" />
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-2 px-1 text-[8px] font-bold rounded-full bg-blue-600 text-white">
                  {totalUnread}
                </span>
              )}
            </div>
            <span>Inboxes</span>
          </button>

          {/* Tab 2: Accounts (10+) */}
          <button
            onClick={() => {
              setSelectedEmailId(null);
              setActiveTab('accounts');
            }}
            className={`flex flex-col items-center space-y-0.5 text-[10px] font-medium transition cursor-pointer relative ${
              activeTab === 'accounts' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Layers className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 px-1 text-[8px] font-bold rounded-full bg-slate-700 text-slate-200">
                {accounts.length}
              </span>
            </div>
            <span>Accounts</span>
          </button>

          {/* Tab 3: Folders */}
          <button
            onClick={() => {
              setSelectedEmailId(null);
              setActiveTab('folders');
            }}
            className={`flex flex-col items-center space-y-0.5 text-[10px] font-medium transition cursor-pointer ${
              activeTab === 'folders' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderIcon className="w-5 h-5" />
            <span>Folders</span>
          </button>

          {/* Tab 4: Push Alerts */}
          <button
            onClick={() => {
              setSelectedEmailId(null);
              setActiveTab('alerts');
            }}
            className={`flex flex-col items-center space-y-0.5 text-[10px] font-medium transition cursor-pointer relative ${
              activeTab === 'alerts' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span>Alerts</span>
          </button>

          {/* Tab 5: Codemagic Packaging Hub */}
          <button
            onClick={() => {
              setSelectedEmailId(null);
              setActiveTab('codemagic');
            }}
            className={`flex flex-col items-center space-y-0.5 text-[10px] font-medium transition cursor-pointer ${
              activeTab === 'codemagic' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400">Codemagic</span>
          </button>
        </nav>

        {/* Home Indicator Bar */}
        <div className="h-4 flex items-center justify-center bg-slate-900/95 pb-1 select-none">
          <div className="w-32 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Slide-over Mobile Collapsible Sidebar */}
      <MobileCollapsibleSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        accounts={accounts}
        activeAccountId={activeAccountId}
        onSelectAccount={(accId) => {
          setActiveAccountId(accId);
          setSelectedEmailId(null);
          setActiveTab('inbox');
        }}
        folders={folders}
        activeFolderId={activeFolderId}
        onSelectFolder={(fId) => {
          setActiveFolderId(fId);
          setSelectedEmailId(null);
          setActiveTab('inbox');
        }}
        onOpenAddAccount={() => setIsAddAccountOpen(true)}
        onOpenAddFolder={() => setIsAddFolderOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenCodemagic={() => {
          setActiveTab('codemagic');
        }}
        selectedLabel={selectedLabel}
        onSelectLabel={(lbl) => {
          setSelectedLabel(lbl);
          setActiveTab('inbox');
        }}
        availableLabels={allLabels}
        unreadMap={accountCounts}
        totalUnread={totalUnread}
      />

      {/* Floating Push Notification Banner Toast */}
      {activeToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92%] bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-3.5 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                  New Push Alert
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {activeToast.accountEmail}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-200 truncate pl-9">
            {activeToast.senderName}: {activeToast.subject}
          </div>
        </div>
      )}

      {/* Modals */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        accounts={accounts}
        activeAccountId={activeAccountId}
        initialTo={composeInitial.to}
        initialSubject={composeInitial.subject}
        initialBody={composeInitial.body}
        onSend={(data) => {
          const sender = accounts.find((a) => a.id === data.accountId) || accounts[0];
          const sent: Email = {
            id: `sent-${Date.now()}`,
            accountId: data.accountId,
            from: { name: sender.displayName, email: sender.email },
            to: data.to,
            subject: data.subject,
            snippet: data.body.substring(0, 80) + '...',
            body: data.body,
            date: new Date().toISOString(),
            isRead: true,
            isStarred: false,
            isArchived: false,
            folder: 'sent',
            labels: data.labels,
            attachments: data.attachments,
            priority: data.priority,
          };
          setEmails((prev) => [sent, ...prev]);
          setSelectedEmailId(sent.id);
        }}
      />

      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onAddAccount={(newAcc) => {
          setAccounts((prev) => [...prev, newAcc]);
          setActiveAccountId(newAcc.id);
        }}
        existingCount={accounts.length}
      />

      <AddFolderModal
        isOpen={isAddFolderOpen}
        onClose={() => setIsAddFolderOpen(false)}
        onAddFolder={(newFld) => {
          setFolders((prev) => [...prev, newFld]);
          setActiveFolderId(newFld.id);
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        accounts={accounts}
        config={notificationConfig}
        onUpdateConfig={(up) => setNotificationConfig((p) => ({ ...p, ...up }))}
        onUpdateAccountNotification={(accId, up) => {
          setAccounts((prev) =>
            prev.map((a) => (a.id === accId ? { ...a, ...up } : a))
          );
        }}
        onTriggerTestPush={(accId) => {
          const acc = accounts.find((a) => a.id === accId);
          if (!acc) return;
          const testEmail: Email = {
            id: `push-${Date.now()}`,
            accountId: acc.id,
            from: { name: 'VIP Executive Lead', email: 'lead@enterprise.org' },
            to: [acc.email],
            subject: `Urgent RFP Response for ${acc.businessName}`,
            snippet: 'Please verify the integration nodes...',
            body: 'Incoming push notification test verification.',
            date: new Date().toISOString(),
            isRead: false,
            isStarred: true,
            isArchived: false,
            folder: 'inbox',
            labels: ['VIP Clients'],
            priority: 'high',
          };
          setEmails((prev) => [testEmail, ...prev]);
          triggerNotification(testEmail, acc);
        }}
        notificationLog={notificationLog}
      />

      <CodemagicModal
        isOpen={isCodemagicModalOpen}
        onClose={() => setIsCodemagicModalOpen(false)}
      />
    </div>
  );
}
