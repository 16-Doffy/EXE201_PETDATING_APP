import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { Colors, FontSize, Spacing, Shadows } from '@/constants/theme';
import { PetCard } from '@/components/pet/PetCard';
import { CategoryChip } from '@/components/ui/CategoryChip';

const categories = [
  { key: 'all', label: 'All', emoji: '🐾' },
  { key: 'dog', label: 'Dogs', emoji: '🐕' },
  { key: 'cat', label: 'Cats', emoji: '🐱' },
  { key: 'bird', label: 'Birds', emoji: '🐦' },
  { key: 'other', label: 'Others', emoji: '🐰' },
];

const genderFilters = [
  { key: 'all', label: 'All' },
  { key: 'male', label: '♂ Male' },
  { key: 'female', label: '♀ Female' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { state, getFilteredPets, toggleFavorite, setCategory, setGender } = useAppContext();
  const pets = getFilteredPets();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Discover</Text>
          <Text style={styles.subtitle}>Find perfect friends for your pet</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}><Text style={styles.filterIcon}>⚙️</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {categories.map(c => (
          <CategoryChip key={c.key} label={c.label} emoji={c.emoji} isActive={state.selectedCategory === c.key} onPress={() => setCategory(c.key as typeof state.selectedCategory)} />
        ))}
        <View style={{ width: 20 }} />
      </ScrollView>
      <View style={styles.genderFilters}>
        {genderFilters.map(g => (
          <TouchableOpacity key={g.key} style={[styles.chip, state.selectedGender === g.key && styles.chipActive]} onPress={() => setGender(g.key as typeof state.selectedGender)}>
            <Text style={[styles.chipText, state.selectedGender === g.key && styles.chipTextActive]}>{g.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.cards} showsVerticalScrollIndicator={false}>
        {pets.length > 0 ? pets.map(pet => (
          <View key={pet.id} style={styles.cardWrapper}>
            <PetCard pet={pet} onPress={() => router.push(`/pet/${pet.id}`)} onLike={() => toggleFavorite(pet.id)} onSkip={() => {}} />
          </View>
        )) : (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No pets found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  greeting: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  filterBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', ...Shadows.sm },
  filterIcon: { fontSize: 20 },
  categories: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  genderFilters: { flexDirection: 'row', paddingHorizontal: Spacing.xl, marginBottom: Spacing.md, gap: Spacing.sm },
  chip: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: 24, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  chipText: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.textSecondary },
  chipTextActive: { color: Colors.textInverse },
  cards: { paddingBottom: 100 },
  cardWrapper: { marginBottom: Spacing.xl },
  empty: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', minHeight: 200 },
  emptyEmoji: { fontSize: 60, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '600', color: Colors.textPrimary },
});
