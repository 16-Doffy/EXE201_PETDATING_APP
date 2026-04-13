import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getPetById, state, toggleFavorite, getConversationByPetId } = useAppContext();
  const pet = getPetById(id);

  if (!pet) return <View style={styles.notFound}><Text style={styles.notFoundText}>Pet not found</Text></View>;

  const isFavorited = state.favorites.includes(pet.id);
  const conversation = getConversationByPetId(pet.id);
  const ageLabel = pet.age >= 12 ? `${Math.floor(pet.age / 12)} year${pet.age >= 24 ? 's' : ''} old` : `${pet.age} months old`;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: pet.photos[0] }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}><Text style={styles.shareIcon}>↗</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{pet.name}</Text>
              {pet.isOnline && <View style={styles.onlineBadge}><View style={styles.onlineDot} /><Text style={styles.onlineText}>Online</Text></View>}
            </View>
            <Text style={styles.ageBreed}>{ageLabel} · {pet.breed}</Text>
            <View style={styles.distance}><Text style={styles.distanceIcon}>📍</Text><Text style={styles.distanceText}>{pet.distance.toFixed(1)} km away</Text></View>
          </View>
          <View style={styles.ownerCard}>
            <Avatar uri={pet.owner.avatar} size="md" />
            <View style={styles.ownerInfo}><Text style={styles.ownerLabel}>Owner</Text><Text style={styles.ownerName}>{pet.owner.name}</Text></View>
            <Text style={styles.ownerArrow}>›</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {pet.name}</Text>
            <Text style={styles.bio}>{pet.bio}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Characteristics</Text>
            <View style={styles.traits}>
              {pet.traits.map((t, i) => (
                <View key={i} style={styles.trait}><Text style={styles.traitEmoji}>{['🌟', '💪', '❤️', '🎾'][i % 4]}</Text><Text style={styles.traitText}>{t}</Text></View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, isFavorited && styles.actionBtnActive]} onPress={() => toggleFavorite(pet.id)}>
          <Text style={[styles.actionIcon, isFavorited && styles.actionIconActive]}>{isFavorited ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.msgBtn, !conversation && styles.msgBtnDisabled]} onPress={() => conversation && router.push(`/chat/${conversation.id}`)} disabled={!conversation}>
          <Text style={styles.msgBtnText}>{conversation ? 'Send Message 💬' : 'Match to Message'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: FontSize.lg, color: Colors.textSecondary },
  hero: { position: 'relative' },
  heroImage: { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.2 },
  heroOverlay: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', ...Shadows.sm },
  backIcon: { fontSize: 24, color: Colors.textPrimary },
  shareBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', ...Shadows.sm },
  shareIcon: { fontSize: 20, color: Colors.textPrimary },
  content: { padding: Spacing.xl, marginTop: -Spacing.xl, backgroundColor: Colors.background, borderTopLeftRadius: BorderRadius.card, borderTopRightRadius: BorderRadius.card },
  mainInfo: { marginBottom: Spacing.xl },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  name: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textPrimary, marginRight: Spacing.md },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.pastelGreen, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.chip },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success, marginRight: Spacing.xs },
  onlineText: { fontSize: FontSize.xs, color: Colors.success, fontWeight: '600' },
  ageBreed: { fontSize: FontSize.lg, color: Colors.textSecondary, marginBottom: Spacing.sm },
  distance: { flexDirection: 'row', alignItems: 'center' },
  distanceIcon: { fontSize: 14, marginRight: 4 },
  distanceText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  ownerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: BorderRadius.lg, marginBottom: Spacing.xl, ...Shadows.sm },
  ownerInfo: { flex: 1, marginLeft: Spacing.md },
  ownerLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 2 },
  ownerName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  ownerArrow: { fontSize: 28, color: Colors.textMuted },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.md },
  bio: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 26 },
  traits: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  trait: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.pastelPurple, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.chip, gap: Spacing.xs },
  traitEmoji: { fontSize: 14 },
  traitText: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.textPrimary },
  actions: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border, gap: Spacing.md },
  actionBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.border, ...Shadows.sm },
  actionBtnActive: { borderColor: Colors.error, backgroundColor: Colors.pastelPink },
  actionIcon: { fontSize: 26, color: Colors.textSecondary },
  actionIconActive: { color: Colors.error },
  msgBtn: { flex: 1, height: 56, borderRadius: BorderRadius.btn, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', ...Shadows.btn },
  msgBtnDisabled: { backgroundColor: Colors.textMuted },
  msgBtnText: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textInverse },
});
