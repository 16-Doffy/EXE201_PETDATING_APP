import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Colors, FontSize, BorderRadius, Spacing, Shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const slides = [
  { id: '1', emoji: '🐕', title: 'Find Perfect Friends\nfor Your Pet', description: 'Discover adorable pets nearby.', bgColor: Colors.pastelOrange },
  { id: '2', emoji: '💕', title: 'Swipe to Match\nwith Adorable Pets', description: 'Swipe right to like. Match when you both like each other!', bgColor: Colors.pastelPurple },
  { id: '3', emoji: '🎉', title: 'Chat & Plan\nPlaydates Together', description: 'Connect and schedule fun playdates!', bgColor: Colors.pastelGreen },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { startSession } = useApp();

  const handleStart = () => {
    startSession();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity style={styles.skip} onPress={handleStart}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.center}>
        {slides.map((slide) => (
          <View key={slide.id} style={[styles.slide, { backgroundColor: slide.bgColor }]}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>{slide.emoji}</Text>
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </View>
      <View style={styles.bottom}>
        <View style={styles.dots}>
          {slides.map((s, i) => (
            <View key={s.id} style={[styles.dot, i === 0 && styles.dotActive]} />
          ))}
        </View>
        <TouchableOpacity style={styles.ctaButton} onPress={handleStart}>
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  top: { paddingTop: 60, paddingHorizontal: Spacing.xl, alignItems: 'flex-end' },
  skip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  skipText: { fontSize: FontSize.md, fontWeight: '500', color: Colors.textSecondary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  slide: { width: SCREEN_WIDTH - 40, alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.huge, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.card },
  emojiContainer: { width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xxxl, ...Shadows.card },
  emoji: { fontSize: 80 },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.lg, lineHeight: 36 },
  description: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, paddingHorizontal: Spacing.md },
  bottom: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border, marginHorizontal: 4 },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  ctaButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.lg, borderRadius: BorderRadius.btn, alignItems: 'center', ...Shadows.btn },
  ctaText: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textInverse },
});
