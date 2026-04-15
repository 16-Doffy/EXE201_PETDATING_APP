import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { useState, useEffect } from 'react';
import * as SocialService from '@/services/socialService';
import { useApp } from '@/context/AppContext';

interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  userName: string;
  userAvatar: string;
}

export default function PostCommentsScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    if (!postId) return;
    try {
      setLoading(true);
      const data = await SocialService.getComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!postId || !commentText.trim()) return;

    try {
      setSubmitting(true);
      const response = await SocialService.addComment(postId, commentText) as any;
      const newComment: Comment = {
        id: response.id,
        userId: response.userId || state.user?.id || '',
        postId: postId,
        content: response.content,
        userName: response.userName,
        userAvatar: response.userAvatar || state.user?.avatar || '',
      };
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Avatar uri={item.userAvatar} name={item.userName} size="sm" />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>{item.userName}</Text>
        </View>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]} edges={['left', 'right', 'top']}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Comments</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.commentsList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💭</Text>
              <Text style={styles.emptyTitle}>No comments yet</Text>
              <Text style={styles.emptyText}>Be the first to comment!</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Comment Input */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 12 }]}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={Colors.textSecondary}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !commentText.trim() && styles.sendBtnDisabled]}
            onPress={handleSubmitComment}
            disabled={!commentText.trim() || submitting}
            activeOpacity={0.7}
          >
            <Text style={styles.sendIcon}>{submitting ? '⏳' : '✈️'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { fontSize: FontSize.md, fontWeight: '600', color: Colors.primary },
  title: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },

  commentsList: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },

  commentItem: { flexDirection: 'row', marginBottom: Spacing.lg },
  commentContent: { flex: 1, marginLeft: Spacing.md },
  commentHeader: { flexDirection: 'row', alignItems: 'center' },
  commentUserName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary },
  commentText: { fontSize: FontSize.sm, color: Colors.textPrimary, marginTop: Spacing.xs, lineHeight: 18 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 100 },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.sm, color: Colors.textSecondary },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    maxHeight: 120,
    marginRight: Spacing.sm,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  sendBtnDisabled: { backgroundColor: Colors.textSecondary, opacity: 0.5 },
  sendIcon: { fontSize: 20 },
});
