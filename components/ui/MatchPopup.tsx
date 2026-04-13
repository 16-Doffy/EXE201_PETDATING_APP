import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useEffect, useRef } from 'react';

interface MatchPopupProps {
  pet: any;
  onClose: () => void;
}

export function MatchPopup({ pet, onClose }: MatchPopupProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const scale = useRef(new Animated.Value(0)).current;
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const heartAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (pet) {
      scale.setValue(0);
      avatarAnim.setValue(0);
      heartAnim.setValue(0);
      contentAnim.setValue(0);

      Animated.sequence([
        Animated.spring(scale, { toValue: 1, friction: 7, tension: 65, useNativeDriver: true }),
        Animated.parallel([
          Animated.spring(avatarAnim, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
          Animated.spring(heartAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
          Animated.timing(contentAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]),
      ]);
    }
  }, [pet]);

  if (!pet) return null;

  const handleSendMessage = () => {
    onClose();
    router.push(`/chat/${pet.id}`);
  };

  const avatarScale = avatarAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
  const heartScale = heartAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1.3] });
  const heartOpacity = heartAnim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 1, 1] });

  return (
    <Modal visible={!!pet} transparent animationType="none" statusBarTranslucent>
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

        {/* Card */}
        <Animated.View
          style={[
            styles.card,
            { paddingBottom: insets.bottom + 24 },
            { transform: [{ scale }], opacity: Animated.add(avatarAnim, 0.3) },
          ]}
        >
          {/* Confetti */}
          <Text style={styles.confettiLeft}>✨</Text>
          <Text style={styles.confettiRight}>✨</Text>

          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>MATCH!</Text>
          <Text style={styles.subtitle}>Woof! Woof! Woof! 🐾</Text>

          {/* Avatars */}
          <Animated.View
            style={[
              styles.avatarsRow,
              { opacity: avatarAnim, transform: [{ scale: avatarScale }] },
            ]}
          >
            {/* My pet */}
            <View style={styles.avatarCard}>
              <View style={styles.avatarImgWrap}>
                <Image source={{ uri: pet?.photos?.[0] }} style={styles.avatarImg} />
              </View>
              <Text style={styles.avatarName} numberOfLines={1}>My Pet</Text>
            </View>

            {/* Heart */}
            <Animated.View
              style={[
                styles.heartRing,
                { transform: [{ scale: heartScale }], opacity: heartOpacity },
              ]}
            >
              <Text style={styles.heartEmoji}>💖</Text>
            </Animated.View>

            {/* Their pet */}
            <View style={styles.avatarCard}>
              <View style={[styles.avatarImgWrap, { borderColor: Colors.matchPink }]}>
                <Image source={{ uri: pet?.photos?.[0] }} style={styles.avatarImg} />
              </View>
              <Text style={styles.avatarName} numberOfLines={1}>{pet?.name || 'Pet'}</Text>
            </View>
          </Animated.View>

          {/* Message box */}
          <Animated.View style={[styles.messageBox, { opacity: contentAnim }]}>
            <Text style={styles.messageTitle}>Time to say Woof-Woof!</Text>
            <Text style={styles.messageSubtitle}>You have 48 hours to meet! 🐕</Text>
          </Animated.View>

          {/* CTA */}
          <Animated.View style={[styles.actions, { opacity: contentAnim }]}>
            <TouchableOpacity
              style={[styles.ctaBtn, styles.woofBtn, Shadows.btn]}
              onPress={handleSendMessage}
              activeOpacity={0.85}
            >
              <Text style={styles.woofBtnText}>🐾 Woof-Woof!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctaBtn, styles.keepBtn]}
              onPress={onClose}
              activeOpacity={0.75}
            >
              <Text style={styles.keepBtnText}>Keep Exploring</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(90,60,150,0.72)' },
  card: {
    width: '90%', backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.xxl, padding: Spacing.xxxl,
    alignItems: 'center',
    ...Shadows.lg,
  },
  confettiLeft: { position: 'absolute', top: 20, left: 16, fontSize: 20 },
  confettiRight: { position: 'absolute', top: 20, right: 16, fontSize: 20 },
  closeBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  closeText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  title: {
    fontSize: 38, fontWeight: '900', color: '#fff',
    letterSpacing: 2, marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
  },
  subtitle: {
    fontSize: FontSize.sm, color: 'rgba(255,255,255,0.65)',
    marginBottom: Spacing.xxl, letterSpacing: 3,
  },
  avatarsRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl,
  },
  avatarCard: { alignItems: 'center', width: 100 },
  avatarImgWrap: {
    width: 100, height: 120, borderRadius: BorderRadius.lg,
    overflow: 'hidden', borderWidth: 3, borderColor: Colors.surface,
    backgroundColor: Colors.pastelOrange,
    ...Shadows.card,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarName: {
    fontSize: FontSize.sm, fontWeight: '700', color: '#fff',
    marginTop: Spacing.xs, textAlign: 'center',
  },
  heartRing: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.matchPink,
    justifyContent: 'center', alignItems: 'center',
    marginHorizontal: -Spacing.sm, zIndex: 1,
    borderWidth: 3, borderColor: '#fff',
    ...Shadows.card,
  },
  heartEmoji: { fontSize: 26 },
  messageBox: { alignItems: 'center', marginBottom: Spacing.xl },
  messageTitle: { fontSize: FontSize.xl, fontWeight: '700', color: '#fff', marginBottom: 4 },
  messageSubtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)' },
  actions: { width: '100%', gap: Spacing.md },
  ctaBtn: { width: '100%', paddingVertical: 16, borderRadius: BorderRadius.btn, alignItems: 'center' },
  woofBtn: { backgroundColor: '#fff' },
  woofBtnText: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.secondary },
  keepBtn: { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)' },
  keepBtnText: { fontSize: FontSize.lg, fontWeight: '600', color: '#fff' },
});