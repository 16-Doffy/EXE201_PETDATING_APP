import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { EmptyState } from '@/components/ui/EmptyState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.xl * 2 - Spacing.md) / 2;

export default function FavoritesScreen() {
  const router = useRouter();
  const { getFavoritePets } = useAppContext();
  const favorites = getFavoritePets();

  const renderItem = ({ item }: { item: typeof favorites[0] }) => (
    <TouchableOpacity style={[styles.card, Shadows.card]} onPress={() => router.push(`/pet/${item.id}`)}>
      <Image source={{ uri: item.photos[0] }} style={styles.cardImage} />
      {item.isOnline && <View style={styles.onlineDot} />}
      <View style={styles.cardInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.age}>{item.age >= 12 ? `${Math.floor(item.age / 12)}y` : `${item.age}m`}</Text>
        </View>
        <Text style={styles.breed}>{item.breed}</Text>
        <Text style={styles.distance}>📍 {item.distance.toFixed(1)} km</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>{favorites.length} pets liked</Text>
      </View>
      {favorites.length > 0 ? (
        <FlatList data={favorites} renderItem={renderItem} keyExtractor={item => item.id} numColumns={2} columnWrapperStyle={styles.row} contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false} />
      ) : (
        <EmptyState emoji="💔" title="No favorites yet" description="Start swiping on pets you like!" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  row: { justifyContent: 'space-between', marginBottom: Spacing.md },
  grid: { paddingHorizontal: Spacing.xl, paddingBottom: 120 },
  card: { width: CARD_WIDTH, borderRadius: BorderRadius.card, backgroundColor: Colors.surface, overflow: 'hidden' },
  cardImage: { width: '100%', height: CARD_WIDTH },
  onlineDot: { position: 'absolute', top: Spacing.sm, right: Spacing.sm, width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.surface },
  cardInfo: { padding: Spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 },
  name: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textPrimary, marginRight: Spacing.xs },
  age: { fontSize: FontSize.sm, color: Colors.textSecondary },
  breed: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: Spacing.xs },
  distance: { fontSize: FontSize.xs, color: Colors.textSecondary },
});
