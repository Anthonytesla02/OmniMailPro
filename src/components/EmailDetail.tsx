import React, { useState } from 'react';
import { Account, Email, Folder } from '../types/mail';
import {
  Reply,
  Forward,
  Star,
  Archive,
  Trash2,
  Tag,
  Paperclip,
  Download,
  FolderInput,
  Clock,
  Send,
  Check,
  ChevronDown,
  Mail,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface EmailDetailProps {
  email: Email | null;
  account: Account | undefined;
  folders: Folder[];
  onReply: (toEmail: string, subject: string, originalBody: string) => void;
  onForward: (subject: string, originalBody: string) => void;
  onToggleStar: (emailId: string) => void;
  onMoveFolder: (emailId: string, folderId: string) => void;
  onDeleteEmail: (emailId: string) => void;
  onArchiveEmail: (emailId: string) => void;
  onQuickSendReply: (emailId: string, replyText: string) => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({
  email,
  account,
  folders,
  onReply,
  onForward,
  onToggleStar,
  onMoveFolder,
  onDeleteEmail,
  onArchiveEmail,
  onQuickSendReply,
}) => {
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [quickReplyText, setQuickReplyText] = useState('');
  const [replySentFeedback, setReplySentFeedback] = useState(false);

  if (!email) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-400">
          <Mail className="w-8 h-8 stroke-1" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300">No message selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Select an email from your multi-account inboxes to read details, reply, manage folders, or inspect attachments.
        </p>
      </div>
    );
  }

  const handleSendQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReplyText.trim()) return;
    onQuickSendReply(email.id, quickReplyText);
    setQuickReplyText('');
    setReplySentFeedback(true);
    setTimeout(() => setReplySentFeedback(false), 3000);
  };

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full text-slate-200 overflow-hidden">
      {/* Top action toolbar */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onReply(email.from.email, `Re: ${email.subject}`, email.body)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition cursor-pointer"
          >
            <Reply className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>

          <button
            onClick={() => onForward(`Fwd: ${email.subject}`, email.body)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            <Forward className="w-3.5 h-3.5" />
            <span>Forward</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Move to Folder dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFolderDropdown(!showFolderDropdown)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
              title="Organize into Folder"
            >
              <FolderInput className="w-3.5 h-3.5 text-slate-400" />
              <span>Move</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showFolderDropdown && (
              <div className="absolute left-0 mt-1 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">
                  Move to Folder
                </div>
                {folders.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onMoveFolder(email.id, f.id);
                      setShowFolderDropdown(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-800 transition ${
                      email.folder === f.id ? 'text-blue-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span>{f.name}</span>
                    {email.folder === f.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onArchiveEmail(email.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            title="Archive"
            aria-label="Archive email"
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDeleteEmail(email.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
            title="Move to Trash"
            aria-label="Delete email"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right side status / star */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleStar(email.id)}
            className="p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title={email.isStarred ? 'Starred' : 'Star message'}
            aria-label={email.isStarred ? 'Starred' : 'Star message'}
          >
            <Star
              className={`w-4 h-4 ${
                email.isStarred
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main message pane */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Account Destination banner */}
        {account && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: account.color }}
              />
              <div className="text-xs">
                <span className="text-slate-400">Received on: </span>
                <span className="font-semibold text-white">{account.displayName}</span>
                <span className="text-slate-400 font-mono text-[11px] ml-1.5">
                  ({account.email})
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {account.protocol}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {account.category}
              </span>
            </div>
          </div>
        )}

        {/* Subject & Labels */}
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight leading-snug">
            {email.subject}
          </h1>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {email.labels.map((lbl) => (
              <span
                key={lbl}
                className="inline-flex items-center space-x-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
              >
                <Tag className="w-3 h-3 text-slate-400" />
                <span>{lbl}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Sender details card */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-md">
              {email.from.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-semibold text-white">{email.from.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="DKIM & SPF Verified" />
              </div>
              <div className="text-xs text-slate-400">
                From: <span className="text-slate-300 font-mono">{email.from.email}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                To: {email.to.join(', ')}
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <div>{new Date(email.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {email.body}
        </div>

        {/* Attachments Section */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-blue-400" />
                Attachments ({email.attachments.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {email.attachments.map((att, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-200 truncate">
                        {att.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{att.size}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Mock downloading attachment: ${att.name}`);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    title="Download"
                    aria-label={`Download ${att.name}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Inline Reply */}
        <div className="pt-2">
          <form
            onSubmit={handleSendQuickReply}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Reply className="w-3.5 h-3.5 text-blue-400" />
                Quick Reply as <strong className="text-white">{account?.email || 'Active Account'}</strong>
              </span>
              {account?.signature && (
                <span className="text-[10px] text-slate-400">
                  Signature attached automatically
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={quickReplyText}
              onChange={(e) => setQuickReplyText(e.target.value)}
              placeholder="Write a fast business reply..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />

            <div className="flex items-center justify-between pt-1">
              {replySentFeedback ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Reply dispatched via {account?.protocol || 'SMTP'}!
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Press Send to dispatch reply</span>
              )}

              <button
                type="submit"
                disabled={!quickReplyText.trim()}
                className="flex items-center space-x-1.5 py-1.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reply</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
