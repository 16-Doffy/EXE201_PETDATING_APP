import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { useState, useEffect } from 'react';
import * as SocialService from '@/services/socialService';

interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  createdAt: string;
  userName: string;
  userAvatar: string;
}

function PostCard({ post, onLike, onComment }: { post: Post; onLike: (postId: string) => void; onComment: (postId: string) => void }) {
  return (
    <View style={[styles.postCard, Shadows.sm]}>
      {/* Header */}
      <View style={styles.postHeader}>
        <Avatar uri={post.userAvatar} name={post.userName} size="sm" />
        <View style={styles.postUserInfo}>
          <Text style={styles.postUserName}>{post.userName}</Text>
          <Text style={styles.postTime}>{new Date(post.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Image */}
      {post.imageUrl && (
        <View style={styles.postImage}>
          <Text style={styles.imageText}>📷 Image: {post.imageUrl.substring(0, 30)}...</Text>
        </View>
      )}

      {/* Stats */}
      <View style={styles.postStats}>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={styles.statText}>{post.likesCount}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>💬</Text>
          <Text style={styles.statText}>{post.commentsCount}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={[styles.actionBtn, post.likedByMe && styles.actionBtnActive]}
          onPress={() => onLike(post.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>{post.likedByMe ? '❤️' : '🤍'}</Text>
          <Text style={[styles.actionText, post.likedByMe && styles.actionTextActive]}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onComment(post.id)} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SocialFeedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state } = useApp();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      const feed = await SocialService.getFeed();
      setPosts(feed);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.likedByMe) {
        await SocialService.unlikePost(postId);
        post.likesCount--;
      } else {
        await SocialService.likePost(postId);
        post.likesCount++;
      }
      post.likedByMe = !post.likedByMe;
      setPosts([...posts]);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = (postId: string) => {
    router.push(`/posts/${postId}/comments` as any);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Social Feed</Text>
        <TouchableOpacity style={[styles.createBtn, Shadows.sm]} activeOpacity={0.7}>
          <Text style={styles.createIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} onLike={handleLike} onComment={handleComment} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.feedContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadFeed(true)} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌳</Text>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>Start following users to see their posts!</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  createBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createIcon: { fontSize: 20 },

  feedContent: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },

  postCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  postHeader: { flexDirection: 'row', marginBottom: Spacing.md },
  postUserInfo: { marginLeft: Spacing.md, justifyContent: 'center' },
  postUserName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  postTime: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },

  postContent: { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 22, marginBottom: Spacing.md },

  postImage: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageText: { fontSize: FontSize.sm, color: Colors.textSecondary },

  postStats: { flexDirection: 'row', marginBottom: Spacing.md, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  stat: { flexDirection: 'row', alignItems: 'center', marginRight: Spacing.lg },
  statIcon: { fontSize: 16, marginRight: 4 },
  statText: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.textSecondary },

  postActions: { flexDirection: 'row', justifyContent: 'space-around' },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.sm },
  actionBtnActive: { backgroundColor: Colors.background, borderRadius: BorderRadius.sm },
  actionIcon: { fontSize: 18, marginRight: 6 },
  actionText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  actionTextActive: { color: Colors.error },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 100 },
  emptyIcon: { fontSize: 64, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', maxWidth: 200 },
});
