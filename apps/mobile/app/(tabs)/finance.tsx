import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApi } from '@/hooks/useApi';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { formatCurrency } from '@eiko/shared-logic';
import type { ApiResponse, FinancialGoal, FinancialSummary } from '@eiko/shared-types';

const TABS = ['All', 'Savings', 'Debt', 'Budget'] as const;

export default function FinanceScreen() {
  const router = useRouter();
  const api = useApi();
  const [activeTab, setActiveTab] = useState<string>('All');

  const { data: summaryData } = useQuery({
    queryKey: ['finance', 'summary'],
    queryFn: () => api.get<ApiResponse<FinancialSummary>>('/finance/summary'),
  });

  const { data: goalsData, isLoading, refetch } = useQuery({
    queryKey: ['finance', 'goals', activeTab],
    queryFn: () => {
      const typeParam = activeTab === 'All' ? '' : `?type=${activeTab.toUpperCase()}`;
      return api.get<ApiResponse<FinancialGoal[]>>(`/finance/goals${typeParam}`);
    },
  });

  const summary = summaryData?.data;
  const goals = goalsData?.data || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <Animated.View entering={FadeInDown.duration(300)}>
        <Text style={styles.title}>Finance</Text>
      </Animated.View>

      {/* Summary Card */}
      {summary && (
        <Animated.View entering={FadeInDown.duration(300).delay(100)} style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Savings</Text>
              <Text style={[styles.summaryValue, { color: colors.finance }]}>
                {formatCurrency(summary.totalSavingsProgress)}
              </Text>
              <Text style={styles.summaryTarget}>of {formatCurrency(summary.totalSavingsTarget)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Debt</Text>
              <Text style={[styles.summaryValue, { color: colors.destructive }]}>
                {formatCurrency(summary.totalDebtRemaining)}
              </Text>
              <Text style={styles.summaryTarget}>remaining</Text>
            </View>
          </View>
          <View style={styles.onTrackRow}>
            <Ionicons name="trending-up" size={16} color={colors.finance} />
            <Text style={styles.onTrackText}>
              {summary.goalsOnTrack} of {summary.activeGoals} goals on track
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Goal Cards */}
      {goals.map((goal, index) => {
        const progress = Number(goal.targetAmount) > 0
          ? Number(goal.currentAmount) / Number(goal.targetAmount)
          : 0;
        const paceColor = goal.paceStatus === 'ahead' ? colors.finance
          : goal.paceStatus === 'behind' ? colors.destructive : colors.primary;

        return (
          <Animated.View
            key={goal.id}
            entering={FadeInDown.duration(300).delay(200 + index * 60)}
          >
            <TouchableOpacity
              style={styles.goalCard}
              onPress={() => router.push(`/finance/${goal.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.goalCardHeader}>
                <View style={[styles.typeBadge, { backgroundColor: goal.type === 'DEBT_PAYOFF' ? colors.destructiveLight : colors.financeLight }]}>
                  <Text style={[styles.typeText, { color: goal.type === 'DEBT_PAYOFF' ? colors.destructive : colors.finance }]}>
                    {goal.type.replace('_', ' ')}
                  </Text>
                </View>
                {goal.paceStatus && (
                  <View style={[styles.paceBadge, { backgroundColor: paceColor + '15' }]}>
                    <Text style={[styles.paceText, { color: paceColor }]}>
                      {goal.paceStatus.replace('_', ' ')}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalAmount}>
                {formatCurrency(Number(goal.currentAmount))}
                <Text style={styles.goalTarget}> / {formatCurrency(Number(goal.targetAmount))}</Text>
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(100, progress * 100)}%`, backgroundColor: paceColor },
                  ]}
                />
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} style={styles.chevron} />
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {goals.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="wallet-outline" size={48} color={colors.border} />
          <Text style={styles.emptyText}>No financial goals yet</Text>
        </View>
      )}

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing['4xl'] },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xl },
  summaryCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.base,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl,
  },
  summaryRow: { flexDirection: 'row' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { ...typography.caption, color: colors.textTertiary },
  summaryValue: { ...typography.h2, fontFamily: 'JetBrainsMono', marginTop: spacing.xs },
  summaryTarget: { ...typography.caption, color: colors.textTertiary },
  summaryDivider: { width: 1, backgroundColor: colors.border, marginHorizontal: spacing.base },
  onTrackRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  onTrackText: { ...typography.bodySmall, color: colors.finance, marginLeft: spacing.sm },
  tabs: { flexDirection: 'row', marginBottom: spacing.base },
  tab: { paddingHorizontal: spacing.base, paddingVertical: spacing.sm, borderRadius: borderRadius.full, marginRight: spacing.sm, backgroundColor: colors.subtleBg },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.bodySmall, color: colors.textSecondary },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  goalCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.base,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  goalCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  typeBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  typeText: { ...typography.overline },
  paceBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  paceText: { ...typography.overline },
  goalTitle: { ...typography.h3, color: colors.textPrimary },
  goalAmount: { ...typography.bodyLarge, color: colors.textPrimary, fontWeight: '600', marginTop: spacing.xs },
  goalTarget: { ...typography.body, color: colors.textTertiary, fontWeight: '400' },
  progressTrack: { height: 6, backgroundColor: colors.subtleBg, borderRadius: 3, marginTop: spacing.md },
  progressFill: { height: 6, borderRadius: 3 },
  chevron: { position: 'absolute', right: spacing.base, top: '50%' },
  empty: { alignItems: 'center', paddingTop: spacing['5xl'] },
  emptyText: { ...typography.body, color: colors.textTertiary, marginTop: spacing.base },
});
