import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { ChatMessage } from '@/constants/mockData';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state } = useAppContext();
  const conversation = state.conversations.find(c => c.id === id);

  if (!conversation) return <View style={styles.notFound}><Text style={styles.notFoundText}>Conversation not found</Text></View>;

  const pet = conversation.pet;
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const mine = item.isMine;
    return (
      <View style={[styles.msgRow, mine ? styles.mine : styles.theirs]}>
        {!mine && <Avatar uri={pet.photos[0]} size="sm" />}
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.msgText, mine && styles.msgTextMine]}>{item.text}</Text>
          <Text style={[styles.time, mine && styles.timeMine]}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Avatar uri={pet.photos[0]} name={pet.name} size="md" showOnline isOnline={pet.isOnline} />
        <View style={styles.headerInfo}><Text style={styles.headerName}>{pet.name}</Text><Text style={styles.headerStatus}>{pet.isOnline ? 'Online' : 'Offline'}</Text></View>
      </View>
      <FlatList data={conversation.messages} renderItem={renderMessage} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}><Text style={styles.attachIcon}>📎</Text></TouchableOpacity>
        <TextInput style={styles.input} placeholder="Type a message..." placeholderTextColor={Colors.textMuted} />
        <TouchableOpacity style={styles.sendBtn}><Text style={styles.sendIcon}>➤</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: FontSize.lg, color: Colors.textSecondary },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md },
  backBtn: { padding: Spacing.xs },
  backIcon: { fontSize: 24, color: Colors.textPrimary },
  headerInfo: { flex: 1 },
  headerName: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textPrimary },
  headerStatus: { fontSize: FontSize.xs, color: Colors.textSecondary },
  list: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Spacing.md },
  mine: { justifyContent: 'flex-end' },
  theirs: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '75%', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: 20 },
  bubbleMine: { backgroundColor: Colors.primary, borderBottomRightRadius: 6, marginLeft: Spacing.sm },
  bubbleTheirs: { backgroundColor: Colors.surface, borderBottomLeftRadius: 6, marginRight: Spacing.sm },
  msgText: { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 22 },
  msgTextMine: { color: Colors.textInverse },
  time: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs, alignSelf: 'flex-end' },
  timeMine: { color: 'rgba(255,255,255,0.7)' },
  attachBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.pastelOrange, justifyContent: 'center', alignItems: 'center' },
  attachIcon: { fontSize: 18 },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, gap: Spacing.sm },
  input: { flex: 1, height: 44, backgroundColor: Colors.background, borderRadius: 22, paddingHorizontal: Spacing.lg, fontSize: FontSize.md, color: Colors.textPrimary },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { fontSize: 18, color: Colors.textInverse },
});
