import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';

function SettingsItem({
  emoji, label, onPress, destructive, note,
}: {
  emoji: string;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
  note?: string;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.itemEmoji}>{emoji}</Text>
      <View style={styles.itemContent}>
        <Text style={[styles.itemLabel, destructive && styles.destructive]}>{label}</Text>
        {note && <Text style={styles.itemNote}>{note}</Text>}
      </View>
      <Text style={styles.itemArrow}>›</Text>
    </TouchableOpacity>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={[styles.sectionCard, Shadows.sm]}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeOnboarding } = useApp();

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <SettingSection title="Account">
          <SettingsItem emoji="👤" label="Edit Profile" />
          <View style={styles.divider} />
          <SettingsItem emoji="🐾" label="My Pet" note="Buddy 😊" />
          <View style={styles.divider} />
          <SettingsItem emoji="📸" label="Photos & Media" />
          <View style={styles.divider} />
          <SettingsItem emoji="🔐" label="Privacy & Security" />
        </SettingSection>

        <SettingSection title="Notifications">
          <SettingsItem emoji="🔔" label="Push Notifications" note="On" />
          <View style={styles.divider} />
          <SettingsItem emoji="📧" label="Email Notifications" note="Daily" />
          <View style={styles.divider} />
          <SettingsItem emoji="💬" label="Message Alerts" note="On" />
        </SettingSection>

        <SettingSection title="Discovery">
          <SettingsItem emoji="📍" label="Location" note="San Francisco, CA" />
          <View style={styles.divider} />
          <SettingsItem emoji="👁" label="Show Me On App" note="Visible" />
          <View style={styles.divider} />
          <SettingsItem emoji="🎂" label="Age Preferences" note="All ages" />
          <View style={styles.divider} />
          <SettingsItem emoji="🔎" label="Distance Radius" note="Within 50 km" />
        </SettingSection>

        <SettingSection title="Support">
          <SettingsItem emoji="❓" label="Help & FAQ" />
          <View style={styles.divider} />
          <SettingsItem emoji="💡" label="Send Feedback" />
          <View style={styles.divider} />
          <SettingsItem emoji="📜" label="Terms of Service" />
          <View style={styles.divider} />
          <SettingsItem emoji="🔒" label="Privacy Policy" />
          <View style={styles.divider} />
          <SettingsItem emoji="📱" label="App Version" note="1.0.0" />
        </SettingSection>

        <View style={styles.logoutSection}>
          <SettingsItem
            emoji="🚪"
            label="Log Out"
            destructive
            onPress={() => {
              completeOnboarding();
              router.replace('/(onboarding)');
            }}
          />
        </View>

        <Text style={styles.footer}>PetDating v1.0.0 💖</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center',
    ...Shadows.sm,
  },
  backIcon: { fontSize: 22, color: Colors.textPrimary },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  content: { paddingBottom: 40 },
  section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: Spacing.sm, marginLeft: Spacing.xs,
  },
  sectionCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, overflow: 'hidden',
  },
  item: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg,
  },
  itemEmoji: { fontSize: 20, marginRight: Spacing.md },
  itemContent: { flex: 1 },
  itemLabel: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '500' },
  itemNote: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  itemArrow: { fontSize: 22, color: Colors.textMuted },
  destructive: { color: Colors.error },
  divider: { height: 1, backgroundColor: Colors.divider, marginLeft: 52 },
  logoutSection: { paddingHorizontal: Spacing.xl, marginTop: Spacing.md },
  footer: {
    textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted,
    marginTop: Spacing.lg, marginBottom: Spacing.xl,
  },
});
