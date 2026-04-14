import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, FontSize, Shadows, Spacing } from '@/constants/theme';
import { getAdminDashboard } from '@/services/adminService';
import { API_BASE_URL } from '@/services/api';
import { AdminDashboardResponse } from '@/types/admin';

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <View style={[styles.statCard, Shadows.sm]}>
      <View style={[styles.statAccent, { backgroundColor: tone }]} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function AdminHomeScreen() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async (silent = false) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await getAdminDashboard();
      setDashboard(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load admin dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadDashboard(true)} />}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Admin Console</Text>
            <Text style={styles.subtitle}>Moderation and analytics for the mobile app.</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.backBtn, Shadows.sm]} onPress={() => router.back()} activeOpacity={0.8}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.apiCard, Shadows.sm]}>
          <Text style={styles.apiTitle}>Backend</Text>
          <Text style={styles.apiText}>{API_BASE_URL}</Text>
          <Text style={styles.apiHint}>
            Set `EXPO_PUBLIC_ADMIN_API_URL` to your deployed admin backend URL on Vercel, or to your LAN/local backend when testing on devices.
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionCard, Shadows.card]} onPress={() => router.push('/admin/users')} activeOpacity={0.85}>
            <Text style={styles.actionEmoji}>👤</Text>
            <Text style={styles.actionTitle}>Manage Users</Text>
            <Text style={styles.actionSubtitle}>Search, review status, suspend or ban.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, Shadows.card]} onPress={() => router.push('/admin/pets')} activeOpacity={0.85}>
            <Text style={styles.actionEmoji}>🐾</Text>
            <Text style={styles.actionTitle}>Moderate Pets</Text>
            <Text style={styles.actionSubtitle}>Hide or archive pets directly from the app.</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.stateText}>Loading dashboard...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Cannot reach admin API</Text>
            <Text style={styles.stateText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => loadDashboard()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : dashboard ? (
          <>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.grid}>
              <StatCard label="Total Users" value={dashboard.totalUsers} tone={Colors.primary} />
              <StatCard label="Active Users" value={dashboard.activeUsers} tone={Colors.success} />
              <StatCard label="Suspended" value={dashboard.suspendedUsers} tone={Colors.error} />
              <StatCard label="Total Pets" value={dashboard.totalPets} tone={Colors.secondary} />
              <StatCard label="Visible Pets" value={dashboard.visiblePets} tone={Colors.pastelGreen} />
              <StatCard label="Matches" value={dashboard.totalMatches} tone={Colors.matchPink} />
              <StatCard label="Chats" value={dashboard.totalConversations} tone={Colors.pastelOrange} />
              <StatCard label="Messages" value={dashboard.totalMessages} tone={Colors.pastelPurple} />
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  headerActions: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  title: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { marginTop: 4, fontSize: FontSize.sm, color: Colors.textSecondary, maxWidth: 240 },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 22, color: Colors.textPrimary },
  apiCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  apiTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: 4 },
  apiText: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '700' },
  apiHint: { marginTop: 6, fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },
  actionRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
  },
  actionEmoji: { fontSize: 28, marginBottom: Spacing.sm },
  actionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  actionSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  statCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  statAccent: { width: 32, height: 6, borderRadius: 999, marginBottom: Spacing.md },
  statValue: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { marginTop: 4, fontSize: FontSize.sm, color: Colors.textSecondary },
  stateCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  stateTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  stateText: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.btn,
  },
  retryText: { color: Colors.textInverse, fontWeight: '700' },
});
