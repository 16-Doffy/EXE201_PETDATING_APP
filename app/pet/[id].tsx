import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getPetById, state, toggleFavorite, getConversationByPetId, createConversation } = useApp();
  const pet = getPetById(id);

  if (!pet) return (
    <View style={[styles.notFound, { paddingTop: insets.top }]}>
      <Text style={styles.notFoundText}>Pet not found</Text>
    </View>
  );

  const isFavorited = state.favorites.includes(pet.id);
  const [conversation, setConversation] = useState(getConversationByPetId(pet.id));

  const ageLabel = pet.age >= 12
    ? `${Math.floor(pet.age / 12)} year${pet.age >= 24 ? 's' : ''} old`
    : `${pet.age} months old`;

  const handleMessage = () => {
    const conv = conversation ?? createConversation(pet.id);
    setConversation(conv);
    router.push(`/chat/${conv.id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Image */}
        <View style={styles.hero}>
          <Image source={{ uri: pet.photos[0] }} style={styles.heroImage} />

          {/* Top overlay with back */}
          <View style={[styles.topOverlay, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              style={[styles.backBtn, Shadows.sm]}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.shareBtn, Shadows.sm]} activeOpacity={0.8}>
              <Text style={styles.shareIcon}>↗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content card */}
        <View style={styles.content}>
          {/* Main info */}
          <View style={styles.mainInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{pet.name}</Text>
              {pet.isOnline && (
                <View style={styles.onlineBadge}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Online</Text>
                </View>
              )}
            </View>
            <Text style={styles.ageBreed}>{ageLabel} · {pet.breed}</Text>
            <View style={styles.distance}>
              <Text style={styles.distanceIcon}>📍</Text>
              <Text style={styles.distanceText}>{pet.distance.toFixed(1)} km away</Text>
            </View>

            {/* Tags */}
            <View style={styles.tags}>
              {pet.traits.map((t, i) => (
                <View key={i} style={[styles.tag, { backgroundColor: [Colors.pastelOrange, Colors.pastelPurple, Colors.pastelGreen, Colors.pastelPink][i % 4] + '60' }]}>
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Owner card */}
          <TouchableOpacity style={[styles.ownerCard, Shadows.sm]} activeOpacity={0.8}>
            <Avatar uri={pet.owner.avatar} size="md" />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerLabel}>Owner</Text>
              <Text style={styles.ownerName}>{pet.owner.name}</Text>
            </View>
            <Text style={styles.ownerArrow}>›</Text>
          </TouchableOpacity>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {pet.name}</Text>
            <Text style={styles.bio}>{pet.bio}</Text>
          </View>

          {/* Personality */}
          {pet.personalityTags && pet.personalityTags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personality 🏷️</Text>
              <View style={styles.personalityRow}>
                {pet.personalityTags.map((tag, i) => (
                  <View key={i} style={[styles.personalityTag, Shadows.sm]}>
                    <Text style={styles.personalityText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Activities */}
          {pet.favoriteActivities && pet.favoriteActivities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Favorite Activities 🎯</Text>
              <View style={styles.personalityRow}>
                {pet.favoriteActivities.map((act, i) => (
                  <View key={i} style={[styles.activityTag, Shadows.sm]}>
                    <Text style={styles.activityText}>{act}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={[styles.actions, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <TouchableOpacity
          style={[styles.likeBtn, isFavorited ? styles.likeBtnActive : styles.likeBtnDefault, Shadows.sm]}
          onPress={() => toggleFavorite(pet.id)}
          activeOpacity={0.8}
        >
          <Text style={[styles.likeIcon, isFavorited && styles.likeIconActive]}>
            {isFavorited ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.msgBtn, Shadows.btn]}
          onPress={handleMessage}
          activeOpacity={0.85}
        >
          <Text style={styles.msgBtnText}>Send Message 💬</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: FontSize.lg, color: Colors.textSecondary },
  hero: { position: 'relative', width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.1 },
  heroImage: { width: '100%', height: '100%', backgroundColor: Colors.pastelOrange },
  topOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
  },
  backIcon: { fontSize: 22, color: Colors.textPrimary },
  shareBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
  },
  shareIcon: { fontSize: 18, color: Colors.textPrimary },
  content: {
    marginTop: -Spacing.xl,
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.card,
    borderTopRightRadius: BorderRadius.card,
    padding: Spacing.xl,
  },
  mainInfo: { marginBottom: Spacing.xl },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  name: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary, marginRight: Spacing.md },
  onlineBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.pastelGreen, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.chip,
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success, marginRight: Spacing.xs },
  onlineText: { fontSize: FontSize.xs, color: Colors.success, fontWeight: '600' },
  ageBreed: { fontSize: FontSize.lg, color: Colors.textSecondary, marginBottom: Spacing.sm },
  distance: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  distanceIcon: { fontSize: 14, marginRight: 4 },
  distanceText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.chip },
  tagText: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.textPrimary },
  ownerCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, padding: Spacing.lg,
    borderRadius: BorderRadius.lg, marginBottom: Spacing.xl,
  },
  ownerInfo: { flex: 1, marginLeft: Spacing.md },
  ownerLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 2 },
  ownerName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  ownerArrow: { fontSize: 28, color: Colors.textMuted },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  bio: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 26 },
  personalityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  personalityTag: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.chip,
  },
  personalityText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary },
  activityTag: {
    backgroundColor: Colors.pastelPurple + '40',
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.chip,
  },
  activityText: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.secondary },
  actions: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  likeBtn: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
  },
  likeBtnDefault: { backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border },
  likeBtnActive: { backgroundColor: Colors.pastelPink, borderWidth: 2, borderColor: Colors.error },
  likeIcon: { fontSize: 28, color: Colors.textSecondary },
  likeIconActive: { color: Colors.error },
  msgBtn: {
    flex: 1, height: 56, borderRadius: BorderRadius.btn,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  msgBtnText: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textInverse },
});