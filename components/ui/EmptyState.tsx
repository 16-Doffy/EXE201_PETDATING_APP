import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';

interface EmptyStateProps { emoji: string; title: string; description: string; }

export function EmptyState({ emoji, title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xxxl, paddingBottom: 100 },
  emoji: { fontSize: 80, marginBottom: Spacing.xl },
  title: { fontSize: FontSize.xl, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm },
  description: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
});
