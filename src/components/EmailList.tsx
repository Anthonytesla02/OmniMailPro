import React from 'react';
import { Account, Email } from '../types/mail';
import {
  Star,
  Paperclip,
  CheckCircle,
  Clock,
  Archive,
  Trash2,
  Mail,
  MailOpen,
  AlertCircle,
  Tag,
  RefreshCw
} from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  accounts: Account[];
  selectedEmailId: string | null;
  onSelectEmail: (emailId: string) => void;
  onToggleStar: (emailId: string) => void;
  onMarkRead: (emailId: string, isRead: boolean) => void;
  onMoveFolder: (emailId: string, folder: string) => void;
  activeFolderTitle: string;
  isUnified: boolean;
  onRefresh: () => void;
}

export const EmailList: React.FC<EmailListProps> = ({
  emails,
  accounts,
  selectedEmailId,
  onSelectEmail,
  onToggleStar,
  onMarkRead,
  onMoveFolder,
  activeFolderTitle,
  isUnified,
  onRefresh,
}) => {
  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  const formatEmailDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-96 bg-slate-900 border-r border-slate-800/80 flex flex-col h-full text-slate-200">
      {/* Header bar */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-white capitalize">
              {activeFolderTitle}
            </h2>
            <span className="text-[11px] font-semibold text-slate-400 px-1.5 py-0.5 rounded-full bg-slate-800">
              {emails.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isUnified ? 'Combined stream across all active accounts' : 'Filtered inbox'}
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Sync & Check Inboxes"
          aria-label="Sync & Check Inboxes"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Email rows list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 scrollbar-thin scrollbar-thumb-slate-800">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 h-full">
            <Mail className="w-10 h-10 mb-2 stroke-1 text-slate-600" />
            <p className="text-xs font-semibold text-slate-400">No messages in this folder</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
              You are all caught up! New emails received will automatically appear here.
            </p>
          </div>
        ) : (
          emails.map((email) => {
            const isSelected = selectedEmailId === email.id;
            const account = accountMap.get(email.accountId);

            return (
              <div
                key={email.id}
                onClick={() => {
                  onSelectEmail(email.id);
                  if (!email.isRead) {
                    onMarkRead(email.id, true);
                  }
                }}
                className={`p-3 transition cursor-pointer relative group ${
                  isSelected
                    ? 'bg-blue-600/15 border-l-4 border-blue-500'
                    : !email.isRead
                    ? 'bg-slate-900/90 hover:bg-slate-800/70 border-l-4 border-emerald-500'
                    : 'hover:bg-slate-800/50 border-l-4 border-transparent'
                }`}
              >
                {/* Top line: Sender & Time & Star */}
                <div className="flex items-center justify-between gap-1 mb-1">
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

                  <div className="flex items-center space-x-1 shrink-0 text-slate-400">
                    <span className="text-[10px] text-slate-400">
                      {formatEmailDate(email.date)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(email.id);
                      }}
                      className="p-0.5 rounded hover:text-amber-400 transition"
                      aria-label={email.isStarred ? 'Unstar' : 'Star'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          email.isStarred
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-500 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Account Badge Pill (Crucial for 10+ accounts multi-inbox!) */}
                {account && (
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-xs truncate max-w-[220px]"
                      style={{
                        backgroundColor: `${account.color}18`,
                        borderColor: `${account.color}40`,
                        color: account.color,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: account.color }}
                      />
                      <span className="truncate">{account.email}</span>
                    </span>

                    {email.priority === 'high' && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Priority
                      </span>
                    )}
                  </div>
                )}

                {/* Subject */}
                <div
                  className={`text-xs mb-1 line-clamp-1 ${
                    !email.isRead ? 'font-semibold text-slate-100' : 'text-slate-300'
                  }`}
                >
                  {email.subject}
                </div>

                {/* Snippet */}
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {email.snippet}
                </div>

                {/* Labels & Attachment Indicators */}
                <div className="flex items-center justify-between mt-2 pt-1">
                  <div className="flex items-center space-x-1 overflow-hidden">
                    {email.labels.slice(0, 2).map((lbl) => (
                      <span
                        key={lbl}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium truncate max-w-[90px]"
                      >
                        {lbl}
                      </span>
                    ))}
                    {email.labels.length > 2 && (
                      <span className="text-[9px] text-slate-400">
                        +{email.labels.length - 2}
                      </span>
                    )}
                  </div>

                  {email.attachments && email.attachments.length > 0 && (
                    <div className="flex items-center space-x-1 text-[10px] text-slate-400 shrink-0">
                      <Paperclip className="w-3 h-3 text-slate-400" />
                      <span>{email.attachments.length}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
