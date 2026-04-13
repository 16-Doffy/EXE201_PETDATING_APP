import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface AvatarProps { uri?: string; name?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; showOnline?: boolean; isOnline?: boolean; }

const sizes = { sm: 32, md: 48, lg: 80, xl: 120 };

export function Avatar({ uri, name, size = 'md', showOnline, isOnline }: AvatarProps) {
  const d = sizes[size];
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  return (
    <View style={[styles.container, { width: d, height: d }]}>
      {uri ? <Image source={{ uri }} style={[styles.image, { width: d, height: d, borderRadius: d / 2 }]} /> : (
        <View style={[styles.placeholder, { width: d, height: d, borderRadius: d / 2 }]}>
          <Text style={[styles.initials, { fontSize: d * 0.35 }]}>{initials}</Text>
        </View>
      )}
      {showOnline && <View style={[styles.dot, { width: d * 0.25, height: d * 0.25, borderRadius: d * 0.125, backgroundColor: isOnline ? Colors.success : Colors.textMuted }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  image: { borderWidth: 2, borderColor: Colors.surface },
  placeholder: { backgroundColor: Colors.pastelPurple, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.surface },
  initials: { fontWeight: '600', color: Colors.secondary },
  dot: { position: 'absolute', bottom: 2, right: 2, borderWidth: 2, borderColor: Colors.surface },
});
