import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { PRICING } from '@eiko/shared-types';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const api = useApi();

  const { data: subData } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get<any>('/subscriptions/status'),
  });
  const subscription = subData?.data;
  const isPremium = subscription?.tier === 'PREMIUM';

  function handleLogout() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.displayName?.charAt(0)?.toUpperCase() || 'E'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.displayName || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="sparkles" size={14} color={colors.primary} />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
      </Animated.View>

      {/* Subscription Section */}
      <Animated.View entering={FadeInDown.duration(300).delay(100)} style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Plan</Text>
            <Text style={styles.rowValue}>{isPremium ? 'Eiko Premium' : 'Free'}</Text>
          </View>
          {isPremium && subscription?.priceId && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Billing</Text>
              <Text style={styles.rowValue}>
                {subscription.priceId.includes('annual') ? PRICING.annual.label : PRICING.monthly.label}
              </Text>
            </View>
          )}
          {!isPremium && (
            <TouchableOpacity style={styles.upgradeBtn}>
              <Ionicons name="sparkles" size={18} color="#fff" />
              <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
          {isPremium && (
            <TouchableOpacity style={styles.manageBtn}>
              <Text style={styles.manageBtnText}>Manage Subscription</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Settings Section */}
      <Animated.View entering={FadeInDown.duration(300).delay(200)} style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingsLabel}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="moon-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingsLabel}>Appearance</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="globe-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingsLabel}>Timezone</Text>
            <Text style={styles.settingsValue}>{user?.timezone || 'UTC'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Data Section */}
      <Animated.View entering={FadeInDown.duration(300).delay(300)} style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="download-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingsLabel}>Export Data</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingsRow, { borderBottomWidth: 0 }]}>
            <Ionicons name="trash-outline" size={20} color={colors.destructive} />
            <Text style={[styles.settingsLabel, { color: colors.destructive }]}>Delete Account</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Eiko Habits v1.0.0</Text>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing['4xl'] },

  header: { alignItems: 'center', marginBottom: spacing['2xl'] },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  avatarText: { ...typography.h1, color: colors.primary },
  name: { ...typography.h2, color: colors.textPrimary },
  email: { ...typography.bodySmall, color: colors.textTertiary, marginTop: spacing.xs },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, marginTop: spacing.sm,
  },
  premiumText: { ...typography.caption, color: colors.primary, fontWeight: '600', marginLeft: spacing.xs },

  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.base, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  upgradeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.primary, margin: spacing.base, padding: spacing.md, borderRadius: borderRadius.md,
  },
  upgradeBtnText: { ...typography.body, color: '#fff', fontWeight: '600' },
  manageBtn: { alignItems: 'center', padding: spacing.base },
  manageBtnText: { ...typography.body, color: colors.primary, fontWeight: '600' },
  settingsRow: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.base,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  settingsLabel: { ...typography.body, color: colors.textPrimary, flex: 1, marginLeft: spacing.md },
  settingsValue: { ...typography.bodySmall, color: colors.textTertiary },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    paddingVertical: spacing.base, marginTop: spacing.md,
  },
  logoutText: { ...typography.body, color: colors.destructive, fontWeight: '600' },
  version: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.xl },
});
