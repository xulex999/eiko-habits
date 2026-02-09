import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.aIRecommendation.deleteMany();
  await prisma.contribution.deleteMany();
  await prisma.habitLog.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.financialGoal.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.onboardingData.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.userDevice.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 12);

  const user = await prisma.user.create({
    data: {
      email: 'demo@eikohabits.com',
      passwordHash,
      displayName: 'Demo User',
      authProvider: 'EMAIL',
      timezone: 'America/New_York',
      onboardingComplete: true,
      subscription: {
        create: { tier: 'PREMIUM', status: 'ACTIVE', platform: 'STRIPE' },
      },
      onboardingData: {
        create: {
          topGoals: ['Get fit', 'Save money', 'Read more'],
          currentSituation: {
            incomeBracket: '50k-75k',
            lifeStage: 'early_career',
            biggestChallenge: 'Consistency',
            interestedInFinance: true,
          },
        },
      },
    },
  });

  // Create goals
  const fitnessGoal = await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Get in shape',
      description: 'Build a consistent exercise routine',
      category: 'FITNESS',
      targetDate: new Date('2026-06-01'),
      targetValue: 100,
      currentValue: 23,
      unit: 'workouts',
    },
  });

  const readingGoal = await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Read 24 books',
      category: 'EDUCATION',
      targetDate: new Date('2026-12-31'),
      targetValue: 24,
      currentValue: 3,
      unit: 'books',
    },
  });

  // Create habits
  const habits = await Promise.all([
    prisma.habit.create({
      data: {
        userId: user.id,
        goalId: fitnessGoal.id,
        title: 'Morning workout',
        frequency: 'WEEKDAYS',
        daysOfWeek: 31, // Mon-Fri
        reminderTime: '07:00',
        color: '#4F46E5',
        icon: 'barbell',
        currentStreak: 12,
        longestStreak: 18,
        consistencyScore: 0.85,
      },
    }),
    prisma.habit.create({
      data: {
        userId: user.id,
        title: 'Meditate 10 min',
        frequency: 'DAILY',
        daysOfWeek: 127,
        reminderTime: '08:00',
        color: '#8B5CF6',
        icon: 'leaf',
        currentStreak: 30,
        longestStreak: 30,
        consistencyScore: 0.96,
      },
    }),
    prisma.habit.create({
      data: {
        userId: user.id,
        goalId: readingGoal.id,
        title: 'Read 20 minutes',
        frequency: 'DAILY',
        daysOfWeek: 127,
        reminderTime: '21:00',
        color: '#F59E0B',
        icon: 'book',
        currentStreak: 5,
        longestStreak: 14,
        consistencyScore: 0.72,
      },
    }),
    prisma.habit.create({
      data: {
        userId: user.id,
        title: 'Drink 8 glasses of water',
        frequency: 'DAILY',
        daysOfWeek: 127,
        color: '#06B6D4',
        icon: 'water',
        currentStreak: 3,
        longestStreak: 21,
        consistencyScore: 0.6,
      },
    }),
  ]);

  // Create habit logs for past 14 days
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateOnly = new Date(date.toISOString().split('T')[0] + 'T00:00:00Z');

    for (const habit of habits) {
      // ~80% completion rate
      if (Math.random() < 0.8) {
        await prisma.habitLog.create({
          data: {
            habitId: habit.id,
            date: dateOnly,
            value: 1,
            completedAt: date,
          },
        }).catch(() => {}); // Ignore duplicate constraint violations
      }
    }
  }

  // Create financial goals
  const savingsGoal = await prisma.financialGoal.create({
    data: {
      userId: user.id,
      type: 'SAVINGS',
      title: 'Emergency fund',
      targetAmount: 5000,
      currentAmount: 2150,
      targetDate: new Date('2026-09-01'),
      color: '#10B981',
      icon: 'shield-checkmark',
    },
  });

  const debtGoal = await prisma.financialGoal.create({
    data: {
      userId: user.id,
      type: 'DEBT_PAYOFF',
      title: 'Pay off credit card',
      targetAmount: 3200,
      currentAmount: 1800,
      targetDate: new Date('2026-08-01'),
      interestRate: 18.9,
      minimumPayment: 85,
      color: '#F43F5E',
      icon: 'card',
    },
  });

  // Create contributions for past month
  for (let i = 0; i < 8; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 4);
    const dateOnly = new Date(date.toISOString().split('T')[0] + 'T00:00:00Z');

    await prisma.contribution.create({
      data: {
        financialGoalId: savingsGoal.id,
        type: 'DEPOSIT',
        amount: 100 + Math.floor(Math.random() * 150),
        date: dateOnly,
        note: 'Weekly savings',
      },
    });

    await prisma.contribution.create({
      data: {
        financialGoalId: debtGoal.id,
        type: 'PAYMENT',
        amount: 150 + Math.floor(Math.random() * 100),
        date: dateOnly,
        note: 'Monthly payment',
      },
    });
  }

  // Notification preferences
  await prisma.notificationPreference.create({
    data: {
      userId: user.id,
      channel: 'PUSH',
      enabled: true,
      aiCheckInTimes: ['09:00', '20:00'],
    },
  });

  console.log('Seed data created successfully');
  console.log(`Demo account: demo@eikohabits.com / password123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
