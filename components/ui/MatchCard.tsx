import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { Pet } from '@/constants/mockData';
import { useRouter } from 'expo-router';

interface MatchCardProps {
  pet: Pet;
  matchedAt?: Date;
  onMessage?: () => void;
}

export function MatchCard({ pet, matchedAt, onMessage }: MatchCardProps) {
  const router = useRouter();

  const formatMatchTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const ageLabel = pet.age >= 12
    ? `${Math.floor(pet.age / 12)}y`
    : `${pet.age}mo`;

  const handleMessage = () => {
    if (onMessage) {
      onMessage();
    } else {
      router.push(`/chat/${pet.id}`);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, Shadows.card]}
      onPress={() => router.push(`/pet/${pet.id}`)}
      activeOpacity={0.85}
    >
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <Avatar uri={pet.photos[0]} name={pet.name} size="lg" showOnline isOnline={pet.isOnline} />
        {pet.isOnline && <View style={styles.onlineDot} />}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.age}>{ageLabel}</Text>
          <View style={[styles.genderBadge, pet.gender === 'male' ? styles.maleBadge : styles.femaleBadge]}>
            <Text style={styles.genderText}>{pet.gender === 'male' ? '♂' : '♀'}</Text>
          </View>
        </View>

        <Text style={styles.breed} numberOfLines={1}>{pet.breed}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.distance}>📍 {pet.distance.toFixed(1)} km</Text>
          {matchedAt && (
            <Text style={styles.matchedTime}>💖 Matched {formatMatchTime(matchedAt)}</Text>
          )}
        </View>

        {/* Tags */}
        <View style={styles.traits}>
          {pet.traits.slice(0, 2).map((t, i) => (
            <View key={i} style={[styles.trait, { backgroundColor: i === 0 ? Colors.pastelOrange + '60' : Colors.pastelPurple + '60' }]}>
              <Text style={styles.traitText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Message button */}
      <TouchableOpacity
        style={[styles.msgBtn, Shadows.sm]}
        onPress={handleMessage}
        activeOpacity={0.75}
      >
        <Text style={styles.msgIcon}>💬</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatarWrap: { position: 'relative', marginRight: Spacing.md },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2, borderColor: Colors.surface,
  },
  info: { flex: 1, marginRight: Spacing.sm },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  name: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginRight: Spacing.xs },
  age: { fontSize: FontSize.sm, color: Colors.textSecondary, marginRight: Spacing.xs },
  genderBadge: {
    width: 18, height: 18, borderRadius: 9,
    justifyContent: 'center', alignItems: 'center',
  },
  maleBadge: { backgroundColor: Colors.pastelPurple },
  femaleBadge: { backgroundColor: Colors.pastelPink },
  genderText: { fontSize: 10, fontWeight: '700', color: Colors.textPrimary },
  breed: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs },
  distance: { fontSize: FontSize.xs, color: Colors.textMuted },
  matchedTime: { fontSize: FontSize.xs, color: Colors.matchPink, fontWeight: '600' },
  traits: { flexDirection: 'row', gap: 4 },
  trait: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: BorderRadius.chip,
  },
  traitText: { fontSize: 10, color: Colors.textPrimary, fontWeight: '500' },
  msgBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.primary + '30',
  },
  msgIcon: { fontSize: 20 },
});