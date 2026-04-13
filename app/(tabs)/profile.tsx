import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';

function SettingsItem({ emoji, label, destructive, onPress }: { emoji: string; label: string; destructive?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, destructive && styles.destructive]}>{label}</Text>
      {onPress && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { state, getFavoritePets, completeOnboarding } = useAppContext();
  const myPet = { id: 'my', photos: ['https://i.pravatar.cc/400?img=68'], name: 'Buddy', breed: 'Mixed Breed' };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><Text style={styles.title}>Profile</Text></View>
      <View style={[styles.userCard, Shadows.card]}>
        <Avatar uri={state.user.avatar} size="xl" />
        <Text style={styles.userName}>{state.user.name}</Text>
        <Text style={styles.userEmail}>{state.user.email}</Text>
        <View style={styles.stats}>
          <View style={styles.stat}><Text style={styles.statNum}>{getFavoritePets().length}</Text><Text style={styles.statLabel}>Favorites</Text></View>
          <View style={styles.divider} />
          <View style={styles.stat}><Text style={styles.statNum}>3</Text><Text style={styles.statLabel}>Matches</Text></View>
          <View style={styles.divider} />
          <View style={styles.stat}><Text style={styles.statNum}>2</Text><Text style={styles.statLabel}>Playdates</Text></View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Pet</Text>
        <View style={[styles.petCard, Shadows.card]}>
          <Image source={{ uri: myPet.photos[0] }} style={styles.petImage} />
          <View style={styles.petInfo}><Text style={styles.petName}>{myPet.name}</Text><Text style={styles.petBreed}>{myPet.breed}</Text></View>
          <TouchableOpacity style={styles.editBtn}><Text style={styles.editIcon}>✏️</Text></TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={[styles.settings, Shadows.sm]}>
          <SettingsItem emoji="👤" label="Edit Profile" />
          <View style={styles.divider2} />
          <SettingsItem emoji="🔔" label="Notifications" />
          <View style={styles.divider2} />
          <SettingsItem emoji="🔒" label="Privacy" />
        </View>
      </View>
      <View style={styles.section}>
        <SettingsItem emoji="🚪" label="Log Out" destructive onPress={() => { completeOnboarding(); router.replace('/(onboarding)'); }} />
      </View>
      <Text style={styles.version}>PetDating v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 120 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textPrimary },
  userCard: { backgroundColor: Colors.surface, marginHorizontal: Spacing.xl, borderRadius: BorderRadius.card, padding: Spacing.xl, alignItems: 'center' },
  userName: { fontSize: FontSize.xl, fontWeight: '600', color: Colors.textPrimary, marginTop: Spacing.md },
  userEmail: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xl, paddingTop: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.divider, width: '100%', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statNum: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  divider: { width: 1, height: 32, backgroundColor: Colors.divider },
  section: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xxl },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.md, textTransform: 'uppercase' },
  petCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, overflow: 'hidden' },
  petImage: { width: 100, height: 100 },
  petInfo: { flex: 1, padding: Spacing.md },
  petName: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textPrimary },
  petBreed: { fontSize: FontSize.sm, color: Colors.textSecondary },
  editBtn: { padding: Spacing.lg },
  editIcon: { fontSize: 20 },
  settings: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg },
  emoji: { fontSize: 20, marginRight: Spacing.md },
  label: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  destructive: { color: Colors.error },
  arrow: { fontSize: 24, color: Colors.textMuted },
  divider2: { height: 1, backgroundColor: Colors.divider, marginLeft: 52 },
  version: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xxxl, marginBottom: Spacing.xxl },
});
