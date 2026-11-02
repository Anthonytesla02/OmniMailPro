import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Account, Email, Folder } from './src/types/mail';
import { INITIAL_ACCOUNTS, INITIAL_FOLDERS, INITIAL_EMAILS } from './src/data/initialAccounts';
import {
  filterEmails,
  calculateUnreadCounts,
  moveEmail,
  toggleStar,
  markEmailRead,
} from './src/utils/mailManager';

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);

  const [activeAccountId, setActiveAccountId] = useState<string>('unified');
  const [activeFolderId, setActiveFolderId] = useState<string>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'accounts' | 'folders' | 'alerts'>('inbox');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Compose state
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeAccount, setComposeAccount] = useState(accounts[0]?.id || '');

  const { accountCounts, totalUnread } = calculateUnreadCounts(emails, accounts);
  const activeAccount = accounts.find((a) => a.id === activeAccountId);

  const displayedEmails = filterEmails(
    emails,
    activeAccountId,
    activeFolderId,
    searchQuery
  );

  const handleToggleStar = (emailId: string) => {
    setEmails((prev) => toggleStar(prev, emailId));
  };

  const handleSendEmail = () => {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      Alert.alert('Required Fields', 'Please enter recipient, subject, and body.');
      return;
    }
    const sender = accounts.find((a) => a.id === composeAccount) || accounts[0];
    const newMail: Email = {
      id: `sent-${Date.now()}`,
      accountId: sender.id,
      from: { name: sender.displayName, email: sender.email },
      to: [composeTo.trim()],
      subject: composeSubject.trim(),
      snippet: composeBody.trim().substring(0, 80),
      body: composeBody.trim(),
      date: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      isArchived: false,
      folder: 'sent',
      labels: ['Outreach'],
      priority: 'normal',
    };
    setEmails((prev) => [newMail, ...prev]);
    setIsComposeOpen(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    Alert.alert('Success', `Email dispatched from ${sender.email}!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Mobile Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setIsSidebarOpen(true)}
          style={styles.headerBtn}
          accessibilityLabel="Open sidebar menu"
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>
            {activeAccountId === 'unified'
              ? `All Inboxes (${accounts.length})`
              : activeAccount?.displayName}
          </Text>
          <Text style={styles.headerSubtitle}>
            {activeAccountId === 'unified' ? 'Unified Stream' : activeAccount?.email}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            const nextAcc = accounts[(Math.floor(Math.random() * accounts.length))];
            const testEmail: Email = {
              id: `test-${Date.now()}`,
              accountId: nextAcc.id,
              from: { name: 'VIP Enterprise Lead', email: 'lead@cloudenterprise.io' },
              to: [nextAcc.email],
              subject: 'Urgent: Multi-Inbox Integration Proposal',
              snippet: 'Attached is the signed commercial agreement...',
              body: 'Hello,\n\nWe have reviewed the commercial SLA and are ready to execute.',
              date: new Date().toISOString(),
              isRead: false,
              isStarred: true,
              isArchived: false,
              folder: 'inbox',
              labels: ['VIP Clients'],
              priority: 'high',
            };
            setEmails((prev) => [testEmail, ...prev]);
            Alert.alert('Push Alert', `New email received on ${nextAcc.email}`);
          }}
          style={styles.syncBtn}
        >
          <Text style={styles.syncBtnText}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Pane */}
      {selectedEmail ? (
        /* Email Reading Detail View */
        <View style={styles.detailContainer}>
          <View style={styles.detailNav}>
            <TouchableOpacity onPress={() => setSelectedEmail(null)} style={styles.backBtn}>
              <Text style={styles.backBtnText}>‹ Back</Text>
            </TouchableOpacity>
            <View style={styles.detailActions}>
              <TouchableOpacity
                onPress={() => handleToggleStar(selectedEmail.id)}
                style={styles.actionIconBtn}
              >
                <Text style={styles.actionIconText}>
                  {selectedEmail.isStarred ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setEmails((prev) => moveEmail(prev, selectedEmail.id, 'trash'));
                  setSelectedEmail(null);
                }}
                style={styles.actionIconBtn}
              >
                <Text style={styles.actionIconText}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.detailScroll}>
            <Text style={styles.detailSubject}>{selectedEmail.subject}</Text>
            <View style={styles.senderCard}>
              <Text style={styles.senderName}>{selectedEmail.from.name}</Text>
              <Text style={styles.senderEmail}>From: {selectedEmail.from.email}</Text>
              <Text style={styles.dateText}>
                {new Date(selectedEmail.date).toLocaleString()}
              </Text>
            </View>
            <Text style={styles.detailBody}>{selectedEmail.body}</Text>
          </ScrollView>
        </View>
      ) : activeTab === 'inbox' ? (
        /* Email Stream */
        <View style={styles.streamContainer}>
          {/* Search Bar */}
          <View style={styles.searchWrap}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search all 10+ business accounts..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={displayedEmails}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const acc = accounts.find((a) => a.id === item.accountId);
              return (
                <TouchableOpacity
                  style={[
                    styles.emailCard,
                    !item.isRead && styles.unreadCard,
                  ]}
                  onPress={() => {
                    setSelectedEmail(item);
                    if (!item.isRead) {
                      setEmails((prev) => markEmailRead(prev, item.id, true));
                    }
                  }}
                >
                  <View style={styles.cardHeader}>
                    <Text
                      style={[
                        styles.cardSender,
                        !item.isRead && styles.unreadText,
                      ]}
                    >
                      {item.from.name}
                    </Text>
                    <Text style={styles.cardDate}>
                      {new Date(item.date).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>

                  {acc && (
                    <View style={styles.accountBadge}>
                      <View
                        style={[styles.accountDot, { backgroundColor: acc.color }]}
                      />
                      <Text style={[styles.accountBadgeText, { color: acc.color }]}>
                        {acc.displayName}
                      </Text>
                    </View>
                  )}

                  <Text
                    style={[
                      styles.cardSubject,
                      !item.isRead && styles.unreadSubject,
                    ]}
                    numberOfLines={1}
                  >
                    {item.subject}
                  </Text>
                  <Text style={styles.cardSnippet} numberOfLines={2}>
                    {item.snippet}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : activeTab === 'accounts' ? (
        /* Accounts Tab (10+) */
        <ScrollView style={styles.accountsScroll}>
          <Text style={styles.tabSectionTitle}>Connected Accounts ({accounts.length})</Text>

          <TouchableOpacity
            style={[
              styles.accRow,
              activeAccountId === 'unified' && styles.accRowActive,
            ]}
            onPress={() => {
              setActiveAccountId('unified');
              setActiveTab('inbox');
            }}
          >
            <View style={styles.accRowLeft}>
              <View style={[styles.accAvatar, { backgroundColor: '#2563EB' }]}>
                <Text style={styles.accAvatarText}>Ω</Text>
              </View>
              <View>
                <Text style={styles.accName}>Unified Multi-Inbox</Text>
                <Text style={styles.accSub}>All {accounts.length} inboxes combined</Text>
              </View>
            </View>
            {totalUnread > 0 && (
              <View style={styles.badgePill}>
                <Text style={styles.badgePillText}>{totalUnread}</Text>
              </View>
            )}
          </TouchableOpacity>

          {accounts.map((acc) => (
            <TouchableOpacity
              key={acc.id}
              style={[
                styles.accRow,
                activeAccountId === acc.id && styles.accRowActive,
              ]}
              onPress={() => {
                setActiveAccountId(acc.id);
                setActiveTab('inbox');
              }}
            >
              <View style={styles.accRowLeft}>
                <View style={[styles.accAvatar, { backgroundColor: acc.color }]}>
                  <Text style={styles.accAvatarText}>{acc.initials}</Text>
                </View>
                <View style={styles.accMeta}>
                  <Text style={styles.accName}>{acc.displayName}</Text>
                  <Text style={styles.accSub}>{acc.email}</Text>
                </View>
              </View>
              {accountCounts[acc.id] > 0 && (
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>{accountCounts[acc.id]}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : activeTab === 'folders' ? (
        /* Folders Tab */
        <ScrollView style={styles.foldersScroll}>
          <Text style={styles.tabSectionTitle}>Mail Folders</Text>
          {folders.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.folderRow,
                activeFolderId === f.id && styles.folderRowActive,
              ]}
              onPress={() => {
                setActiveFolderId(f.id);
                setActiveTab('inbox');
              }}
            >
              <Text style={styles.folderName}>{f.name}</Text>
              {f.color && (
                <View style={[styles.folderDot, { backgroundColor: f.color }]} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        /* Alerts Tab */
        <ScrollView style={styles.alertsScroll}>
          <Text style={styles.tabSectionTitle}>Push Notifications Engine</Text>
          <View style={styles.alertCard}>
            <Text style={styles.alertCardTitle}>Per-Inbox Background Sync</Text>
            <Text style={styles.alertCardBody}>
              Every connected business inbox has push notification listeners enabled.
            </Text>
            <TouchableOpacity
              style={styles.testPushBtn}
              onPress={() => {
                Alert.alert('Push Alert Dispatched', 'Simulated push alert sent to notifications drawer.');
              }}
            >
              <Text style={styles.testPushBtnText}>Dispatch Test Push Alert</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Floating Action Button for Compose */}
      {!selectedEmail && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsComposeOpen(true)}
          accessibilityLabel="Compose new email"
        >
          <Text style={styles.fabText}>✎</Text>
        </TouchableOpacity>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setSelectedEmail(null);
            setActiveTab('inbox');
          }}
        >
          <Text style={[styles.navIcon, activeTab === 'inbox' && styles.navActive]}>
            ✉
          </Text>
          <Text style={[styles.navLabel, activeTab === 'inbox' && styles.navActive]}>
            Inboxes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setSelectedEmail(null);
            setActiveTab('accounts');
          }}
        >
          <Text style={[styles.navIcon, activeTab === 'accounts' && styles.navActive]}>
            ☰
          </Text>
          <Text style={[styles.navLabel, activeTab === 'accounts' && styles.navActive]}>
            Accounts ({accounts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setSelectedEmail(null);
            setActiveTab('folders');
          }}
        >
          <Text style={[styles.navIcon, activeTab === 'folders' && styles.navActive]}>
            📁
          </Text>
          <Text style={[styles.navLabel, activeTab === 'folders' && styles.navActive]}>
            Folders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setSelectedEmail(null);
            setActiveTab('alerts');
          }}
        >
          <Text style={[styles.navIcon, activeTab === 'alerts' && styles.navActive]}>
            🔔
          </Text>
          <Text style={[styles.navLabel, activeTab === 'alerts' && styles.navActive]}>
            Alerts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slide-over Sidebar Modal */}
      <Modal visible={isSidebarOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.sidebarSheet}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>OmniMail Pro (10+)</Text>
              <TouchableOpacity onPress={() => setIsSidebarOpen(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sidebarScroll}>
              <Text style={styles.sidebarSectionTitle}>All Inboxes</Text>
              <TouchableOpacity
                style={[
                  styles.sidebarRow,
                  activeAccountId === 'unified' && styles.sidebarRowActive,
                ]}
                onPress={() => {
                  setActiveAccountId('unified');
                  setIsSidebarOpen(false);
                }}
              >
                <Text style={styles.sidebarRowText}>Unified Stream ({accounts.length})</Text>
              </TouchableOpacity>

              <Text style={styles.sidebarSectionTitle}>Business Accounts</Text>
              {accounts.map((acc) => (
                <TouchableOpacity
                  key={acc.id}
                  style={[
                    styles.sidebarRow,
                    activeAccountId === acc.id && styles.sidebarRowActive,
                  ]}
                  onPress={() => {
                    setActiveAccountId(acc.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <View
                    style={[styles.accountDot, { backgroundColor: acc.color }]}
                  />
                  <Text style={styles.sidebarRowText} numberOfLines={1}>
                    {acc.displayName}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.sidebarSectionTitle}>Folders</Text>
              {folders.map((f) => (
                <TouchableOpacity
                  key={f.id}
                  style={[
                    styles.sidebarRow,
                    activeFolderId === f.id && styles.sidebarRowActive,
                  ]}
                  onPress={() => {
                    setActiveFolderId(f.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <Text style={styles.sidebarRowText}>{f.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Compose Email Modal */}
      <Modal visible={isComposeOpen} animationType="slide">
        <SafeAreaView style={styles.composeModal}>
          <View style={styles.composeHeader}>
            <Text style={styles.composeTitle}>New Business Email</Text>
            <TouchableOpacity onPress={() => setIsComposeOpen(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.composeBody}>
            <Text style={styles.inputLabel}>To:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="client@company.com"
              placeholderTextColor="#64748B"
              value={composeTo}
              onChangeText={setComposeTo}
            />

            <Text style={styles.inputLabel}>Subject:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Business subject..."
              placeholderTextColor="#64748B"
              value={composeSubject}
              onChangeText={setComposeSubject}
            />

            <Text style={styles.inputLabel}>Message:</Text>
            <TextInput
              style={[styles.textInput, styles.bodyInput]}
              multiline
              numberOfLines={6}
              placeholder="Write message..."
              placeholderTextColor="#64748B"
              value={composeBody}
              onChangeText={setComposeBody}
            />

            <TouchableOpacity style={styles.sendBtn} onPress={handleSendEmail}>
              <Text style={styles.sendBtnText}>Dispatch Email</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  headerBtn: {
    padding: 8,
  },
  hamburgerIcon: {
    fontSize: 22,
    color: '#F8FAFC',
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  syncBtn: {
    padding: 8,
  },
  syncBtnText: {
    fontSize: 20,
    color: '#10B981',
  },
  streamContainer: {
    flex: 1,
  },
  searchWrap: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  searchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 13,
  },
  listContent: {
    padding: 12,
  },
  emailCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  unreadCard: {
    borderLeftColor: '#10B981',
    backgroundColor: '#1E293B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardSender: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  unreadText: {
    color: '#F8FAFC',
    fontWeight: 'bold',
  },
  cardDate: {
    fontSize: 11,
    color: '#64748B',
  },
  accountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  accountDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  accountBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardSubject: {
    fontSize: 13,
    color: '#CBD5E1',
    fontWeight: '500',
    marginBottom: 4,
  },
  unreadSubject: {
    color: '#F8FAFC',
    fontWeight: 'bold',
  },
  cardSnippet: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 74,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  bottomNav: {
    height: 60,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
    color: '#64748B',
  },
  navLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  navActive: {
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  detailNav: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    padding: 6,
  },
  backBtnText: {
    fontSize: 15,
    color: '#38BDF8',
    fontWeight: '600',
  },
  detailActions: {
    flexDirection: 'row',
  },
  actionIconBtn: {
    padding: 6,
    marginLeft: 12,
  },
  actionIconText: {
    fontSize: 18,
    color: '#94A3B8',
  },
  detailScroll: {
    padding: 16,
  },
  detailSubject: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  senderCard: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    marginBottom: 14,
  },
  senderName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  senderEmail: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  detailBody: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 22,
  },
  accountsScroll: {
    padding: 16,
  },
  foldersScroll: {
    padding: 16,
  },
  alertsScroll: {
    padding: 16,
  },
  tabSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  accRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    marginBottom: 8,
  },
  accRowActive: {
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  accRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accAvatar: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  accAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  accMeta: {
    maxWidth: 220,
  },
  accName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  accSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  badgePill: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    marginBottom: 8,
  },
  folderRowActive: {
    backgroundColor: '#1E3A8A',
  },
  folderName: {
    fontSize: 13,
    color: '#F8FAFC',
    fontWeight: '500',
  },
  folderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  alertCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  alertCardBody: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  testPushBtn: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  testPushBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
  },
  sidebarSheet: {
    width: '80%',
    height: '100%',
    backgroundColor: '#0F172A',
    borderRightWidth: 1,
    borderRightColor: '#1E293B',
    padding: 16,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    marginBottom: 12,
  },
  sidebarTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  closeBtn: {
    fontSize: 18,
    color: '#94A3B8',
  },
  sidebarScroll: {
    flex: 1,
  },
  sidebarSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 6,
  },
  sidebarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  sidebarRowActive: {
    backgroundColor: '#1E293B',
  },
  sidebarRowText: {
    fontSize: 13,
    color: '#E2E8F0',
  },
  composeModal: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  composeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  composeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  composeBody: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 13,
  },
  bodyInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
