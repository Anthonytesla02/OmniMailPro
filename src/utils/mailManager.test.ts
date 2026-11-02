import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterEmails,
  calculateUnreadCounts,
  moveEmail,
  toggleStar,
  markEmailRead,
  shouldTriggerPushNotification,
} from './mailManager';
import { Account, Email } from '../types/mail';

const mockAccounts: Account[] = [
  {
    id: 'acc-1',
    email: 'ceo@techscale.io',
    displayName: 'Alex Rivers (CEO)',
    businessName: 'TechScale Holdings',
    category: 'Executive',
    color: '#3B82F6',
    avatarBg: 'bg-blue-600',
    initials: 'AR',
    unreadCount: 1,
    notificationsEnabled: true,
    notifyPriorityOnly: false,
    soundEnabled: true,
    protocol: 'Google Workspace',
    serverHost: 'imap.gmail.com',
    signature: 'Best regards,\nAlex Rivers',
  },
  {
    id: 'acc-2',
    email: 'sales@techscale.io',
    displayName: 'TechScale Sales',
    businessName: 'TechScale Sales Team',
    category: 'Sales',
    color: '#10B981',
    avatarBg: 'bg-emerald-600',
    initials: 'TS',
    unreadCount: 1,
    notificationsEnabled: true,
    notifyPriorityOnly: true, // Only high priority
    soundEnabled: false,
    protocol: 'Gmail',
    serverHost: 'imap.gmail.com',
    signature: 'TechScale Sales Dept',
  },
];

const mockEmails: Email[] = [
  {
    id: 'email-1',
    accountId: 'acc-1',
    from: { name: 'Acme Investor', email: 'investor@acme.com' },
    to: ['ceo@techscale.io'],
    subject: 'Series B Term Sheet Review',
    snippet: 'Attached is the signed document for review...',
    body: 'Attached is the signed document for review by end of week.',
    date: '2026-11-01T10:00:00Z',
    isRead: false,
    isStarred: true,
    isArchived: false,
    folder: 'inbox',
    labels: ['Investor', 'Urgent'],
    priority: 'high',
  },
  {
    id: 'email-2',
    accountId: 'acc-2',
    from: { name: 'Prospect Lead', email: 'contact@prospect.co' },
    to: ['sales@techscale.io'],
    subject: 'Demo Request for 500 Seats',
    snippet: 'We would love to schedule a custom walkthrough...',
    body: 'We would love to schedule a custom walkthrough this Wednesday.',
    date: '2026-11-01T09:30:00Z',
    isRead: false,
    isStarred: false,
    isArchived: false,
    folder: 'inbox',
    labels: ['Leads'],
    priority: 'normal',
  },
  {
    id: 'email-3',
    accountId: 'acc-1',
    from: { name: 'TechScale Billing', email: 'billing@techscale.io' },
    to: ['ceo@techscale.io'],
    subject: 'Monthly Cloud Infrastructure Statement',
    snippet: 'Your invoice for October 2026 is ready...',
    body: 'Your invoice for October 2026 is ready to download.',
    date: '2026-10-31T15:00:00Z',
    isRead: true,
    isStarred: false,
    isArchived: false,
    folder: 'inbox',
    labels: ['Finance'],
    priority: 'low',
  },
];

test('filterEmails filters by unified vs specific account', () => {
  const unified = filterEmails(mockEmails, 'unified', 'inbox');
  assert.equal(unified.length, 3);

  const acc1Only = filterEmails(mockEmails, 'acc-1', 'inbox');
  assert.equal(acc1Only.length, 2);

  const acc2Only = filterEmails(mockEmails, 'acc-2', 'inbox');
  assert.equal(acc2Only.length, 1);
});

test('filterEmails filters by search query across subject and snippet', () => {
  const searchResults = filterEmails(mockEmails, 'unified', 'inbox', 'Term Sheet');
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].id, 'email-1');
});

test('filterEmails filters starred items', () => {
  const starred = filterEmails(mockEmails, 'unified', 'starred');
  assert.equal(starred.length, 1);
  assert.equal(starred[0].id, 'email-1');
});

test('calculateUnreadCounts calculates per-account and total unread correctly', () => {
  const { accountCounts, totalUnread } = calculateUnreadCounts(mockEmails, mockAccounts);
  assert.equal(totalUnread, 2);
  assert.equal(accountCounts['acc-1'], 1);
  assert.equal(accountCounts['acc-2'], 1);
});

test('moveEmail and toggleStar update mail state properly', () => {
  const moved = moveEmail(mockEmails, 'email-1', 'trash');
  assert.equal(moved.find((e) => e.id === 'email-1')?.folder, 'trash');

  const starred = toggleStar(mockEmails, 'email-2');
  assert.equal(starred.find((e) => e.id === 'email-2')?.isStarred, true);

  const read = markEmailRead(mockEmails, 'email-1', true);
  assert.equal(read.find((e) => e.id === 'email-1')?.isRead, true);
});

test('shouldTriggerPushNotification respects account notification preferences', () => {
  // acc-1 allows all inbox unread notifications
  assert.equal(shouldTriggerPushNotification(mockEmails[0], mockAccounts[0]), true);

  // acc-2 only allows high priority
  assert.equal(shouldTriggerPushNotification(mockEmails[1], mockAccounts[1]), false); // normal priority

  // Quiet hours should suppress all
  assert.equal(shouldTriggerPushNotification(mockEmails[0], mockAccounts[0], true), false);
});
