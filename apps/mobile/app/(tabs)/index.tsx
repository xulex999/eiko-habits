import { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { getGreeting, formatPercent } from '@eiko/shared-logic';
import type { ApiResponse, DashboardOverview } from '@eiko/shared-types';

export default function DashboardScreen() {
  const router = useRouter();
  const api = useApi();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Streak flame pulse animation
  const flameScale = useSharedValue(1);
  useEffect(() => {
    flameScale.value = withRepeat(withTiming(1.05, { duration: 2000 }), -1, true);
  }, []);
  const flameStyle = useAnimatedStyle(() => ({ transform: [{ scale: flameScale.value }] }));

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<ApiResponse<DashboardOverview>>('/dashboard/overview'),
  });

  const dashboard = data?.data;

  const checkInMutation = useMutation({
    mutationFn: (habitId: string) =>
      api.post(`/habits/${habitId}/check-in`, { value: 1 }),
    onSuccess: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const hour = new Date().getHours();
  const greeting = getGreeting(hour);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      {/* Greeting */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.greetingSection}>
        <Text style={styles.greeting}>
          {greeting}, {user?.displayName?.split(' ')[0] || 'there'}
        </Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        {dashboard?.currentStreakHighlight && (
          <View style={styles.streakBadge}>
            <Animated.View style={flameStyle}>
              <Ionicons name="flame" size={20} color={colors.streak} />
            </Animated.View>
            <Text style={styles.streakText}>
              {dashboard.currentStreakHighlight.streakDays} day streak
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Today's Habits */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          {dashboard?.todaysHabits && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {dashboard.todaysHabits.filter((h) => h.completedToday).length} of{' '}
                {dashboard.todaysHabits.length}
              </Text>
            </View>
          )}
        </View>

        {dashboard?.todaysHabits?.map((habit, index) => (
          <Animated.View
            key={habit.id}
            entering={FadeInRight.duration(300).delay(150 + index * 50)}
          >
            <TouchableOpacity
              style={styles.habitRow}
              onPress={() => router.push(`/habit/${habit.id}`)}
              activeOpacity={0.7}
            >
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  habit.completedToday && styles.checkboxChecked,
                ]}
                onPress={() => {
                  if (!habit.completedToday) {
                    checkInMutation.mutate(habit.id);
                  }
                }}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: habit.completedToday }}
                accessibilityLabel={`Mark ${habit.title} as complete`}
              >
                {habit.completedToday && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>
              <View style={styles.habitInfo}>
                <Text
                  style={[
                    styles.habitTitle,
                    habit.completedToday && styles.habitTitleDone,
                  ]}
                >
                  {habit.title}
                </Text>
                {habit.currentStreak > 0 && (
                  <Text style={styles.habitStreak}>
                    {habit.currentStreak} day streak
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          </Animated.View>
        ))}

        {dashboard?.todaysHabits?.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No habits due today</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/goal/create' as any)}
            >
              <Text style={styles.addButtonText}>Create a habit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* Upcoming Deadlines */}
      {dashboard?.upcomingDeadlines && dashboard.upcomingDeadlines.length > 0 && (
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dashboard.upcomingDeadlines.map((deadline) => (
              <View key={deadline.id} style={styles.deadlineCard}>
                <View style={styles.deadlineType}>
                  <Text style={styles.deadlineTypeText}>
                    {deadline.type === 'financial' ? 'Finance' : 'Goal'}
                  </Text>
                </View>
                <Text style={styles.deadlineTitle} numberOfLines={2}>
                  {deadline.title}
                </Text>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(100, deadline.percentComplete)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.deadlineDays}>
                  {deadline.daysRemaining} days left
                </Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Weekly Summary */}
      {dashboard?.weeklySummary && (
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.summaryCard}>
            <View style={styles.weekBars}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <View key={i} style={styles.dayColumn}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${(dashboard.weeklySummary.completionRates[i] || 0) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.dayLabel}>{day}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.summaryText}>
              {formatPercent(dashboard.weeklySummary.averageConsistency)} consistency
            </Text>
          </View>
        </Animated.View>
      )}

      <View style={{ height: spacing['4xl'] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing['4xl'] },

  greetingSection: { marginBottom: spacing.xl },
  greeting: { ...typography.display, color: colors.textPrimary },
  date: { ...typography.bodySmall, color: colors.textTertiary, marginTop: spacing.xs },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.streakLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
  },
  streakText: {
    ...typography.caption,
    color: colors.streak,
    marginLeft: spacing.xs,
  },

  section: { marginBottom: spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h2, color: colors.textPrimary },
  countBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  countText: { ...typography.caption, color: colors.primary },

  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  habitInfo: { flex: 1 },
  habitTitle: { ...typography.body, color: colors.textPrimary },
  habitTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  habitStreak: { ...typography.caption, color: colors.streak, marginTop: 2 },

  emptyState: { alignItems: 'center', paddingVertical: spacing['3xl'] },
  emptyText: { ...typography.body, color: colors.textTertiary },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.base,
  },
  addButtonText: { ...typography.body, color: '#fff', fontWeight: '600' },

  deadlineCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginRight: spacing.md,
    width: 180,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deadlineType: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  deadlineTypeText: { ...typography.overline, color: colors.primary },
  deadlineTitle: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  progressBarTrack: {
    height: 4,
    backgroundColor: colors.subtleBg,
    borderRadius: 2,
    marginTop: spacing.sm,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  deadlineDays: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },

  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weekBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    marginBottom: spacing.sm,
  },
  dayColumn: { alignItems: 'center', flex: 1 },
  barTrack: {
    flex: 1,
    width: 24,
    backgroundColor: colors.subtleBg,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  dayLabel: { ...typography.caption, color: colors.textTertiary, marginTop: 4 },
  summaryText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
