// ============================================================
// HomeScreen - Tinder-style swipe cards
// ============================================================
import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Animated, PanResponder, Dimensions, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { MatchPopup } from '@/components/ui/MatchPopup';

const { width: W, height: H } = Dimensions.get('window');

// Card: ~62% screen height — fits header + chips + buttons + tab bar on Pixel 3a
const CARD_W = W - 40;
const CARD_H = H * 0.62;
const SWIPE_THRESHOLD = W * 0.28;

const genderIcon = (g: string) => (g === 'male' ? '♂' : '♀');

// ============================================================
// PetCard — full-bleed card with gradient overlay
// ============================================================
function PetCard({ pet, onPress }: { pet: any; onPress?: () => void }) {
  const ageLabel = pet.age >= 12 ? `${Math.floor(pet.age / 12)}y` : `${pet.age}m`;
  const speciesEmoji = pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : '🐦';
  const speciesColor = pet.species === 'dog' ? Colors.pastelOrange : Colors.pastelPurple;

  return (
    <TouchableOpacity style={[styles.card, Shadows.lg]} onPress={onPress} activeOpacity={0.98}>
      {/* Full-bleed image */}
      <Image source={{ uri: pet.photos[0] }} style={styles.cardImage} />

      {/* Bottom gradient for readability */}
      <View style={styles.gradient} />

      {/* Top badges */}
      <View style={styles.topRow}>
        {pet.isOnline && (
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        )}
        <View style={[styles.speciesBadge, { backgroundColor: speciesColor + 'CC' }]}>
          <Text style={styles.speciesEmoji}>{speciesEmoji}</Text>
        </View>
      </View>

      {/* Info overlay */}
      <View style={styles.infoOverlay}>
        <View style={styles.nameRow}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petAge}>{ageLabel}</Text>
          <View style={[styles.genderBadge, pet.gender === 'male' ? styles.maleBg : styles.femaleBg]}>
            <Text style={styles.genderText}>{genderIcon(pet.gender)}</Text>
          </View>
        </View>
        <Text style={styles.breed}>{pet.breed}</Text>
        <View style={styles.distanceRow}>
          <Text style={styles.distanceIcon}>📍</Text>
          <Text style={styles.distance}>{pet.distance.toFixed(1)} km away</Text>
        </View>
        <View style={styles.tagsRow}>
          {pet.traits.slice(0, 3).map((t: string, i: number) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
        <View style={styles.ownerRow}>
          <Image source={{ uri: pet.owner.avatar }} style={styles.ownerAvatar} />
          <Text style={styles.ownerName}>{pet.owner.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ============================================================
// SwipeBadge — LIKE / NOPE overlay
// ============================================================
function SwipeBadge({ type, opacity }: { type: 'like' | 'nope'; opacity: Animated.Value }) {
  const isLike = type === 'like';
  return (
    <Animated.View
      style={[
        styles.swipeBadge,
        isLike ? styles.likeBadge : styles.nopeBadge,
        { opacity },
      ]}
    >
      <Text style={[styles.swipeText, isLike ? styles.likeText : styles.nopeText]}>
        {isLike ? 'LIKE' : 'NOPE'}
      </Text>
    </Animated.View>
  );
}

// ============================================================
// SwipeableCard — wraps PetCard with PanResponder gesture
// ============================================================
function SwipeableCard({
  pet, stackIndex, totalVisible, onSwipe, onPress,
}: {
  pet: any;
  stackIndex: number;
  totalVisible: number;
  onSwipe: (dir: 'left' | 'right' | 'super', pet: any) => void;
  onPress: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const nopeOpacity = useRef(new Animated.Value(0)).current;
  const isTop = stackIndex === 0;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => isTop && Math.abs(g.dx) > 5,
      onPanResponderGrant: () => {
        translateX.stopAnimation();
        translateY.stopAnimation();
      },
      onPanResponderMove: (_, gesture) => {
        if (!isTop) return;
        translateX.setValue(gesture.dx);
        translateY.setValue(gesture.dy * 0.3);
        const ratio = gesture.dx / SWIPE_THRESHOLD;
        if (ratio > 0) {
          likeOpacity.setValue(Math.min(ratio, 1));
          nopeOpacity.setValue(0);
        } else {
          nopeOpacity.setValue(Math.min(Math.abs(ratio), 1));
          likeOpacity.setValue(0);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (!isTop) return;
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.timing(translateX, { toValue: W * 1.5, duration: 240, useNativeDriver: true }),
            Animated.timing(likeOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
          ]).start(() => onSwipe('right', pet));
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.timing(translateX, { toValue: -W * 1.5, duration: 240, useNativeDriver: true }),
            Animated.timing(nopeOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
          ]).start(() => onSwipe('left', pet));
        } else {
          Animated.parallel([
            Animated.spring(translateX, { toValue: 0, friction: 9, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, friction: 9, useNativeDriver: true }),
            Animated.timing(likeOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
            Animated.timing(nopeOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const rotate = translateX.interpolate({
    inputRange: [-W, 0, W],
    outputRange: ['-18deg', '0deg', '18deg'],
    extrapolate: 'clamp',
  });

  const stackScale = isTop ? 1 : 1 - stackIndex * 0.06;
  const stackTranslateY = isTop ? 0 : stackIndex * 10;

  const animatedStyle = {
    transform: [
      { translateX: isTop ? translateX : 0 },
      { translateY: isTop ? translateY : 0 },
      { rotate: isTop ? rotate : '0deg' },
      { scale: stackScale },
      { translateY: stackTranslateY },
    ],
    zIndex: totalVisible - stackIndex,
  };

  return (
    <Animated.View
      style={[styles.cardWrap, animatedStyle]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      <PetCard pet={pet} onPress={isTop ? onPress : undefined} />
      {isTop && (
        <>
          <SwipeBadge type="like" opacity={likeOpacity} />
          <SwipeBadge type="nope" opacity={nopeOpacity} />
        </>
      )}
    </Animated.View>
  );
}

// ============================================================
// Main HomeScreen
// ============================================================
const CATEGORIES = [
  { key: 'all', label: 'All', emoji: '🐾' },
  { key: 'dog', label: 'Dogs', emoji: '🐕' },
  { key: 'cat', label: 'Cats', emoji: '🐱' },
  { key: 'bird', label: 'Birds', emoji: '🐦' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, getFilteredPets, toggleFavorite, setCategory, setGender, showMatchPopup, hideMatchPopup, matchPopupPet } = useApp();
  const [skippedIds, setSkippedIds] = useState<string[]>([]);

  const pets = getFilteredPets();
  const visiblePets = pets.filter((p) => !skippedIds.includes(p.id));
  const totalVisible = Math.min(visiblePets.length, 3);

  const handleSwipe = useCallback((dir: 'left' | 'right' | 'super', pet: any) => {
    if (dir === 'right' || dir === 'super') {
      toggleFavorite(pet.id);
      // 40% chance of mutual match
      if (Math.random() < 0.4) {
        setTimeout(() => showMatchPopup(pet), 350);
      }
    }
    setSkippedIds((prev) => [...prev, pet.id]);
  }, [toggleFavorite, showMatchPopup]);

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Discover 🐾</Text>
          <Text style={styles.subtitle}>{visiblePets.length} pets nearby</Text>
        </View>
        <TouchableOpacity
          style={[styles.settingsBtn, Shadows.sm]}
          onPress={() => router.push('/settings')}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Category chips */}
      <View style={styles.chipSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={[styles.chip, state.selectedCategory === c.key && styles.chipActive]}
              onPress={() => setCategory(c.key as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipEmoji}>{c.emoji}</Text>
              <Text style={[styles.chipText, state.selectedCategory === c.key && styles.chipTextActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={{ width: 6 }} />
          {(['male', 'female'] as const).map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, state.selectedGender === g && styles.chipActive]}
              onPress={() => setGender(state.selectedGender === g ? 'all' : g)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipEmoji}>{g === 'male' ? '♂' : '♀'}</Text>
              <Text style={[styles.chipText, state.selectedGender === g && styles.chipTextActive]}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Card area */}
      <View style={styles.cardArea}>
        {visiblePets.length > 0 ? (
          <View style={styles.cardsContainer}>
            {/* Render back-to-front; index 0 = top (swipeable) card */}
            {visiblePets.slice(0, 3).map((pet, i) => {
              const stackIndex = Math.min(visiblePets.length, 3) - 1 - i;
              return (
                <SwipeableCard
                  key={pet.id}
                  pet={pet}
                  stackIndex={stackIndex}
                  totalVisible={totalVisible}
                  onSwipe={handleSwipe}
                  onPress={() => router.push(`/pet/${pet.id}`)}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🏝️</Text>
            <Text style={styles.emptyTitle}>No more pets nearby</Text>
            <Text style={styles.emptySubtitle}>Check back soon for new furry friends!</Text>
            <TouchableOpacity
              style={[styles.resetBtn, Shadows.btn]}
              onPress={() => setSkippedIds([])}
              activeOpacity={0.8}
            >
              <Text style={styles.resetBtnText}>See All Again 🔄</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Action buttons */}
      <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 12 }]}>
        {visiblePets.length > 0 && (
          <>
            <Text style={styles.counter}>{visiblePets.length} remaining</Text>
            <View style={styles.actionRow}>
              {/* Nope */}
              <TouchableOpacity
                style={[styles.actionBtn, styles.skipBtn, Shadows.card]}
                onPress={() => {
                  const p = visiblePets[0];
                  if (p) handleSwipe('left', p);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.skipIcon}>✕</Text>
              </TouchableOpacity>

              {/* Super Like */}
              <TouchableOpacity
                style={[styles.actionBtn, styles.superBtn, Shadows.card]}
                onPress={() => {
                  const p = visiblePets[0];
                  if (p) handleSwipe('super', p);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.superIcon}>⭐</Text>
              </TouchableOpacity>

              {/* Like */}
              <TouchableOpacity
                style={[styles.actionBtn, styles.likeBtn, Shadows.btn]}
                onPress={() => {
                  const p = visiblePets[0];
                  if (p) handleSwipe('right', p);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.likeIcon}>♥</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Match Popup */}
      <MatchPopup pet={matchPopupPet} onClose={hideMatchPopup} />
    </View>
  );
}

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm,
  },
  greeting: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  settingsBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center',
  },
  settingsIcon: { fontSize: 20 },

  // Chips
  chipSection: { paddingBottom: Spacing.xs },
  chipRow: { paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1.5, borderColor: Colors.border, gap: 4,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipEmoji: { fontSize: 13 },
  chipText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: Colors.textInverse },

  // Card area
  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardsContainer: { width: CARD_W, height: CARD_H, justifyContent: 'center', alignItems: 'center' },
  cardWrap: { position: 'absolute', width: CARD_W, height: CARD_H },

  // PetCard
  card: {
    width: CARD_W, height: CARD_H,
    borderRadius: BorderRadius.card, overflow: 'hidden', backgroundColor: Colors.surface,
  },
  cardImage: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.pastelOrange },
  gradient: { ...StyleSheet.absoluteFillObject },
  topRow: {
    position: 'absolute', top: Spacing.lg, left: Spacing.lg, right: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  onlineBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success, marginRight: 4 },
  onlineText: { fontSize: FontSize.xs, color: '#fff', fontWeight: '600' },
  speciesBadge: {
    width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center',
  },
  speciesEmoji: { fontSize: 18 },
  infoOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.xl },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 },
  petName: { fontSize: 28, fontWeight: '800', color: '#fff', marginRight: 8 },
  petAge: { fontSize: 18, color: 'rgba(255,255,255,0.9)', marginRight: 8 },
  genderBadge: {
    width: 24, height: 24, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2,
  },
  maleBg: { backgroundColor: 'rgba(167,139,250,0.5)', borderColor: Colors.pastelPurple },
  femaleBg: { backgroundColor: 'rgba(252,231,243,0.5)', borderColor: Colors.pastelPink },
  genderText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  breed: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  distanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  distanceIcon: { fontSize: 13, marginRight: 4 },
  distance: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.md, gap: Spacing.sm },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14,
  },
  tagText: { fontSize: FontSize.xs, color: '#fff', fontWeight: '600' },
  ownerRow: { flexDirection: 'row', alignItems: 'center' },
  ownerAvatar: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)', marginRight: 8,
  },
  ownerName: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },

  // Swipe badge
  swipeBadge: {
    position: 'absolute', top: 36,
    paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 4, borderRadius: 8, zIndex: 30,
  },
  likeBadge: { left: 16, borderColor: Colors.swipeYes },
  nopeBadge: { right: 16, borderColor: Colors.swipeNo },
  swipeText: { fontSize: 24, fontWeight: '900' },
  likeText: { color: Colors.swipeYes },
  nopeText: { color: Colors.swipeNo },

  // Empty card
  emptyCard: {
    width: CARD_W, height: CARD_H * 0.85,
    borderRadius: BorderRadius.card, backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    padding: Spacing.xl,
  },
  emptyEmoji: { fontSize: 72, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  emptySubtitle: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  resetBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.btn,
  },
  resetBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textInverse },

  // Bottom actions
  bottomArea: { paddingHorizontal: 24, alignItems: 'center' },
  counter: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.md },
  actionRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 18 },
  actionBtn: { justifyContent: 'center', alignItems: 'center' },
  skipBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border,
  },
  superBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.swipeSuper,
  },
  likeBtn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primary,
  },
  skipIcon: { fontSize: 24, color: Colors.swipeNo },
  superIcon: { fontSize: 20, color: Colors.swipeSuper },
  likeIcon: { fontSize: 30, color: '#fff' },
});
