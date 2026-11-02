import React, { useState } from 'react';
import { Account, EmailAttachment } from '../types/mail';
import {
  X,
  Send,
  Paperclip,
  Sparkles,
  ChevronDown,
  Trash2,
  FileText,
  AlertCircle,
  Tag
} from 'lucide-react';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  activeAccountId: string;
  initialTo?: string;
  initialSubject?: string;
  initialBody?: string;
  onSend: (emailData: {
    accountId: string;
    to: string[];
    subject: string;
    body: string;
    priority: 'high' | 'normal' | 'low';
    labels: string[];
    attachments: EmailAttachment[];
  }) => void;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  accounts,
  activeAccountId,
  initialTo = '',
  initialSubject = '',
  initialBody = '',
  onSend,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState(
    activeAccountId !== 'unified' ? activeAccountId : (accounts[0]?.id || '')
  );
  const [toInput, setToInput] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [priority, setPriority] = useState<'high' | 'normal' | 'low'>('normal');
  const [labelInput, setLabelInput] = useState('Outreach');
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  if (!isOpen) return null;

  const currentAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const templates = [
    {
      id: 'invoice',
      name: 'Invoice Notice & Receipt',
      subject: 'Invoice & Statement of Work - Apex Ventures',
      body: `Hello,\n\nPlease find attached the commercial invoice and statement of deliverables for the current billing cycle.\n\nSummary:\n- Term: Monthly Retainer\n- Status: Pending Wire Confirmation\n\nLet us know once the transfer is scheduled.\n\nBest regards,\n${currentAccount?.signature || ''}`,
    },
    {
      id: 'proposal',
      name: 'Enterprise Proposal',
      subject: 'Apex Ventures Partnership & Integration Proposal',
      body: `Hi team,\n\nFollowing up on our strategy discussion, I have prepared our enterprise partnership proposal for Q4/Q1.\n\nKey highlights:\n1. Dedicated account manager & 24/7 SLA\n2. Real-time API telemetry & high-volume processing\n3. Flexible custom invoicing\n\nWhen would be a good time to review next steps?\n\nSincerely,\n${currentAccount?.signature || ''}`,
    },
    {
      id: 'support',
      name: 'Support Resolution',
      subject: 'Apex Support: Case #7841 Resolved',
      body: `Hello,\n\nOur engineering team has confirmed that the configuration adjustment is deployed and verified.\n\nPlease test your endpoint and let us know if you need any additional assistance.\n\nThank you,\n${currentAccount?.signature || ''}`,
    },
    {
      id: 'traffic',
      name: 'Ad Traffic Confirmation',
      subject: 'BuyBestTraffic: Delivery & Targeting Confirmation',
      body: `Hello,\n\nYour ad traffic campaign has been synchronized across all Tier-1 distribution nodes.\n\nReal-time telemetry and postback tracking are now operational.\n\nCheers,\n${currentAccount?.signature || ''}`,
    },
  ];

  const handleApplyTemplate = (tmplId: string) => {
    const tmpl = templates.find((t) => t.id === tmplId);
    if (!tmpl) return;
    setSubject(tmpl.subject);
    setBody(tmpl.body);
    setSelectedTemplate(tmplId);
  };

  const handleAddSampleAttachment = () => {
    const samples: EmailAttachment[] = [
      { name: 'Commercial_Agreement_Apex.pdf', size: '1.4 MB', type: 'pdf' },
      { name: 'Q4_Financial_Statement.xlsx', size: '820 KB', type: 'sheet' },
      { name: 'Deliverables_Checklist.pdf', size: '480 KB', type: 'pdf' },
    ];
    const item = samples[attachments.length % samples.length];
    setAttachments([...attachments, item]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toInput.trim() || !subject.trim() || !body.trim()) return;

    const toList = toInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSend({
      accountId: selectedAccountId,
      to: toList,
      subject,
      body,
      priority,
      labels: labelInput ? [labelInput] : [],
      attachments,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-white">New Business Email</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Multi-Account Dispatch
            </span>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {/* Send From: Critical multi-account selector! */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-slate-400 w-16 shrink-0">
              From:
            </label>
            <div className="relative flex-1">
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 appearance-none font-medium cursor-pointer"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.displayName} — {acc.email} ({acc.category})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Recipient To */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-slate-400 w-16 shrink-0">
              To:
            </label>
            <input
              type="text"
              required
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              placeholder="client@company.com, partner@biz.com"
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Quick Business Templates selector */}
          <div className="flex items-center space-x-2 pt-1">
            <label className="text-xs font-semibold text-slate-400 w-16 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Template:
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1 scrollbar-none">
              {templates.map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.id}
                  onClick={() => handleApplyTemplate(tmpl.id)}
                  className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border transition whitespace-nowrap cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-slate-400 w-16 shrink-0">
              Subject:
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Business Subject Line..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {/* Meta bar: Priority & Label */}
          <div className="flex items-center space-x-4 pl-18 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Priority:</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="normal">Normal</option>
                <option value="high">High (VIP Alert)</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Tag:</span>
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="e.g. Invoices, Clients"
                className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] rounded-lg px-2 py-1 w-28 focus:outline-none"
              />
            </div>
          </div>

          {/* Message Body */}
          <div className="pt-1">
            <textarea
              required
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email here..."
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
            />
          </div>

          {/* Attachments list if any */}
          {attachments.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold text-slate-400">
                Attached Files ({attachments.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>{att.name}</span>
                    <span className="text-[10px] text-slate-500">({att.size})</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400 transition ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer controls */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleAddSampleAttachment}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attach File</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send via {currentAccount?.protocol || 'Google'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
