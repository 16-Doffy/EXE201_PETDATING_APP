import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { BorderRadius, FontSize, Shadows, Spacing } from '@/constants/theme';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { apiRequest } from '@/services/api';
import { buildBasicAuthorization } from '@/services/adminAuth';
import { ApiEnvelope, AdminDashboardResponse } from '@/types/admin';

export default function AdminLayout() {
  const { isAuthenticated, isReady, signIn } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    const nextUsername = username.trim();
    if (!nextUsername || !password) {
      setError('Enter both admin username and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiRequest<ApiEnvelope<AdminDashboardResponse>>('/api/v1/admin/dashboard', {
        authHeader: buildBasicAuthorization({ username: nextUsername, password }),
      });
      signIn({ username: nextUsername, password });
    } catch (err: any) {
      setError(err?.message || 'Admin sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={styles.loadingText}>Preparing admin console...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.authWrap}>
          <View style={[styles.authCard, Shadows.card]}>
            <Text style={styles.title}>Admin Sign In</Text>
            <Text style={styles.subtitle}>Use the backend `ADMIN_USERNAME` and `ADMIN_PASSWORD` to open the admin console.</Text>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Username</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                placeholder="admin"
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={handleSignIn}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={loading}
              onPress={handleSignIn}
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            >
              {loading ? <ActivityIndicator color={Colors.textInverse} /> : <Text style={styles.primaryBtnText}>Sign In</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    />
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  loadingText: { color: Colors.textSecondary, fontSize: FontSize.sm },
  authWrap: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  authCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { color: Colors.textSecondary, lineHeight: 22 },
  fieldWrap: { gap: Spacing.xs },
  fieldLabel: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '700' },
  input: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  errorText: { color: Colors.error, lineHeight: 20 },
  primaryBtn: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.btn,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: Spacing.lg,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { color: Colors.textInverse, fontSize: FontSize.md, fontWeight: '700' },
});
