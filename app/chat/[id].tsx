import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { ChatMessage } from '@/constants/mockData';
import { useState, useRef } from 'react';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const conversation = state.conversations.find(c => c.id === id);
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  if (!conversation) {
    return (
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <View style={styles.notFound}><Text style={styles.notFoundText}>Conversation not found</Text></View>
      </SafeAreaView>
    );
  }

  const pet = conversation.pet;
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = () => {
    const text = messageText.trim();
    if (!text) return;
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      text,
      isMine: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMsg]);
    setMessageText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 120);
  };

  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);

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
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header — uses native back, just show pet info */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarBtn} onPress={() => router.back()}>
            <Avatar uri={pet.photos[0]} name={pet.name} size="sm" showOnline isOnline={pet.isOnline} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{pet.name}</Text>
            <Text style={styles.headerStatus}>{pet.isOnline ? 'Active now' : 'Offline'}</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 8 }]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input bar */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.md }]}>
          <TouchableOpacity style={styles.attachBtn}><Text style={styles.attachIcon}>+</Text></TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textMuted}
            value={messageText}
            onChangeText={setMessageText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !messageText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!messageText.trim()}
          >
            <Text style={styles.sendIcon}>›</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E8E0F8' },
  container: { flex: 1, backgroundColor: '#E8E0F8' },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: FontSize.lg, color: Colors.textSecondary },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  avatarBtn: { padding: 2 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  headerStatus: { fontSize: FontSize.xs, color: Colors.success, fontWeight: '500' },
  list: { padding: Spacing.md, paddingTop: Spacing.lg },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 },
  mine: { justifyContent: 'flex-end' },
  theirs: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '75%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  msgText: { fontSize: 15, color: Colors.textPrimary, lineHeight: 21 },
  msgTextMine: { color: '#fff' },
  time: { fontSize: 11, color: Colors.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  timeMine: { color: 'rgba(255,255,255,0.65)' },
  inputBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#EEE8F8',
    gap: Spacing.sm,
  },
  attachBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EBF8',
    justifyContent: 'center', alignItems: 'center',
  },
  attachIcon: { fontSize: 20, color: Colors.textSecondary, fontWeight: '300' },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F8F5FC',
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#DDC9F5', opacity: 0.6 },
  sendIcon: { fontSize: 22, color: '#fff', fontWeight: '700', marginLeft: 1 },
});
