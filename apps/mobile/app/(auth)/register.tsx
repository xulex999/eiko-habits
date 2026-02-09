import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
    if (pw.length < 8) return { level: 1, label: 'Weak', color: colors.destructive };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: colors.destructive };
    if (score === 2) return { level: 2, label: 'Fair', color: colors.streak };
    if (score === 3) return { level: 3, label: 'Good', color: colors.finance };
    return { level: 4, label: 'Strong', color: colors.finance };
  }

  async function handleRegister() {
    if (!displayName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(email.trim().toLowerCase(), password, displayName.trim());
      router.replace('/(auth)/onboarding/goals');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const strength = getPasswordStrength(password);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(400)} style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="flash" size={32} color="#fff" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Start building better habits today</Text>
        </Animated.View>

        {/* OAuth */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <TouchableOpacity style={styles.oauthButton} activeOpacity={0.7}>
            <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
            <Text style={styles.oauthText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.oauthButton, styles.appleButton]} activeOpacity={0.7}>
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={[styles.oauthText, { color: '#fff' }]}>Continue with Apple</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Display name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={colors.textTertiary}
            value={displayName}
            onChangeText={setDisplayName}
            autoComplete="name"
            accessibilityLabel="Display name"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            accessibilityLabel="Email address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="At least 8 characters"
            placeholderTextColor={colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
            accessibilityLabel="Password"
          />
          {password.length > 0 && (
            <View style={styles.strengthRow}>
              {[1, 2, 3, 4].map((level) => (
                <View
                  key={level}
                  style={[
                    styles.strengthBar,
                    { backgroundColor: level <= strength.level ? strength.color : colors.border },
                  ]}
                />
              ))}
              <Text style={[styles.strengthLabel, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          )}

          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor={colors.textTertiary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            accessibilityLabel="Confirm password"
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Create account</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Log in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingTop: spacing['4xl'] },
  logoSection: { alignItems: 'center', marginBottom: spacing.xl },
  logoCircle: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textTertiary, marginBottom: spacing.xl },
  oauthButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 48, borderRadius: borderRadius.md, borderWidth: 1,
    borderColor: colors.border, backgroundColor: colors.surface, marginBottom: spacing.md,
  },
  appleButton: { backgroundColor: '#000', borderColor: '#000' },
  oauthText: { ...typography.body, fontWeight: '600', color: colors.textPrimary, marginLeft: spacing.md },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { ...typography.bodySmall, color: colors.textTertiary, marginHorizontal: spacing.base },
  errorBox: { backgroundColor: colors.destructiveLight, padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.base },
  errorText: { ...typography.bodySmall, color: colors.destructive },
  label: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    height: 48, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md, backgroundColor: colors.surface,
    ...typography.body, color: colors.textPrimary, marginBottom: spacing.base,
  },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: -spacing.sm, marginBottom: spacing.base },
  strengthBar: { flex: 1, height: 4, borderRadius: 2, marginRight: 4 },
  strengthLabel: { ...typography.caption, marginLeft: spacing.sm },
  primaryButton: {
    height: 48, borderRadius: borderRadius.md, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing.md,
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: { ...typography.body, color: '#fff', fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing['3xl'] },
  footerText: { ...typography.body, color: colors.textTertiary },
  footerLink: { ...typography.body, color: colors.primary, fontWeight: '600' },
});
