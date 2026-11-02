export type AccountCategory = 
  | 'Executive'
  | 'Sales'
  | 'Support'
  | 'Finance'
  | 'Marketing'
  | 'Operations'
  | 'Client Inbox'
  | 'Personal';

export interface Account {
  id: string;
  email: string;
  displayName: string;
  businessName: string;
  category: AccountCategory;
  color: string; // Tailwind hex or css color
  avatarBg: string;
  initials: string;
  unreadCount: number;
  isPrimary?: boolean;
  notificationsEnabled: boolean;
  notifyPriorityOnly: boolean;
  soundEnabled: boolean;
  protocol: 'Gmail' | 'Google Workspace' | 'Custom IMAP' | 'Exchange';
  serverHost: string;
  signature: string;
}

export interface Folder {
  id: string;
  name: string;
  iconName: string;
  isSystem: boolean;
  color?: string;
  accountId?: string; // Optional: account specific or global
}

export interface EmailAttachment {
  name: string;
  size: string;
  type: 'pdf' | 'img' | 'doc' | 'sheet' | 'zip';
}

export interface Email {
  id: string;
  accountId: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: string[];
  subject: string;
  snippet: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  folder: string; // 'inbox' | 'starred' | 'sent' | 'drafts' | 'archive' | 'spam' | 'trash' | custom folder id
  labels: string[];
  attachments?: EmailAttachment[];
  priority: 'high' | 'normal' | 'low';
}

export interface NotificationItem {
  id: string;
  accountId: string;
  accountEmail: string;
  emailId: string;
  senderName: string;
  subject: string;
  snippet: string;
  timestamp: string;
  isRead: boolean;
}

export interface AppNotificationConfig {
  globalEnabled: boolean;
  browserPermission: 'default' | 'granted' | 'denied';
  soundEnabled: boolean;
  quietHours: boolean;
  quietHoursStart: string; // '22:00'
  quietHoursEnd: string; // '07:00'
}
