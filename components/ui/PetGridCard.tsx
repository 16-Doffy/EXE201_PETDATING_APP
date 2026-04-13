import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { Pet } from '@/constants/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = Spacing.md;
const CARD_W = (SCREEN_WIDTH - Spacing.xl * 2 - GRID_GAP) / 2;

interface PetGridCardProps {
  pet: Pet;
  onPress?: () => void;
}

export function PetGridCard({ pet, onPress }: PetGridCardProps) {
  const ageLabel = pet.age >= 12
    ? `${Math.floor(pet.age / 12)}y`
    : `${pet.age}mo`;

  return (
    <TouchableOpacity style={[styles.card, Shadows.card]} onPress={onPress} activeOpacity={0.9}>
      {/* Image */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: pet.photos[0] }} style={styles.image} resizeMode="cover" />

        {/* Gradient overlay — name on top of image */}
        <View style={styles.overlay} />

        {/* Top badges */}
        <View style={styles.topBadges}>
          {pet.isOnline && (
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
            </View>
          )}
        </View>

        {/* Name + age directly on image */}
        <View style={styles.nameOnImage}>
          <Text style={styles.name} numberOfLines={1}>{pet.name}</Text>
          <Text style={styles.age}>{ageLabel}</Text>
        </View>
      </View>

      {/* Info below image */}
      <View style={styles.info}>
        <Text style={styles.breed} numberOfLines={1}>{pet.breed}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.distance}>📍 {pet.distance.toFixed(1)} km</Text>
          <View style={[styles.genderBadge, pet.gender === 'male' ? styles.male : styles.female]}>
            <Text style={styles.genderText}>{pet.gender === 'male' ? '♂' : '♀'}</Text>
          </View>
        </View>
        <View style={styles.tags}>
          {pet.traits.slice(0, 1).map((t, i) => (
            <View key={i} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const GRID_CARD_WIDTH = CARD_W;

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: GRID_GAP,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: CARD_W * 1.05, backgroundColor: Colors.pastelOrange },
  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: '45%',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  topBadges: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    flexDirection: 'row',
  },
  onlineBadge: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3,
  },
  onlineDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.success,
    borderWidth: 2, borderColor: Colors.surface,
  },
  nameOnImage: {
    position: 'absolute', bottom: Spacing.sm, left: Spacing.sm,
    flexDirection: 'row', alignItems: 'baseline',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  name: { fontSize: FontSize.md, fontWeight: '700', color: '#fff', marginRight: 4 },
  age: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.85)' },
  info: { padding: Spacing.md },
  breed: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
  distance: { fontSize: FontSize.xs, color: Colors.textMuted },
  genderBadge: {
    width: 20, height: 20, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  male: { backgroundColor: Colors.pastelPurple },
  female: { backgroundColor: Colors.pastelPink },
  genderText: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  tags: { flexDirection: 'row', gap: 4 },
  tag: {
    backgroundColor: Colors.pastelOrange + '50',
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: BorderRadius.chip,
  },
  tagText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500' },
});