import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useState } from 'react';
import { Conversation } from '@/constants/mockData';

type FilterTab = 'all' | 'unread' | 'online';

const filterTabs: { key: FilterTab; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '💬' },
  { key: 'unread', label: 'Unread', emoji: '🔴' },
  { key: 'online', label: 'Online', emoji: '🟢' },
];

function formatTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (diff < 60000) return 'now';
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function ConversationItem({ item, onPress }: { item: Conversation; onPress: () => void }) {
  const unread = item.unreadCount > 0;

  return (
    <TouchableOpacity
      style={[styles.item, unread && styles.itemUnread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar — larger, with ring */}
      <View style={[styles.avatarWrap, Shadows.sm]}>
        <Avatar
          uri={item.pet.photos[0]}
          name={item.pet.name}
          size="lg"
          showOnline
          isOnline={item.pet.isOnline}
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={[styles.name, unread && styles.nameBold]} numberOfLines={1}>{item.pet.name}</Text>
          <Text style={styles.time}>{formatTime(item.lastMessageTime)}</Text>
        </View>
        <Text style={styles.ownerLabel}>Owner: {item.pet.owner.name}</Text>
        <View style={styles.bottomRow}>
          <Text style={[styles.preview, unread && styles.previewBold]} numberOfLines={1}>
            {item.lastMessage || 'Start chatting...'}
          </Text>
          {unread && (
            <View style={[styles.badge, Shadows.sm]}>
              <Text style={styles.badgeText}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, getFilteredConversations } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = getFilteredConversations(activeFilter).filter(c =>
    c.pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.pet.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = state.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const totalOnline = state.conversations.filter(c => c.pet.isOnline).length;

  const getEmptyContent = () => {
    if (activeFilter === 'unread') return { emoji: '📭', title: 'All caught up!', description: 'No unread messages.' };
    if (activeFilter === 'online') return { emoji: '🌙', title: 'No one online', description: 'Check back later.' };
    return { emoji: '💬', title: 'No messages yet', description: 'Match with pets to start chatting!' };
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages 💬</Text>
        <Text style={styles.subtitle}>
          {state.conversations.length} conversations
          {totalUnread > 0 ? ` · ${totalUnread} unread` : ''}
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <View style={[styles.search, Shadows.sm]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.tabsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {filterTabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeFilter === tab.key && styles.tabActive, Shadows.sm]}
              onPress={() => setActiveFilter(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabEmoji}>{tab.emoji}</Text>
              <Text style={[styles.tabLabel, activeFilter === tab.key && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {tab.key === 'unread' && totalUnread > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{totalUnread > 9 ? '9+' : totalUnread}</Text>
                </View>
              )}
              {tab.key === 'online' && totalOnline > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{totalOnline}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View>
              <ConversationItem item={item} onPress={() => router.push(`/chat/${item.id}`)} />
              {index < conversations.length - 1 && <View style={styles.sep} />}
            </View>
          )}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyWrap}>
          <EmptyState {...getEmptyContent()} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  title: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  searchWrap: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.sm },
  search: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md, height: 44,
    borderRadius: BorderRadius.lg,
  },
  searchIcon: { fontSize: 15, marginRight: Spacing.xs },
  searchInput: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary },
  clearIcon: { fontSize: 14, color: Colors.textMuted },
  tabsWrap: { paddingBottom: Spacing.sm },
  tabs: { paddingHorizontal: Spacing.xl, gap: Spacing.xs },
  tab: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 6, paddingHorizontal: Spacing.sm,
    borderRadius: 16, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    gap: 4,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabEmoji: { fontSize: 12 },
  tabLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },
  tabLabelActive: { color: Colors.textInverse },
  tabBadge: {
    backgroundColor: Colors.swipeNo, borderRadius: 8,
    minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
  },
  tabBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.textInverse },
  list: { paddingHorizontal: Spacing.xl },
  item: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  itemUnread: {
    backgroundColor: Colors.unreadBg,
    paddingHorizontal: Spacing.sm, marginHorizontal: -Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  avatarWrap: { marginRight: Spacing.md },
  info: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  name: { fontSize: FontSize.md, fontWeight: '500', color: Colors.textPrimary, flex: 1, marginRight: Spacing.xs },
  nameBold: { fontWeight: '700' },
  time: { fontSize: FontSize.xs, color: Colors.textMuted },
  ownerLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 3 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  preview: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1, marginRight: Spacing.sm },
  previewBold: { color: Colors.textPrimary, fontWeight: '500' },
  badge: {
    backgroundColor: Colors.primary, borderRadius: 10,
    minWidth: 22, height: 22, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6,
  },
  badgeText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textInverse },
  chevron: { fontSize: 22, color: Colors.textMuted, marginLeft: Spacing.xs },
  sep: { height: 1, backgroundColor: Colors.divider, marginLeft: 80 },
  emptyWrap: { flex: 1 },
});