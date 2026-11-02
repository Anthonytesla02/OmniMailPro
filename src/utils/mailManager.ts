import { Account, Email, Folder, NotificationItem } from '../types/mail';

export function filterEmails(
  emails: Email[],
  activeAccountId: string,
  activeFolderId: string,
  searchQuery: string = '',
  selectedLabel: string | null = null
): Email[] {
  let list = emails;

  // Account filter: 'unified' means all accounts
  if (activeAccountId !== 'unified') {
    list = list.filter((e) => e.accountId === activeAccountId);
  }

  // Folder filter
  if (activeFolderId === 'starred') {
    list = list.filter((e) => e.isStarred && e.folder !== 'trash');
  } else if (activeFolderId === 'unread') {
    list = list.filter((e) => !e.isRead && e.folder === 'inbox');
  } else {
    list = list.filter((e) => e.folder === activeFolderId);
  }

  // Label filter if selected
  if (selectedLabel) {
    list = list.filter((e) => e.labels.includes(selectedLabel));
  }

  // Search query filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (e) =>
        e.subject.toLowerCase().includes(q) ||
        e.from.name.toLowerCase().includes(q) ||
        e.from.email.toLowerCase().includes(q) ||
        e.snippet.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        e.labels.some((l) => l.toLowerCase().includes(q))
    );
  }

  // Sort by date descending (newest first)
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function calculateUnreadCounts(
  emails: Email[],
  accounts: Account[]
): { accountCounts: Record<string, number>; totalUnread: number } {
  const accountCounts: Record<string, number> = {};
  for (const acc of accounts) {
    accountCounts[acc.id] = 0;
  }

  let totalUnread = 0;
  for (const email of emails) {
    if (!email.isRead && email.folder === 'inbox') {
      accountCounts[email.accountId] = (accountCounts[email.accountId] || 0) + 1;
      totalUnread++;
    }
  }

  return { accountCounts, totalUnread };
}

export function moveEmail(
  emails: Email[],
  emailId: string,
  targetFolder: string
): Email[] {
  return emails.map((e) =>
    e.id === emailId
      ? {
          ...e,
          folder: targetFolder,
          isArchived: targetFolder === 'archive',
        }
      : e
  );
}

export function toggleStar(emails: Email[], emailId: string): Email[] {
  return emails.map((e) =>
    e.id === emailId ? { ...e, isStarred: !e.isStarred } : e
  );
}

export function markEmailRead(
  emails: Email[],
  emailId: string,
  isRead: boolean
): Email[] {
  return emails.map((e) =>
    e.id === emailId ? { ...e, isRead } : e
  );
}

export function batchMarkRead(
  emails: Email[],
  emailIds: string[],
  isRead: boolean
): Email[] {
  const set = new Set(emailIds);
  return emails.map((e) => (set.has(e.id) ? { ...e, isRead } : e));
}

export function shouldTriggerPushNotification(
  email: Email,
  account: Account,
  isQuietHours: boolean = false
): boolean {
  if (isQuietHours) return false;
  if (!account.notificationsEnabled) return false;
  if (email.folder !== 'inbox') return false;
  if (email.isRead) return false;
  if (account.notifyPriorityOnly && email.priority !== 'high') return false;
  return true;
}

export function createNotificationFromEmail(
  email: Email,
  account: Account
): NotificationItem {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    accountId: account.id,
    accountEmail: account.email,
    emailId: email.id,
    senderName: email.from.name,
    subject: email.subject,
    snippet: email.snippet,
    timestamp: new Date().toISOString(),
    isRead: false,
  };
}
