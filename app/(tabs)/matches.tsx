import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { MatchCard } from '@/components/ui/MatchCard';
import { EmptyState } from '@/components/ui/EmptyState';

const matchTimes: Record<string, Date> = {
  '1': new Date(Date.now() - 2 * 3600000),
  '2': new Date(Date.now() - 24 * 3600000),
  '3': new Date(Date.now() - 3 * 86400000),
  '4': new Date(Date.now() - 7 * 86400000),
};

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getMatchPets } = useApp();
  const matches = getMatchPets();

  const newMatches = matches.slice(0, 3);
  const yourMatches = matches;

  if (matches.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          <EmptyState
            emoji="💖"
            title="No matches yet"
            description="Keep swiping! When you and another pet both like each other, you'll see them here."
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Matches 💖</Text>
          <Text style={styles.subtitle}>
            {matches.length} mutual match{matches.length !== 1 ? 'es' : ''}
          </Text>
        </View>

        {/* New Matches — horizontal scroll */}
        {newMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ New Matches</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.newMatchesScroll}
            >
              {newMatches.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[styles.newMatchItem, Shadows.card]}
                  onPress={() => router.push(`/pet/${pet.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.newMatchAvatarWrap}>
                    <Avatar
                      uri={pet.photos[0]}
                      name={pet.name}
                      size="lg"
                      showOnline
                      isOnline={pet.isOnline}
                    />
                  </View>
                  <Text style={styles.newMatchName} numberOfLines={1}>{pet.name}</Text>
                  <Text style={styles.newMatchBreed} numberOfLines={1}>{pet.breed}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Your Matches */}
        {yourMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🐾 Your Matches</Text>
            <View style={styles.matchList}>
              {yourMatches.map((pet) => (
                <MatchCard
                  key={pet.id}
                  pet={pet}
                  matchedAt={matchTimes[pet.id]}
                  onMessage={() => router.push(`/chat/${pet.id}`)}
                />
              ))}
            </View>
          </View>
        )}

        {/* CTA */}
        <View style={[styles.ctaCard, Shadows.card]}>
          <Text style={styles.ctaEmoji}>🐕</Text>
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>Want more matches?</Text>
            <Text style={styles.ctaSubtitle}>Keep exploring to find perfect friends!</Text>
          </View>
          <TouchableOpacity
            style={[styles.ctaBtn, Shadows.btn]}
            onPress={() => router.push('/(tabs)')}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>Explore</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 100 },
  header: {
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
  },
  title: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5,
    paddingHorizontal: Spacing.xl, marginBottom: Spacing.md,
  },
  newMatchesScroll: {
    paddingHorizontal: Spacing.xl, gap: Spacing.md,
  },
  newMatchItem: {
    alignItems: 'center', width: 88,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm, paddingBottom: Spacing.md,
  },
  newMatchAvatarWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.pastelOrange,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  newMatchName: {
    fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary,
    textAlign: 'center', marginBottom: 2,
  },
  newMatchBreed: {
    fontSize: FontSize.xs, color: Colors.textSecondary,
    textAlign: 'center',
  },
  matchList: { paddingHorizontal: Spacing.xl },
  ctaCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  ctaEmoji: { fontSize: 36 },
  ctaText: { flex: 1 },
  ctaTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  ctaSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary },
  ctaBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.btn,
  },
  ctaBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textInverse },
});