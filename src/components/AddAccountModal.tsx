import React, { useState } from 'react';
import { Account, AccountCategory } from '../types/mail';
import {
  X,
  Plus,
  ShieldCheck,
  Server,
  Bell,
  Palette,
  Key,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: Account) => void;
  existingCount: number;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
  existingCount,
}) => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<AccountCategory>('Sales');
  const [protocol, setProtocol] = useState<'Gmail' | 'Google Workspace' | 'Custom IMAP' | 'Exchange'>('Google Workspace');
  const [serverHost, setServerHost] = useState('imap.gmail.com');
  const [color, setColor] = useState('#2563EB');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifyPriorityOnly, setNotifyPriorityOnly] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [signature, setSignature] = useState('');
  const [authMethod, setAuthMethod] = useState<'app_password' | 'direct_token'>('app_password');

  if (!isOpen) return null;

  const colorPalette = [
    { name: 'Royal Blue', hex: '#2563EB', bg: 'bg-blue-600' },
    { name: 'Emerald', hex: '#059669', bg: 'bg-emerald-600' },
    { name: 'Amber Gold', hex: '#D97706', bg: 'bg-amber-600' },
    { name: 'Purple Violet', hex: '#7C3AED', bg: 'bg-purple-600' },
    { name: 'Vibrant Pink', hex: '#EC4899', bg: 'bg-pink-600' },
    { name: 'Teal Cyan', hex: '#0891B2', bg: 'bg-cyan-600' },
    { name: 'Crimson Red', hex: '#DC2626', bg: 'bg-red-600' },
    { name: 'Deep Indigo', hex: '#4F46E5', bg: 'bg-indigo-600' },
    { name: 'Slate Gray', hex: '#475569', bg: 'bg-slate-600' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !displayName.trim()) return;

    const initials = displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');

    const newAccount: Account = {
      id: `acc-${Date.now()}`,
      email: email.trim(),
      displayName: displayName.trim(),
      businessName: businessName.trim() || displayName.trim(),
      category,
      color,
      avatarBg: colorPalette.find((c) => c.hex === color)?.bg || 'bg-blue-600',
      initials: initials || email.substring(0, 2).toUpperCase(),
      unreadCount: 0,
      notificationsEnabled,
      notifyPriorityOnly,
      soundEnabled,
      protocol,
      serverHost,
      signature: signature.trim() || `Best regards,\n${displayName}`,
    };

    onAddAccount(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">
                Add Connected Business Account #{existingCount + 1}
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Unlimited Accounts
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Connect Gmail, Google Workspace, or custom domain business inbox.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. europe.orders@company.com"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Display Name & Business Entity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. EU Operations Desk"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Company / Unit Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Europe Logistics"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category & Protocol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AccountCategory)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Executive">Executive</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Client Inbox">Client Inbox</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Provider Protocol
              </label>
              <select
                value={protocol}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setProtocol(val);
                  if (val === 'Gmail' || val === 'Google Workspace') {
                    setServerHost('imap.gmail.com');
                  } else if (val === 'Exchange') {
                    setServerHost('outlook.office365.com');
                  } else {
                    setServerHost('mail.yourdomain.com');
                  }
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Google Workspace">Google Workspace (Business)</option>
                <option value="Gmail">Standard Gmail</option>
                <option value="Custom IMAP">Custom IMAP / SMTP Host</option>
                <option value="Exchange">Microsoft 365 / Exchange</option>
              </select>
            </div>
          </div>

          {/* Color Identification */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              Inbox Color Badge (for instant identification in Unified stream)
            </label>
            <div className="flex flex-wrap gap-2">
              {colorPalette.map((cp) => (
                <button
                  type="button"
                  key={cp.hex}
                  onClick={() => setColor(cp.hex)}
                  className={`w-7 h-7 rounded-lg transition transform ${
                    color === cp.hex ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: cp.hex }}
                  title={cp.name}
                  aria-label={cp.name}
                />
              ))}
            </div>
          </div>

          {/* Push Notifications Configuration for THIS specific inbox */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Push Notifications for this Inbox</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {notificationsEnabled && (
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyPriorityOnly}
                    onChange={(e) => setNotifyPriorityOnly(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>VIP / Priority mail only</span>
                </label>

                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Audio chime alert</span>
                </label>
              </div>
            )}
          </div>

          {/* Default Signature */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custom Email Signature
            </label>
            <textarea
              rows={2}
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="e.g. European Sales Desk | Apex Ventures\neu.sales@apexventures.com"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
