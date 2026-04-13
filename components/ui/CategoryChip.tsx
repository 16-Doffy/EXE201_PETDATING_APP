import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '@/constants/theme';

interface CategoryChipProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
  emoji?: string;
}

export function CategoryChip({ label, isActive, onPress, emoji }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, isActive ? styles.active : styles.inactive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.chip,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
  },
  active: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  inactive: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: Colors.border,
  },
  emoji: {
    fontSize: 14,
    marginRight: Spacing.xs,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  labelActive: {
    color: Colors.textInverse,
  },
  labelInactive: {
    color: Colors.textSecondary,
  },
});
