import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useEffect, useRef } from 'react';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    maxDistance: number; minAge: number; maxAge: number;
    onlineOnly: boolean; newestOnly: boolean; sameInterests: boolean;
  };
  onApply: (filters: FilterSheetProps['filters']) => void;
  onReset: () => void;
}

export function FilterSheet({ visible, onClose, filters, onApply, onReset }: FilterSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, { toValue: 0, friction: 22, tension: 65, useNativeDriver: true }).start();
    } else {
      Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible]);

  const distances = [5, 10, 20, 50];
  const ages = [0, 6, 12, 24, 36, 60, 120];

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 20, transform: [{ translateY }] }]}>
          {/* Handle bar */}
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Distance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Maximum Distance</Text>
            <View style={styles.chipRow}>
              {distances.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.chip, filters.maxDistance === d && styles.chipActive]}
                  onPress={() => onApply({ ...filters, maxDistance: d })}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, filters.maxDistance === d && styles.chipTextActive]}>
                    {d} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Age */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎂 Age Range</Text>
            <View style={styles.chipRow}>
              {ages.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.chip, filters.maxAge === a && styles.chipActive]}
                  onPress={() => onApply({ ...filters, maxAge: a })}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, filters.maxAge === a && styles.chipTextActive]}>
                    {a === 0 ? 'Any' : a >= 120 ? '10+ yrs' : a >= 12 ? `${Math.floor(a / 12)}y` : `${a}mo`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Toggles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ More Filters</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggle, filters.onlineOnly && styles.toggleActive]}
                onPress={() => onApply({ ...filters, onlineOnly: !filters.onlineOnly })}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleText, filters.onlineOnly && styles.toggleTextActive]}>🟢 Online Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggle, filters.newestOnly && styles.toggleActive]}
                onPress={() => onApply({ ...filters, newestOnly: !filters.newestOnly })}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleText, filters.newestOnly && styles.toggleTextActive]}>✨ Newest</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggle, filters.sameInterests && styles.toggleActive]}
                onPress={() => onApply({ ...filters, sameInterests: !filters.sameInterests })}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleText, filters.sameInterests && styles.toggleTextActive]}>🐾 Same Interests</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Apply button */}
          <TouchableOpacity style={styles.applyBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.applyText}>Show Results</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  handleRow: { alignItems: 'center', marginBottom: Spacing.md },
  handle: { width: 36, height: 5, borderRadius: 3, backgroundColor: Colors.border },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg,
  },
  title: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  resetText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '600' },
  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.md,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.chip, backgroundColor: Colors.background,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.md, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.textInverse },
  toggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  toggle: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.chip, backgroundColor: Colors.background,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  toggleActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  toggleText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  toggleTextActive: { color: Colors.textInverse },
  applyBtn: {
    backgroundColor: Colors.primary, paddingVertical: 16,
    borderRadius: BorderRadius.btn, alignItems: 'center', marginTop: Spacing.sm,
    ...Shadows.btn,
  },
  applyText: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textInverse },
});
