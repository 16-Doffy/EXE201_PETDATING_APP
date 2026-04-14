import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, FontSize, Shadows, Spacing } from '@/constants/theme';
import { getAdminPets, updateAdminPetModeration } from '@/services/adminService';
import { AdminPetResponse, PetStatus } from '@/types/admin';

const STATUS_FILTERS: Array<{ label: string; value?: PetStatus }> = [
  { label: 'All' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Archived', value: 'ARCHIVED' },
];

const VISIBILITY_FILTERS: Array<{ label: string; value?: boolean }> = [
  { label: 'Any' },
  { label: 'Visible', value: true },
  { label: 'Hidden', value: false },
];

function petStatusColor(status: PetStatus) {
  return status === 'ACTIVE' ? Colors.success : Colors.error;
}

export default function AdminPetsScreen() {
  const router = useRouter();
  const [pets, setPets] = useState<AdminPetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PetStatus | undefined>(undefined);
  const [visibleFilter, setVisibleFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('DESC');

  const loadPets = async (silent = false, resetPage = false) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const targetPage = resetPage ? 0 : page;
      const data = await getAdminPets(statusFilter, search.trim() || undefined, visibleFilter, targetPage, 20, sortBy, sortDirection);
      setPets(data.content);
      setTotalPages(data.totalPages);
      if (resetPage) setPage(0);
    } catch (err: any) {
      setError(err?.message || 'Failed to load pets.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPets(false, true);
  }, [statusFilter, visibleFilter, sortBy, sortDirection]);

  useEffect(() => {
    loadPets();
  }, [page]);

  const handleModeration = async (petId: string, isVisible: boolean, status: PetStatus) => {
    try {
      setUpdatingId(petId);
      const updated = await updateAdminPetModeration(petId, isVisible, status);
      setPets((prev) => prev.map((pet) => (pet.id === petId ? updated : pet)));
    } catch (err: any) {
      Alert.alert('Update failed', err?.message || 'Could not update pet moderation.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, Shadows.sm]} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Admin Pets</Text>
          <Text style={styles.subtitle}>Review visibility and archive unsafe profiles.</Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search pet, breed, owner, city..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => loadPets(false, true)}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={() => loadPets(false, true)}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterGroup}>
        <View style={styles.filterRow}>
          {STATUS_FILTERS.map((item) => {
            const active = statusFilter === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setStatusFilter(item.value)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.filterRow}>
          {VISIBILITY_FILTERS.map((item) => {
            const active = visibleFilter === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setVisibleFilter(item.value)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.sortRow}>
        <TouchableOpacity 
          style={styles.sortBtn}
          onPress={() => setSortBy(sortBy === 'createdAt' ? 'name' : 'createdAt')}
        >
          <Text style={styles.sortBtnText}>Sort: {sortBy === 'createdAt' ? 'Date' : 'Name'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.sortBtn}
          onPress={() => setSortDirection(sortDirection === 'DESC' ? 'ASC' : 'DESC')}
        >
          <Text style={styles.sortBtnText}>{sortDirection === 'DESC' ? '↓' : '↑'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.stateWrap}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={styles.stateText}>Loading pets...</Text>
        </View>
      ) : error ? (
        <View style={styles.stateWrap}>
          <Text style={styles.errorTitle}>Cannot load pets</Text>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadPets()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={pets}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadPets(true)} />}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={[styles.card, Shadows.sm]}>
                <View style={styles.cardTop}>
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{item.name}</Text>
                    <Text style={styles.petMeta}>{item.species} • {item.breed} • {item.gender}</Text>
                    <Text style={styles.petMeta}>Owner: {item.ownerName || 'Unknown'}{item.city ? ` • ${item.city}` : ''}</Text>
                  </View>
                  <View style={styles.badgeColumn}>
                    <View style={[styles.badge, { backgroundColor: petStatusColor(item.status) + '20' }]}>
                      <Text style={[styles.badgeText, { color: petStatusColor(item.status) }]}>{item.status}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: (item.isVisible ? Colors.success : Colors.textMuted) + '20' }]}>
                      <Text style={[styles.badgeText, { color: item.isVisible ? Colors.success : Colors.textSecondary }]}>
                        {item.isVisible ? 'VISIBLE' : 'HIDDEN'}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text numberOfLines={2} style={styles.bioText}>{item.bio || 'No bio available.'}</Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.successBtn]}
                    disabled={updatingId === item.id}
                    onPress={() => handleModeration(item.id, true, 'ACTIVE')}
                  >
                    <Text style={styles.actionText}>Show</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.warnBtn]}
                    disabled={updatingId === item.id}
                    onPress={() => handleModeration(item.id, false, item.status)}
                  >
                    <Text style={styles.actionText}>Hide</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.dangerBtn]}
                    disabled={updatingId === item.id}
                    onPress={() => handleModeration(item.id, false, 'ARCHIVED')}
                  >
                    <Text style={styles.actionText}>Archive</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.stateWrap}>
                <Text style={styles.errorTitle}>No pets found</Text>
                <Text style={styles.stateText}>Try another search keyword or moderation filter.</Text>
              </View>
            }
          />
          <View style={styles.paginationWrap}>
            <TouchableOpacity 
              style={[styles.pageBtn, page === 0 && styles.pageBtnDisabled]}
              onPress={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              <Text style={styles.pageBtnText}>← Prev</Text>
            </TouchableOpacity>
            <Text style={styles.pageInfo}>Page {page + 1} of {totalPages}</Text>
            <TouchableOpacity 
              style={[styles.pageBtn, page >= totalPages - 1 && styles.pageBtnDisabled]}
              onPress={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
            >
              <Text style={styles.pageBtnText}>Next →</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  backIcon: { fontSize: 22, color: Colors.textPrimary },
  headerText: { flex: 1 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { marginTop: 2, fontSize: FontSize.sm, color: Colors.textSecondary },
  searchWrap: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.xl, marginBottom: Spacing.md },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  searchBtnText: { color: Colors.textInverse, fontWeight: '700' },
  filterGroup: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, marginBottom: Spacing.md },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.chip,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { color: Colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: Colors.textInverse },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: 120, gap: Spacing.md },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.card, padding: Spacing.lg, marginBottom: Spacing.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
  petInfo: { flex: 1 },
  petName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  petMeta: { marginTop: 4, fontSize: FontSize.sm, color: Colors.textSecondary },
  badgeColumn: { alignItems: 'flex-end', gap: Spacing.xs },
  badge: { paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: BorderRadius.chip },
  badgeText: { fontSize: FontSize.xs, fontWeight: '800' },
  bioText: { marginTop: Spacing.md, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  actionBtn: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.btn, alignItems: 'center' },
  successBtn: { backgroundColor: Colors.success },
  warnBtn: { backgroundColor: Colors.primary },
  dangerBtn: { backgroundColor: Colors.error },
  actionText: { color: Colors.textInverse, fontWeight: '700', fontSize: FontSize.xs },
  stateWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.md },
  stateText: { textAlign: 'center', color: Colors.textSecondary, lineHeight: 20 },
  errorTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.btn,
  },
  retryText: { color: Colors.textInverse, fontWeight: '700' },
  sortRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.xl, marginBottom: Spacing.md },
  sortBtn: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.chip,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  sortBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: FontSize.sm },
  paginationWrap: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  pageBtn: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.btn,
    alignItems: 'center',
  },
  pageBtnDisabled: { backgroundColor: Colors.border, opacity: 0.5 },
  pageBtnText: { color: Colors.textInverse, fontWeight: '700', fontSize: FontSize.sm },
  pageInfo: { alignSelf: 'center', color: Colors.textSecondary, fontWeight: '600', fontSize: FontSize.sm },
});
