import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { PRICING } from '@eiko/shared-types';
import type { ApiResponse, AIRecommendation } from '@eiko/shared-types';

export default function CoachScreen() {
  const { user } = useAuth();
  const api = useApi();
  const queryClient = useQueryClient();
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);

  // Check premium status
  const { data: subData } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get<ApiResponse<{ tier: string }>>('/subscriptions/status'),
  });
  const isPremium = subData?.data?.tier === 'PREMIUM';

  const { data: recsData } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => api.get<ApiResponse<AIRecommendation[]>>('/ai/recommendations'),
    enabled: isPremium,
  });

  const chatMutation = useMutation({
    mutationFn: (message: string) => api.post<ApiResponse<{ text: string }>>('/ai/chat', { message }),
    onSuccess: (data) => {
      if (data?.data?.text) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: data.data!.text }]);
      }
    },
  });

  const routineMutation = useMutation({
    mutationFn: () => api.post('/ai/habit-routine', {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recommendations'] }),
  });

  const reviewMutation = useMutation({
    mutationFn: () => api.post('/ai/weekly-review', {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recommendations'] }),
  });

  function handleSendChat() {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    chatMutation.mutate(msg);
  }

  // Premium upsell for free users
  if (!isPremium) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.upsellContent}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.upsellCard}>
          <View style={styles.sparkleCircle}>
            <Ionicons name="sparkles" size={40} color={colors.primary} />
          </View>
          <Text style={styles.upsellTitle}>Unlock your AI Coach</Text>
          <Text style={styles.upsellDesc}>
            Get personalized habit routines, financial action plans, weekly reviews, and real-time coaching with Eiko AI.
          </Text>

          <View style={styles.featureList}>
            {[
              'Personalized daily routines',
              'Financial action plans',
              'Weekly progress reviews',
              'AI-powered check-in notifications',
              'Unlimited goals & habits',
              'Advanced analytics',
            ].map((feature) => (
              <View key={feature} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={20} color={colors.finance} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles.pricingOptions}>
            <TouchableOpacity style={styles.priceCard}>
              <Text style={styles.priceLabel}>Monthly</Text>
              <Text style={styles.priceAmount}>{PRICING.monthly.label}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.priceCard, styles.priceCardHighlighted]}>
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>Save {PRICING.annual.savings}</Text>
              </View>
              <Text style={styles.priceLabel}>Annual</Text>
              <Text style={styles.priceAmount}>{PRICING.annual.label}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Start 7-day free trial</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>Cancel anytime. Terms apply.</Text>
        </Animated.View>
      </ScrollView>
    );
  }

  // Premium AI Coach interface
  const recs = recsData?.data || [];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.premiumContent}>
        <Text style={styles.title}>AI Coach</Text>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => routineMutation.mutate()}
            disabled={routineMutation.isPending}
          >
            <Ionicons name="sunny-outline" size={24} color={colors.primary} />
            <Text style={styles.actionLabel}>Generate Routine</Text>
            {routineMutation.isPending && <ActivityIndicator size="small" color={colors.primary} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => reviewMutation.mutate()}
            disabled={reviewMutation.isPending}
          >
            <Ionicons name="analytics-outline" size={24} color={colors.primary} />
            <Text style={styles.actionLabel}>Weekly Review</Text>
            {reviewMutation.isPending && <ActivityIndicator size="small" color={colors.primary} />}
          </TouchableOpacity>
        </View>

        {/* Recommendations */}
        {recs.length > 0 && (
          <View style={styles.recsSection}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {recs.slice(0, 5).map((rec) => (
              <Animated.View key={rec.id} entering={FadeInUp.duration(300)}>
                <View style={styles.recCard}>
                  <View style={styles.recHeader}>
                    <Text style={styles.recType}>{rec.type.replace(/_/g, ' ')}</Text>
                    <Text style={styles.recDate}>
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <Text style={styles.recContent} numberOfLines={4}>{rec.content}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Chat Messages */}
        {chatMessages.map((msg, i) => (
          <View
            key={i}
            style={[styles.chatBubble, msg.role === 'user' ? styles.chatUser : styles.chatAssistant]}
          >
            <Text style={[styles.chatText, msg.role === 'user' && { color: '#fff' }]}>
              {msg.text}
            </Text>
          </View>
        ))}
        {chatMutation.isPending && (
          <View style={styles.chatAssistant}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Chat Input */}
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.chatInput}
          placeholder="Ask Eiko anything..."
          placeholderTextColor={colors.textTertiary}
          value={chatInput}
          onChangeText={setChatInput}
          onSubmitEditing={handleSendChat}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSendChat}
          disabled={!chatInput.trim()}
        >
          <Ionicons name="send" size={20} color={chatInput.trim() ? colors.primary : colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  upsellContent: { padding: spacing.xl, paddingTop: spacing['4xl'] },
  premiumContent: { padding: spacing.xl, paddingTop: spacing['4xl'] },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xl },

  // Upsell styles
  upsellCard: { alignItems: 'center' },
  sparkleCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl,
  },
  upsellTitle: { ...typography.h1, color: colors.textPrimary, textAlign: 'center' },
  upsellDesc: { ...typography.body, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.md, marginBottom: spacing.xl },
  featureList: { alignSelf: 'stretch', marginBottom: spacing.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  featureText: { ...typography.body, color: colors.textPrimary, marginLeft: spacing.md },
  pricingOptions: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  priceCard: {
    flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: borderRadius.lg, padding: spacing.base, alignItems: 'center',
  },
  priceCardHighlighted: { borderColor: colors.primary, borderWidth: 2 },
  saveBadge: { backgroundColor: colors.financeLight, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm, marginBottom: spacing.sm },
  saveText: { ...typography.caption, color: colors.finance, fontWeight: '600' },
  priceLabel: { ...typography.bodySmall, color: colors.textTertiary },
  priceAmount: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.xs },
  upgradeBtn: {
    backgroundColor: colors.primary, paddingVertical: spacing.md, paddingHorizontal: spacing['3xl'],
    borderRadius: borderRadius.md, alignSelf: 'stretch', alignItems: 'center',
  },
  upgradeBtnText: { ...typography.body, color: '#fff', fontWeight: '700' },
  termsText: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.md },

  // Premium styles
  actionRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  actionCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.base,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border, gap: spacing.sm,
  },
  actionLabel: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  recsSection: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md },
  recCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.base, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  recHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  recType: { ...typography.overline, color: colors.primary },
  recDate: { ...typography.caption, color: colors.textTertiary },
  recTitle: { ...typography.h3, color: colors.textPrimary },
  recContent: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },

  chatBubble: { padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm, maxWidth: '85%' },
  chatUser: { backgroundColor: colors.primary, alignSelf: 'flex-end' },
  chatAssistant: { backgroundColor: colors.surface, alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.border },
  chatText: { ...typography.body, color: colors.textPrimary },

  chatInputContainer: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
    paddingBottom: spacing['2xl'],
  },
  chatInput: { flex: 1, height: 44, paddingHorizontal: spacing.md, backgroundColor: colors.subtleBg, borderRadius: borderRadius.full, ...typography.body, color: colors.textPrimary },
  sendBtn: { padding: spacing.md },
});
