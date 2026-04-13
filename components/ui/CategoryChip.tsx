import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '@/constants/theme';

interface CategoryChipProps { label: string; isActive?: boolean; onPress?: () => void; emoji?: string; }

export function CategoryChip({ label, isActive, onPress, emoji }: CategoryChipProps) {
  return (
    <TouchableOpacity style={[styles.chip, isActive && styles.active]} onPress={onPress} activeOpacity={0.7}>
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, backgroundColor: Colors.pastelOrange, borderRadius: BorderRadius.chip, marginRight: Spacing.sm },
  active: { backgroundColor: Colors.primary },
  emoji: { fontSize: 16, marginRight: Spacing.xs },
  label: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.textPrimary },
  labelActive: { color: Colors.textInverse },
});
