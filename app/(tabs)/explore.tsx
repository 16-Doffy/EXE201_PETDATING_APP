import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { PetCard } from '@/components/pet/PetCard';
import { CategoryChip } from '@/components/ui/CategoryChip';

export default function ExploreScreen() {
  const router = useRouter();
  const { getFilteredPets } = useAppContext();

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Explore</Text></View>
      <View style={styles.search}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Search by breed, name..." placeholderTextColor={Colors.textMuted} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        <CategoryChip label="Nearby" emoji="📍" isActive />
        <CategoryChip label="Online" emoji="🟢" />
        <CategoryChip label="New" emoji="✨" />
        <View style={{ width: 20 }} />
      </ScrollView>
      <ScrollView contentContainerStyle={styles.results} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultTitle}>{getFilteredPets().length} pets found</Text>
        {getFilteredPets().map(pet => (
          <View key={pet.id} style={styles.cardWrapper}>
            <PetCard pet={pet} onPress={() => router.push(`/pet/${pet.id}`)} showActions={false} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textPrimary },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, marginHorizontal: Spacing.xl, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.lg, height: 50, ...Shadows.sm },
  searchIcon: { fontSize: 18, marginRight: Spacing.sm },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  filters: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, gap: Spacing.sm },
  results: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  resultTitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.lg },
  cardWrapper: { marginBottom: Spacing.xl },
});
