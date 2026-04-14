import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { Pet } from '@/constants/mockData';

function SettingsItem({ emoji, label, onPress, destructive }: {
  emoji: string; label: string; onPress?: () => void; destructive?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.settingsEmoji}>{emoji}</Text>
      <Text style={[styles.settingsLabel, destructive && styles.destructive]}>{label}</Text>
      <Text style={styles.settingsArrow}>›</Text>
    </TouchableOpacity>
  );
}

function StatBadge({ emoji, value, label }: { emoji: string; value: number; label: string }) {
  return (
    <View style={styles.statBadge}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TagPill({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tagPill, { backgroundColor: color + '40' }]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

// My pet data (mock current user's pet)
const myPet: Pet = {
  id: 'my1',
  name: 'Buddy 😊',
  species: 'dog',
  breed: 'Golden Retriever',
  age: 24,
  gender: 'male',
  distance: 0,
  photos: ['https://placedog.net/600/800?id=900'],
  bio: 'Friendly golden boy who loves everyone! Always ready for a game of fetch or a cuddle session.',
  traits: ['Playful', 'Friendly', 'Trained'],
  personalityTags: ['Energetic', 'Social', 'Loyal', 'Gentle'],
  favoriteActivities: ['Beach walks', 'Fetch', 'Swimming', 'Cuddles'],
  vaccineStatus: 'vaccinated',
  gallery: ['https://placedog.net/600/800?id=901', 'https://placedog.net/600/800?id=902', 'https://placedog.net/600/800?id=903', 'https://placedog.net/600/800?id=904'],
  owner: { id: 'user1', name: 'Alex Johnson', avatar: 'https://placedog.net/80/80?id=900' },
  isOnline: true,
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, getMatchPets, getFavoritePets, signOut } = useApp();
  const ownerUser = state.user ?? {
    name: 'Guest',
    email: 'guest@example.com',
    avatar: 'https://placehold.co/80x80/png',
  };
  const matches = getMatchPets();
  const favorites = getFavoritePets();

  const ageLabel = myPet.age >= 12
    ? `${Math.floor(myPet.age / 12)} year${myPet.age >= 24 ? 's' : ''} old`
    : `${myPet.age} months old`;

  const vaccineColor = myPet.vaccineStatus === 'vaccinated' ? Colors.success : myPet.vaccineStatus === 'partial' ? '#F59E0B' : Colors.error;
  const vaccineLabel = myPet.vaccineStatus === 'vaccinated' ? '✅ Vaccinated' : myPet.vaccineStatus === 'partial' ? '🟡 Partial' : '⚠️ Not vaccinated';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile 👤</Text>
        </View>

        {/* Pet Hero Card */}
        <View style={[styles.heroCard, Shadows.lg]}>
          {/* Cover image */}
          <Image source={{ uri: myPet.gallery?.[0] || myPet.photos[0] }} style={styles.coverImage} />

          {/* Gradient overlay */}
          <View style={styles.heroOverlay} />

          {/* Avatar on cover */}
          <View style={styles.heroAvatarWrap}>
            <Avatar uri={myPet.photos[0]} name={myPet.name} size="xl" />
            {myPet.isOnline && (
              <View style={styles.onlineDot}>
                <Text style={styles.onlineDotText}>🟢 Online</Text>
              </View>
            )}
          </View>

          {/* Pet name + info on cover */}
          <View style={styles.heroInfo}>
            <View style={styles.heroNameRow}>
              <Text style={styles.heroName}>{myPet.name}</Text>
              <View style={[styles.genderBadge, myPet.gender === 'male' ? styles.maleBadge : styles.femaleBadge]}>
                <Text style={styles.genderText}>{myPet.gender === 'male' ? '♂' : '♀'}</Text>
              </View>
            </View>
            <Text style={styles.heroBreed}>🐕 {myPet.breed}</Text>
            <Text style={styles.heroAge}>{ageLabel}</Text>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>📝 About {myPet.name}</Text>
          <View style={[styles.bioCard, Shadows.sm]}>
            <Text style={styles.bioText}>{myPet.bio}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBadge emoji="❤️" value={favorites.length} label="Likes" />
          <StatBadge emoji="💖" value={matches.length} label="Matches" />
          <StatBadge emoji="🎮" value={3} label="Playdates" />
        </View>

        {/* Personality Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>🏷️ Personality</Text>
          <View style={styles.tagRow}>
            {myPet.personalityTags?.map((tag, i) => (
              <TagPill key={i} label={tag} color={Colors.primary} />
            ))}
          </View>
        </View>

        {/* Favorite Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>🎯 Favorite Activities</Text>
          <View style={styles.tagRow}>
            {myPet.favoriteActivities?.map((act, i) => (
              <TagPill key={i} label={act} color={Colors.secondary} />
            ))}
          </View>
        </View>

        {/* Vaccine Status */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>🏥 Health Status</Text>
          <TouchableOpacity style={[styles.vaccineCard, Shadows.sm]}>
            <View style={styles.vaccineLeft}>
              <Text style={styles.vaccineEmoji}>💉</Text>
              <Text style={[styles.vaccineText, { color: vaccineColor }]}>{vaccineLabel}</Text>
            </View>
            <Text style={styles.vaccineArrow}>Update</Text>
          </TouchableOpacity>
        </View>

        {/* Gallery */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>📸 Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
            {myPet.gallery?.map((uri, i) => (
              <View key={i} style={styles.galleryItem}>
                <Image source={{ uri }} style={styles.galleryImage} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Owner Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>👤 Owner</Text>
          <View style={[styles.ownerCard, Shadows.sm]}>
            <Avatar uri={ownerUser.avatar} name={ownerUser.name} size="lg" />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{ownerUser.name}</Text>
              <Text style={styles.ownerEmail}>{ownerUser.email}</Text>
            </View>
            <TouchableOpacity style={styles.editOwnerBtn}>
              <Text style={styles.editOwnerText}>✏️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>⚙️ Settings</Text>
          <View style={[styles.settingsCard, Shadows.sm]}>
            <SettingsItem emoji="👤" label="Edit Profile" />
            <View style={styles.divider} />
            <SettingsItem emoji="🔔" label="Notifications" />
            <View style={styles.divider} />
            <SettingsItem emoji="🔒" label="Privacy & Safety" />
            <View style={styles.divider} />
            <SettingsItem emoji="❓" label="Help & Support" />
            <View style={styles.divider} />
            <SettingsItem emoji="📱" label="App Info" />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <SettingsItem
            emoji="🚪"
            label="Log Out"
            destructive
            onPress={() => { signOut(); router.replace('/(onboarding)'); }}
          />
        </View>

        <Text style={styles.version}>PetDating v1.0.0 💖</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: {},
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  heroCard: {
    marginHorizontal: Spacing.xl, borderRadius: BorderRadius.xxl,
    overflow: 'hidden', backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  coverImage: { width: '100%', height: 200, backgroundColor: Colors.pastelOrange },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  heroAvatarWrap: { position: 'absolute', bottom: -40, left: Spacing.xl },
  onlineDot: { marginTop: Spacing.xs, flexDirection: 'row', alignItems: 'center' },
  onlineDotText: { fontSize: FontSize.xs, color: Colors.success, fontWeight: '600' },
  heroInfo: { padding: Spacing.xl, paddingTop: Spacing.md },
  heroNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  heroName: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary, marginRight: Spacing.sm },
  genderBadge: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  maleBadge: { backgroundColor: Colors.pastelPurple },
  femaleBadge: { backgroundColor: Colors.pastelPink },
  genderText: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  heroBreed: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: 2 },
  heroAge: { fontSize: FontSize.sm, color: Colors.textSecondary },
  section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  sectionLabel: {
    fontSize: FontSize.md, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  bioCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  bioText: { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 22 },
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg, gap: Spacing.sm },
  statBadge: {
    flex: 1, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statEmoji: { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tagPill: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.chip,
  },
  tagText: { fontSize: FontSize.sm, fontWeight: '600' },
  vaccineCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  vaccineLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  vaccineEmoji: { fontSize: 20 },
  vaccineText: { fontSize: FontSize.md, fontWeight: '600' },
  vaccineArrow: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '500' },
  galleryScroll: { gap: Spacing.sm },
  galleryItem: {
    width: 100, height: 100, borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  galleryImage: { width: '100%', height: '100%', backgroundColor: Colors.pastelOrange },
  ownerCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  ownerInfo: { flex: 1, marginLeft: Spacing.md },
  ownerName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  ownerEmail: { fontSize: FontSize.sm, color: Colors.textSecondary },
  editOwnerBtn: { padding: Spacing.sm },
  editOwnerText: { fontSize: 18 },
  settingsCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg,
  },
  settingsEmoji: { fontSize: 18, marginRight: Spacing.md },
  settingsLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '500' },
  destructive: { color: Colors.error },
  settingsArrow: { fontSize: 22, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.divider, marginLeft: 52 },
  version: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.lg, marginBottom: Spacing.xl },
});
