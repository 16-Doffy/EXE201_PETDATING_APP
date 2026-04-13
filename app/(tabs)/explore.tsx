import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { PetGridCard } from '@/components/ui/PetGridCard';
import { FilterSheet } from '@/components/ui/FilterSheet';
import { useState } from 'react';

const speciesChips = [
  { key: 'all', label: 'All', emoji: '🐾' },
  { key: 'dog', label: 'Dogs', emoji: '🐕' },
  { key: 'cat', label: 'Cats', emoji: '🐱' },
  { key: 'bird', label: 'Birds', emoji: '🐦' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { state, getFilteredPets, setSearch, setCategory, setFilters, resetFilters, setGender } = useApp();
  const [showFilters, setShowFilters] = useState(false);

  const pets = getFilteredPets();
  const hasActiveFilters = state.onlineOnly || state.newestOnly || state.sameInterests || state.maxDistance < 50;

  const filters = {
    maxDistance: state.maxDistance, minAge: state.minAge, maxAge: state.maxAge,
    onlineOnly: state.onlineOnly, newestOnly: state.newestOnly, sameInterests: state.sameInterests,
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore 🔍</Text>
        <TouchableOpacity
          style={[styles.filterToggle, hasActiveFilters && styles.filterToggleActive, Shadows.sm]}
          onPress={() => setShowFilters(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.filterToggleIcon}>⚙️</Text>
          {hasActiveFilters && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* Search bar — compact */}
      <View style={styles.searchWrap}>
        <View style={[styles.search, Shadows.sm]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, breed, owner..."
            placeholderTextColor={Colors.textMuted}
            value={state.searchQuery}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {state.searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter chips — smaller, tighter */}
      <View style={styles.chipSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          {speciesChips.map(c => (
            <TouchableOpacity
              key={c.key}
              style={[styles.chip, state.selectedCategory === c.key && styles.chipActive]}
              onPress={() => setCategory(c.key as typeof state.selectedCategory)}
              activeOpacity={0.7}
            >
              {c.emoji && <Text style={styles.chipEmoji}>{c.emoji}</Text>}
              <Text style={[styles.chipText, state.selectedCategory === c.key && styles.chipTextActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.chipDivider} />

          <TouchableOpacity
            style={[styles.chip, state.selectedGender === 'male' && styles.chipMale]}
            onPress={() => setGender(state.selectedGender === 'male' ? 'all' : 'male')}
            activeOpacity={0.7}
          >
            <Text style={styles.chipEmoji}>♂</Text>
            <Text style={[styles.chipText, state.selectedGender === 'male' && styles.chipMaleText]}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, state.selectedGender === 'female' && styles.chipFemale]}
            onPress={() => setGender(state.selectedGender === 'female' ? 'all' : 'female')}
            activeOpacity={0.7}
          >
            <Text style={styles.chipEmoji}>♀</Text>
            <Text style={[styles.chipText, state.selectedGender === 'female' && styles.chipFemaleText]}>Female</Text>
          </TouchableOpacity>

          <View style={styles.chipDivider} />

          <TouchableOpacity
            style={[styles.chip, state.onlineOnly && styles.chipActive]}
            onPress={() => setFilters({ onlineOnly: !state.onlineOnly })}
            activeOpacity={0.7}
          >
            <Text style={styles.chipEmoji}>🟢</Text>
            <Text style={[styles.chipText, state.onlineOnly && styles.chipTextActive]}>Online</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, state.newestOnly && styles.chipActive]}
            onPress={() => setFilters({ newestOnly: !state.newestOnly })}
            activeOpacity={0.7}
          >
            <Text style={styles.chipEmoji}>✨</Text>
            <Text style={[styles.chipText, state.newestOnly && styles.chipTextActive]}>New</Text>
          </TouchableOpacity>

          <View style={styles.chipDivider} />

          <TouchableOpacity
            style={styles.moreFiltersBtn}
            onPress={() => setShowFilters(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.moreFiltersText}>🎛️</Text>
            <Text style={styles.moreFiltersLabel}>Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Results header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultCount}>{pets.length} pet{pets.length !== 1 ? 's' : ''} found</Text>
        {hasActiveFilters && (
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results grid */}
      {pets.length > 0 ? (
        <FlatList
          data={pets}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={({ item, index }) => (
            <View style={[styles.gridItem, index % 2 === 0 ? styles.gridLeft : styles.gridRight]}>
              <PetGridCard pet={item} onPress={() => router.push(`/pet/${item.id}`)} />
            </View>
          )}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>No pets found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
          {hasActiveFilters && (
            <TouchableOpacity
              style={[styles.resetBtn, Shadows.btn]}
              onPress={resetFilters}
              activeOpacity={0.8}
            >
              <Text style={styles.resetBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Filter sheet */}
      <FilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={(f) => { setFilters(f); setShowFilters(false); }}
        onReset={resetFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.sm,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  filterToggle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center',
  },
  filterToggleActive: { backgroundColor: Colors.primary },
  filterToggleIcon: { fontSize: 18 },
  filterDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.swipeNo,
  },
  searchWrap: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.sm },
  search: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md, height: 42,
    borderRadius: BorderRadius.lg,
  },
  searchIcon: { fontSize: 15, marginRight: Spacing.xs },
  searchInput: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary },
  clearIcon: { fontSize: 14, color: Colors.textMuted },
  chipSection: {
    paddingBottom: Spacing.xs,
  },
  chipScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 5, paddingHorizontal: Spacing.sm,
    borderRadius: 16, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    gap: 3,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipMale: { backgroundColor: Colors.pastelPurple, borderColor: Colors.pastelPurple },
  chipFemale: { backgroundColor: Colors.pastelPink, borderColor: Colors.pastelPink },
  chipEmoji: { fontSize: 11 },
  chipText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: Colors.textInverse },
  chipMaleText: { color: Colors.textPrimary },
  chipFemaleText: { color: Colors.textPrimary },
  chipDivider: {
    width: 1, height: 20,
    backgroundColor: Colors.border, marginHorizontal: 4,
  },
  moreFiltersBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 5, paddingHorizontal: Spacing.sm,
    borderRadius: 16, backgroundColor: Colors.pastelPurple + '30',
    borderWidth: 1, borderColor: Colors.pastelPurple,
    gap: 3,
  },
  moreFiltersText: { fontSize: 11 },
  moreFiltersLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.secondary },
  resultsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  resultCount: { fontSize: FontSize.sm, color: Colors.textSecondary },
  resetText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  resultsList: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xs },
  gridItem: { flex: 0.5 },
  gridLeft: { paddingRight: Spacing.xs },
  gridRight: { paddingLeft: Spacing.xs },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  resetBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.btn,
  },
  resetBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textInverse },
});