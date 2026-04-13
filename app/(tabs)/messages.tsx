import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';

export default function MessagesScreen() {
  const router = useRouter();
  const { state } = useAppContext();

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderItem = ({ item }: { item: typeof state.conversations[0] }) => {
    const unread = item.unreadCount > 0;
    return (
      <TouchableOpacity style={[styles.item, unread && styles.unread]} onPress={() => router.push(`/chat/${item.id}`)}>
        <Avatar uri={item.pet.photos[0]} name={item.pet.name} size="lg" showOnline isOnline={item.pet.isOnline} />
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={[styles.name, unread && styles.nameBold]}>{item.pet.name}</Text>
            <Text style={styles.time}>{formatTime(item.lastMessageTime)}</Text>
          </View>
          <Text style={styles.owner}>Owner: {item.pet.owner.name}</Text>
          <View style={styles.row}>
            <Text style={[styles.msg, unread && styles.msgBold]} numberOfLines={1}>{item.lastMessage}</Text>
            {unread && <View style={styles.badge}><Text style={styles.badgeText}>{item.unreadCount}</Text></View>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>{state.conversations.length} conversations</Text>
      </View>
      {state.conversations.length > 0 ? (
        <FlatList data={state.conversations} renderItem={renderItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} ItemSeparatorComponent={() => <View style={styles.sep} />} />
      ) : (
        <EmptyState emoji="💬" title="No messages yet" description="Match with pets to start chatting!" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: 120 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.lg },
  unread: { backgroundColor: Colors.pastelOrange + '20', marginHorizontal: -Spacing.xl, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.md },
  info: { flex: 1, marginLeft: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: FontSize.lg, fontWeight: '500', color: Colors.textPrimary },
  nameBold: { fontWeight: '700' },
  time: { fontSize: FontSize.xs, color: Colors.textMuted },
  owner: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 4 },
  msg: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  msgBold: { color: Colors.textPrimary, fontWeight: '500' },
  badge: { backgroundColor: Colors.primary, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, marginLeft: Spacing.sm },
  badgeText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textInverse },
  sep: { height: 1, backgroundColor: Colors.divider },
});
