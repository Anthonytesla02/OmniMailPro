import { Account, Email, Folder } from '../types/mail';

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    email: 'ceo@apexventures.com',
    displayName: 'Alex Rivers (Founder & CEO)',
    businessName: 'Apex Ventures Holding',
    category: 'Executive',
    color: '#2563EB', // Blue
    avatarBg: 'bg-blue-600',
    initials: 'AR',
    unreadCount: 2,
    isPrimary: true,
    notificationsEnabled: true,
    notifyPriorityOnly: false,
    soundEnabled: true,
    protocol: 'Google Workspace',
    serverHost: 'imap.gmail.com',
    signature: 'Alex Rivers | Founder & CEO\nApex Ventures Holding\nDirect: +1 (555) 234-8890',
  },
  {
    id: 'acc-2',
    email: 'sales@apexventures.com',
    displayName: 'Apex Sales Operations',
    businessName: 'Apex Ventures Sales',
    category: 'Sales',
    color: '#059669', // Emerald
    avatarBg: 'bg-emerald-600',
    initials: 'SO',
    unreadCount: 3,
    notificationsEnabled: true,
    notifyPriorityOnly: false,
    soundEnabled: true,
    protocol: 'Google Workspace',
    serverHost: 'imap.gmail.com',
    signature: 'Enterprise Sales Team\nApex Ventures\nsales@apexventures.com',
  },
  {
    id: 'acc-3',
    email: 'support@apexventures.com',
    displayName: 'Customer Support Desk',
    businessName: 'Apex Helpdesk Tier 2',
    category: 'Support',
    color: '#D97706', // Amber
    avatarBg: 'bg-amber-600',
    initials: 'SD',
    unreadCount: 1,
    notificationsEnabled: true,
    notifyPriorityOnly: false,
    soundEnabled: true,
    protocol: 'Gmail',
    serverHost: 'imap.gmail.com',
    signature: 'Apex Customer Care\nsupport@apexventures.com\n24/7 Priority Support',
  },
  {
    id: 'acc-4',
    email: 'billing@apexventures.com',
    displayName: 'Finance & Invoicing',
    businessName: 'Apex Accounting Corp',
    category: 'Finance',
    color: '#7C3AED', // Purple
    avatarBg: 'bg-purple-600',
    initials: 'FI',
    unreadCount: 2,
    notificationsEnabled: true,
    notifyPriorityOnly: true,
    soundEnabled: true,
    protocol: 'Google Workspace',
    serverHost: 'imap.gmail.com',
    signature: 'Accounts Receivable & Billing\nApex Ventures\nbilling@apexventures.com',
  },
  {
    id: 'acc-5',
    email: 'marketing@apexventures.com',
    displayName: 'Growth & Brand Marketing',
    businessName: 'Apex Brand Studio',
    category: 'Marketing',
    color: '#EC4899', // Pink
    avatarBg: 'bg-pink-600',
    initials: 'GM',
    unreadCount: 0,
    notificationsEnabled: true,
    notifyPriorityOnly: false,
    soundEnabled: false,
    protocol: 'Gmail',
    serverHost: 'imap.gmail.com',
    signature: 'Marketing & PR\nApex Ventures',
  },
  {
    id: 'acc-6',
    email: 'operations@apexventures.com',
    displayName: 'Internal Operations & HR',
    businessName: 'Apex Ops HQ',
    category: 'Operations',
    color: '#0891B2', // Cyan
    avatarBg: 'bg-cyan-600',
    initials: 'OP',
    unreadCount: 1,
    notificationsEnabled: true,
    notifyPriorityOnly: false,
    soundEnabled: true,
    protocol: 'Google Workspace',
    serverHost: 'imap.gmail.com',
    signature: 'People & Operations HQ\nApex Ventures',
  },
  {
    id: 'acc-7',
    email: 'client.alpha@apexventures.com',
    displayName: 'Alpha Global Client Portal',
    businessName: 'Client Account Alpha',
    category: 'Client Inbox',
    color: '#4F46E5', // Indigo
    avatarBg: 'bg-indigo-600',
    initials: 'AG',
    unreadCount: 2,
    notificationsEnabled: true,
    notifyPriorityOnly: false,
    soundEnabled: true,
    protocol: 'Google Workspace',
    serverHost: 'imap.gmail.com',
    signature: 'Alpha Client Success Manager\nApex Ventures',
  },
  {
    id: 'acc-8',
    email: 'store.orders@nordicgear.shop',
    displayName: 'Nordic Gear E-Commerce',
    businessName: 'Shopify Storefront #1',
    category: 'Sales',
    color: '#16A34A', // Green
    avatarBg: 'bg-green-600',
    initials: 'NG',
    unreadCount: 4,
    notificationsEnabled: true,
    notifyPriorityOnly: false,
    soundEnabled: true,
    protocol: 'Custom IMAP',
    serverHost: 'mail.nordicgear.shop',
    signature: 'Nordic Gear Dispatch Team\norders@nordicgear.shop',
  },
  {
    id: 'acc-9',
    email: 'outreach@b2bleadgen.agency',
    displayName: 'B2B Cold Outreach Campaign',
    businessName: 'Agency Outreach #3',
    category: 'Marketing',
    color: '#EA580C', // Orange
    avatarBg: 'bg-orange-600',
    initials: 'BO',
    unreadCount: 2,
    notificationsEnabled: true,
    notifyPriorityOnly: true,
    soundEnabled: false,
    protocol: 'Google Workspace',
    serverHost: 'imap.gmail.com',
    signature: 'Alex R. | Business Development Partner',
  },
  {
    id: 'acc-10',
    email: 'legal@apexventures.com',
    displayName: 'Legal & Compliance Counsel',
    businessName: 'Apex Legal Department',
    category: 'Executive',
    color: '#475569', // Slate
    avatarBg: 'bg-slate-600',
    initials: 'LC',
    unreadCount: 1,
    notificationsEnabled: true,
    notifyPriorityOnly: true,
    soundEnabled: true,
    protocol: 'Google Workspace',
    serverHost: 'imap.gmail.com',
    signature: 'Legal & Regulatory Compliance\nApex Ventures',
  },
  {
    id: 'acc-11',
    email: 'investors@apexventures.com',
    displayName: 'Investor Relations & Syndicate',
    businessName: 'Apex Capital Relations',
    category: 'Executive',
    color: '#9333EA', // Violet
    avatarBg: 'bg-violet-600',
    initials: 'IR',
    unreadCount: 1,
    notificationsEnabled: true,
    notifyPriorityOnly: true,
    soundEnabled: true,
    protocol: 'Google Workspace',
    serverHost: 'imap.gmail.com',
    signature: 'Investor Relations Secretariat\nApex Ventures',
  },
  {
    id: 'acc-12',
    email: 'traffic.partners@buybesttraffic.com',
    displayName: 'High Volume Ad Traffic Partner',
    businessName: 'BestTraffic Global Media',
    category: 'Marketing',
    color: '#DC2626', // Red
    avatarBg: 'bg-red-600',
    initials: 'BT',
    unreadCount: 3,
    notificationsEnabled: true,
    notifyPriorityOnly: false,
    soundEnabled: true,
    protocol: 'Google Workspace',
    serverHost: 'imap.gmail.com',
    signature: 'Traffic Management & Media Buying Desk\nBuyBestTraffic.com',
  },
];

export const INITIAL_FOLDERS: Folder[] = [
  { id: 'inbox', name: 'Inbox', iconName: 'Inbox', isSystem: true },
  { id: 'starred', name: 'Starred', iconName: 'Star', isSystem: true },
  { id: 'sent', name: 'Sent', iconName: 'Send', isSystem: true },
  { id: 'drafts', name: 'Drafts', iconName: 'FileText', isSystem: true },
  { id: 'archive', name: 'Archive', iconName: 'Archive', isSystem: true },
  { id: 'spam', name: 'Spam', iconName: 'AlertOctagon', isSystem: true },
  { id: 'trash', name: 'Trash', iconName: 'Trash2', isSystem: true },
  // Custom business folders
  { id: 'invoices', name: 'Invoices & Billing', iconName: 'Receipt', isSystem: false, color: '#7C3AED' },
  { id: 'client_vip', name: 'VIP Clients', iconName: 'Crown', isSystem: false, color: '#F59E0B' },
  { id: 'contracts', name: 'Contracts & Legal', iconName: 'FileCheck', isSystem: false, color: '#2563EB' },
  { id: 'traffic_orders', name: 'Campaign Deliveries', iconName: 'TrendingUp', isSystem: false, color: '#DC2626' },
];

export const INITIAL_EMAILS: Email[] = [
  {
    id: 'mail-101',
    accountId: 'acc-1',
    from: { name: 'Sequoia Venture Partners', email: 'partners@sequoia.vc', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
    to: ['ceo@apexventures.com'],
    subject: 'Quarterly Strategic Board Review & Growth Allocation',
    snippet: 'Alex, impressive Q3 metrics across the 12 business units. Let us review the Series B syndicate schedule...',
    body: `Hi Alex,

We reviewed the Q3 operating summary across Apex Ventures and the subsidiary businesses. The 48% month-over-month growth in the advertising and e-commerce units is stellar.

Key items for our Thursday 10:00 AM EST session:
1. Expansion into the European ad server infrastructure
2. Hiring 3 enterprise account executives for client management
3. Review of the updated shareholder agreement

Please review the attached growth dossier before we jump on Zoom.

Best regards,
Marcus Vance | Partner, Sequoia VC`,
    date: '2026-11-01T16:15:00Z',
    isRead: false,
    isStarred: true,
    isArchived: false,
    folder: 'inbox',
    labels: ['VIP Clients', 'Board', 'Urgent'],
    attachments: [
      { name: 'Apex_Q3_Strategic_Deck.pdf', size: '4.2 MB', type: 'pdf' },
      { name: 'Growth_Allocation_Model.xlsx', size: '1.8 MB', type: 'sheet' },
    ],
    priority: 'high',
  },
  {
    id: 'mail-102',
    accountId: 'acc-2',
    from: { name: 'Elena Rostova', email: 'e.rostova@enterprise-cloud.de' },
    to: ['sales@apexventures.com'],
    subject: 'RFP: 250,000 Monthly Active User Enterprise Tier Subscription',
    snippet: 'We are ready to move forward with the annual enterprise SLA contract pending final terms confirmation...',
    body: `Hello Apex Sales Team,

Following our technical demo yesterday with your solutions architect, our steering committee approved procurement of the annual enterprise tier.

Could you please generate the formal invoice and order form with our VAT ID (DE39481902)? We are ready to sign via DocuSign today.

Kind regards,
Elena Rostova
Head of Digital Infrastructure | Enterprise Cloud GmbH`,
    date: '2026-11-01T15:40:00Z',
    isRead: false,
    isStarred: true,
    isArchived: false,
    folder: 'inbox',
    labels: ['Sales Lead', 'Enterprise'],
    attachments: [
      { name: 'Vendor_Onboarding_Form_Signed.pdf', size: '890 KB', type: 'pdf' },
    ],
    priority: 'high',
  },
  {
    id: 'mail-103',
    accountId: 'acc-12',
    from: { name: 'AdNetwork Exchange Direct', email: 'dsp-supply@adnetwork.io' },
    to: ['traffic.partners@buybesttraffic.com'],
    subject: 'High Volume Traffic Campaign: 1,500,000 Tier-1 Clicks Scheduled',
    snippet: 'Your traffic campaign #TX-90412 has been approved and bidder latency is under 18ms across all US nodes...',
    body: `Hello BuyBestTraffic Ops,

Campaign ID: TX-90412
Target: Tier 1 Geos (US, CA, UK, AU)
Daily Cap: 250,000 Visitors / Day
Estimated eCPM: $1.42

Real-time telemetry reports 99.8% human-verified traffic with zero bot discrepancies. Postback URLs are actively receiving conversion pings.

Check your advertiser dashboard for the live hourly breakdown.

AdNetwork Exchange RTB Operations`,
    date: '2026-11-01T14:22:00Z',
    isRead: false,
    isStarred: false,
    isArchived: false,
    folder: 'inbox',
    labels: ['Campaign Deliveries', 'Traffic'],
    attachments: [
      { name: 'Traffic_Audit_Log_Nov1.csv', size: '2.4 MB', type: 'sheet' },
    ],
    priority: 'high',
  },
  {
    id: 'mail-104',
    accountId: 'acc-4',
    from: { name: 'Stripe Merchant Billing', email: 'invoices@stripe.com' },
    to: ['billing@apexventures.com'],
    subject: 'Payout Processed: $84,920.00 USD on the way to Bank Account ending in *4910',
    snippet: 'A payout in the amount of $84,920.00 was dispatched today and should reflect in 1 business day...',
    body: `Stripe Payout Notice

Amount: $84,920.00 USD
Destination: Chase Commercial Checking (*4910)
Reference: STR-PAYOUT-902482

Gross Sales: $89,140.00
Platform Fees: $3,220.00
Net Payout: $84,920.00

Thank you for partnering with Stripe for your multi-store payment routing.`,
    date: '2026-11-01T13:10:00Z',
    isRead: false,
    isStarred: false,
    isArchived: false,
    folder: 'inbox',
    labels: ['Invoices & Billing'],
    attachments: [
      { name: 'Stripe_Monthly_Summary_Oct.pdf', size: '420 KB', type: 'pdf' },
    ],
    priority: 'normal',
  },
  {
    id: 'mail-105',
    accountId: 'acc-8',
    from: { name: 'Shopify Fulfillment Center', email: 'fulfillment@shopify.com' },
    to: ['store.orders@nordicgear.shop'],
    subject: 'Batch Shipment Notice: 184 Orders Dispatched from US-East Warehouse',
    snippet: 'All 184 customer orders from weekend flash sale have tracking numbers assigned via FedEx Express...',
    body: `Nordic Gear Operations,

All 184 orders received between Friday and Sunday have been packed, weighed, and scanned by FedEx Express. Tracking numbers have been automatically sent to the respective customers.

Inventory alert: Thermal Alpine Jackets (Black, Size L) are down to 14 units. Please reorder from supplier.`,
    date: '2026-11-01T12:05:00Z',
    isRead: false,
    isStarred: false,
    isArchived: false,
    folder: 'inbox',
    labels: ['E-Commerce', 'Orders'],
    priority: 'normal',
  },
  {
    id: 'mail-106',
    accountId: 'acc-3',
    from: { name: 'David Kim (VIP Tier)', email: 'david.kim@nexusbrands.org' },
    to: ['support@apexventures.com'],
    subject: 'URGENT: Custom Webhook Endpoint Retry Frequency Configuration',
    snippet: 'We are experiencing rate limiting on our custom CRM webhook after scaling to 5,000 events/minute...',
    body: `Hello Support Team,

We love the new API endpoint speeds, but our CRM is queuing events because of the 60-second backoff. Could your tier 2 engineering team whitelist our dedicated IP block (198.51.100.42)?

We have a live customer launch in 2 hours and need this addressed ASAP.

Thanks,
David Kim | CTO NexusBrands`,
    date: '2026-11-01T11:45:00Z',
    isRead: false,
    isStarred: true,
    isArchived: false,
    folder: 'inbox',
    labels: ['VIP Clients', 'Urgent'],
    priority: 'high',
  },
  {
    id: 'mail-107',
    accountId: 'acc-7',
    from: { name: 'Sarah Lin (Alpha Group)', email: 'slin@alphaglobal.com' },
    to: ['client.alpha@apexventures.com'],
    subject: 'Approved: Q4 Media Buy Proposal & Creative Assets',
    snippet: 'Alex and team, our executive committee has signed off on the $120k campaign for November...',
    body: `Hi Alex,

Great news! The leadership team approved the campaign budget and schedule. We have uploaded all high-res video assets to the shared Google Drive folder.

Looking forward to kick-off on Monday!`,
    date: '2026-11-01T10:15:00Z',
    isRead: false,
    isStarred: true,
    isArchived: false,
    folder: 'inbox',
    labels: ['VIP Clients', 'Contracts & Legal'],
    priority: 'high',
  },
  {
    id: 'mail-108',
    accountId: 'acc-10',
    from: { name: 'Baker & McKenzie LLP', email: 'd.morrison@bakermckenzie.law' },
    to: ['legal@apexventures.com'],
    subject: 'Trademark & Intellectual Property Filing Confirmation (US Patent & TM Office)',
    snippet: 'Official registration notice for OmniMail and Apex Ventures trademarks serial #98421092...',
    body: `Dear Counsel,

We received formal publication notice from the USPTO regarding your federal trademark applications. No oppositions were filed during the 30-day statutory period.

The final Certificates of Registration will issue next Tuesday. Congratulations!`,
    date: '2026-10-31T18:00:00Z',
    isRead: false,
    isStarred: false,
    isArchived: false,
    folder: 'inbox',
    labels: ['Contracts & Legal'],
    attachments: [
      { name: 'USPTO_Notice_Publication.pdf', size: '1.1 MB', type: 'pdf' },
    ],
    priority: 'normal',
  },
  {
    id: 'mail-109',
    accountId: 'acc-1',
    from: { name: 'Alex Rivers', email: 'ceo@apexventures.com' },
    to: ['board@apexventures.com'],
    subject: 'Sent: Monthly Executive Dashboard & Performance Memo',
    snippet: 'Attached is the completed monthly revenue performance memo across all business entities...',
    body: `Dear Board Members,

Enclosed is the completed performance report. Revenue was $340,000 for October, representing a 22% increase over forecast.

Best,
Alex`,
    date: '2026-10-31T16:00:00Z',
    isRead: true,
    isStarred: false,
    isArchived: false,
    folder: 'sent',
    labels: ['Executive'],
    priority: 'normal',
  },
  {
    id: 'mail-110',
    accountId: 'acc-2',
    from: { name: 'Alex Rivers', email: 'sales@apexventures.com' },
    to: ['prospect@fortune500.com'],
    subject: 'Draft: Enterprise Integration Partnership Agreement',
    snippet: 'Review of custom SLA terms and dedicated infrastructure nodes...',
    body: `Dear Prospect Team,

Following up on our discussions, please find our draft terms for the dedicated infrastructure SLA...`,
    date: '2026-10-31T14:00:00Z',
    isRead: true,
    isStarred: false,
    isArchived: false,
    folder: 'drafts',
    labels: ['Sales'],
    priority: 'normal',
  },
];
