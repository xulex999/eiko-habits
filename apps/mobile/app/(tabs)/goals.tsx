import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useApi } from '@/hooks/useApi';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { formatPercent } from '@eiko/shared-logic';
import type { ApiResponse, Goal } from '@eiko/shared-types';

const FILTERS = ['All', 'Active', 'Completed', 'Archived'] as const;
type Filter = (typeof FILTERS)[number];

export default function GoalsScreen() {
  const router = useRouter();
  const api = useApi();
  const [filter, setFilter] = useState<Filter>('Active');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['goals', filter],
    queryFn: () =>
      api.get<ApiResponse<Goal[]>>(
        `/goals?status=${filter === 'All' ? '' : filter.toUpperCase()}`,
      ),
  });

  const goals = data?.data || [];

  function renderGoalCard({ item, index }: { item: Goal; index: number }) {
    const progress = item.targetValue ? item.currentValue / item.targetValue : 0;

    return (
      <Animated.View entering={FadeInRight.duration(300).delay(index * 60)}>
        <TouchableOpacity
          style={styles.goalCard}
          onPress={() => router.push(`/goal/${item.id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.goalCardTop}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <View style={[styles.statusBadge, item.status === 'COMPLETED' && styles.statusCompleted]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.goalTitle} numberOfLines={1}>{item.title}</Text>
          {item.description && (
            <Text style={styles.goalDesc} numberOfLines={2}>{item.description}</Text>
          )}
          {item.targetValue && (
            <>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.min(100, progress * 100)}%` }]} />
              </View>
              <View style={styles.progressRow}>
                <Text style={styles.progressText}>
                  {item.currentValue} / {item.targetValue} {item.unit || ''}
                </Text>
                <Text style={styles.progressPercent}>{formatPercent(progress)}</Text>
              </View>
            </>
          )}
          {item.targetDate && (
            <Text style={styles.targetDate}>
              Target: {new Date(item.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          )}
          <View style={styles.chevron}>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
        <Text style={styles.title}>Your Goals</Text>
      </Animated.View>

      {/* Filters */}
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={goals}
        renderItem={renderGoalCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="flag-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No goals yet</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/goal/create' as any)}>
              <Text style={styles.addBtnText}>Set your first goal</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/goal/create' as any)}
        accessibilityLabel="Add new goal"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing['4xl'], paddingBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  filters: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  filterChip: {
    paddingHorizontal: spacing.base, paddingVertical: spacing.sm, borderRadius: borderRadius.full,
    marginRight: spacing.sm, backgroundColor: colors.subtleBg,
  },
  filterChipActive: { backgroundColor: colors.primary },
  filterText: { ...typography.bodySmall, color: colors.textSecondary },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  goalCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.base,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  goalCardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  categoryChip: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  categoryText: { ...typography.overline, color: colors.primary },
  statusBadge: { backgroundColor: colors.subtleBg, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  statusCompleted: { backgroundColor: colors.financeLight },
  statusText: { ...typography.overline, color: colors.textTertiary },
  goalTitle: { ...typography.h3, color: colors.textPrimary },
  goalDesc: { ...typography.bodySmall, color: colors.textTertiary, marginTop: spacing.xs },
  progressTrack: { height: 6, backgroundColor: colors.subtleBg, borderRadius: 3, marginTop: spacing.md },
  progressFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  progressText: { ...typography.caption, color: colors.textSecondary },
  progressPercent: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  targetDate: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.sm },
  chevron: { position: 'absolute', right: spacing.base, top: '50%' },
  empty: { alignItems: 'center', paddingTop: spacing['5xl'] },
  emptyText: { ...typography.body, color: colors.textTertiary, marginTop: spacing.base },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.md, marginTop: spacing.base },
  addBtnText: { ...typography.body, color: '#fff', fontWeight: '600' },
  fab: {
    position: 'absolute', bottom: 100, right: spacing.xl,
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 8,
  },
});
