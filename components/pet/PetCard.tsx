import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { Pet } from '@/constants/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 480;

interface PetCardProps { pet: Pet; onPress?: () => void; onLike?: () => void; onSkip?: () => void; showActions?: boolean; }

export function PetCard({ pet, onPress, onLike, onSkip, showActions = true }: PetCardProps) {
  const ageLabel = pet.age >= 12 ? `${Math.floor(pet.age / 12)} year${pet.age >= 24 ? 's' : ''}` : `${pet.age} month${pet.age !== 1 ? 's' : ''}`;
  return (
    <TouchableOpacity style={[styles.container, Shadows.card]} onPress={onPress} activeOpacity={0.95}>
      <Image source={{ uri: pet.photos[0] }} style={styles.image} resizeMode="cover" />
      <View style={styles.gradient} />
      {pet.isOnline && <View style={styles.badge}><View style={styles.onlineDot} /><Text style={styles.onlineText}>Online</Text></View>}
      <View style={styles.overlay}>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{pet.name}</Text>
            <Text style={styles.age}>{ageLabel}</Text>
          </View>
          <Text style={styles.breed}>{pet.breed}</Text>
          <View style={styles.distanceRow}><Text style={styles.distanceIcon}>📍</Text><Text style={styles.distance}>{pet.distance.toFixed(1)} km</Text></View>
          <View style={styles.traits}>
            {pet.traits.slice(0, 2).map((t, i) => <View key={i} style={styles.trait}><Text style={styles.traitText}>{t}</Text></View>)}
          </View>
          <View style={styles.owner}><Avatar uri={pet.owner.avatar} size="sm" /><Text style={styles.ownerName}>{pet.owner.name}</Text></View>
        </View>
      </View>
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.skip]} onPress={onSkip}><Text style={styles.skipIcon}>✕</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.like]} onPress={onLike}><Text style={styles.likeIcon}>♥</Text></TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: BorderRadius.card, backgroundColor: Colors.surface, overflow: 'hidden', alignSelf: 'center' },
  image: { width: '100%', height: '100%', position: 'absolute', backgroundColor: Colors.pastelOrange },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', backgroundColor: 'rgba(0,0,0,0.1)' },
  badge: { position: 'absolute', top: Spacing.lg, left: Spacing.lg, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.chip },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success, marginRight: Spacing.xs },
  onlineText: { fontSize: FontSize.xs, color: Colors.textInverse, fontWeight: '500' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.xl },
  info: {},
  nameRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: Spacing.xs },
  name: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textInverse, marginRight: Spacing.sm },
  age: { fontSize: FontSize.lg, color: 'rgba(255,255,255,0.85)' },
  breed: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.75)', marginBottom: Spacing.xs },
  distanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  distanceIcon: { fontSize: 14, marginRight: 4 },
  distance: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)' },
  traits: { flexDirection: 'row', marginBottom: Spacing.md },
  trait: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.chip, marginRight: Spacing.sm },
  traitText: { fontSize: FontSize.xs, color: Colors.textInverse, fontWeight: '500' },
  owner: { flexDirection: 'row', alignItems: 'center' },
  ownerName: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.9)', marginLeft: Spacing.sm, fontWeight: '500' },
  actions: { position: 'absolute', bottom: Spacing.xl, right: Spacing.lg, flexDirection: 'row', gap: Spacing.lg },
  btn: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surface, ...Shadows.card },
  skip: { borderWidth: 2, borderColor: Colors.border },
  like: { backgroundColor: Colors.primary },
  skipIcon: { fontSize: 24, color: Colors.textSecondary },
  likeIcon: { fontSize: 28, color: Colors.surface },
});