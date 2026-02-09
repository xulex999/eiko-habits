import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../utils/errors.js';
import type { UpdateProfileInput, OnboardingInput, UpdateNotificationsInput, RegisterDeviceInput } from './users.schema.js';

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      authProvider: true,
      timezone: true,
      onboardingComplete: true,
      createdAt: true,
      updatedAt: true,
      subscription: {
        select: {
          tier: true,
          status: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    subscription: user.subscription
      ? {
          tier: user.subscription.tier,
          status: user.subscription.status,
          currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString() ?? null,
          cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
        }
      : null,
  };
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      authProvider: true,
      timezone: true,
      onboardingComplete: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function deleteAccount(userId: string) {
  // Cascade delete is configured in the schema, so this removes all related data
  await prisma.user.delete({
    where: { id: userId },
  });
}

export async function submitOnboarding(userId: string, data: OnboardingInput) {
  const onboarding = await prisma.onboardingData.upsert({
    where: { userId },
    create: {
      userId,
      topGoals: data.topGoals,
      currentSituation: data.currentSituation,
    },
    update: {
      topGoals: data.topGoals,
      currentSituation: data.currentSituation,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { onboardingComplete: true },
  });

  return {
    ...onboarding,
    createdAt: onboarding.createdAt.toISOString(),
    updatedAt: onboarding.updatedAt.toISOString(),
  };
}

export async function getOnboarding(userId: string) {
  const onboarding = await prisma.onboardingData.findUnique({
    where: { userId },
  });

  if (!onboarding) {
    throw new NotFoundError('OnboardingData');
  }

  return {
    ...onboarding,
    createdAt: onboarding.createdAt.toISOString(),
    updatedAt: onboarding.updatedAt.toISOString(),
  };
}

export async function updateNotifications(userId: string, data: UpdateNotificationsInput) {
  const { channel, aiCheckInTimes, ...rest } = data;

  const pref = await prisma.notificationPreference.upsert({
    where: {
      userId_channel: { userId, channel },
    },
    create: {
      userId,
      channel,
      ...rest,
      aiCheckInTimes: aiCheckInTimes ?? [],
    },
    update: {
      ...rest,
      ...(aiCheckInTimes !== undefined ? { aiCheckInTimes } : {}),
    },
  });

  return {
    ...pref,
    aiCheckInTimes: pref.aiCheckInTimes as string[],
  };
}

export async function getNotifications(userId: string) {
  const prefs = await prisma.notificationPreference.findMany({
    where: { userId },
  });

  return prefs.map((pref) => ({
    ...pref,
    aiCheckInTimes: pref.aiCheckInTimes as string[],
  }));
}

export async function registerDevice(userId: string, data: RegisterDeviceInput) {
  // If a pushToken is provided, upsert on (userId, pushToken) to avoid duplicates
  if (data.pushToken) {
    const device = await prisma.userDevice.upsert({
      where: {
        userId_pushToken: { userId, pushToken: data.pushToken },
      },
      create: {
        userId,
        pushToken: data.pushToken,
        platform: data.platform,
        deviceName: data.deviceName ?? null,
      },
      update: {
        platform: data.platform,
        deviceName: data.deviceName ?? null,
        lastActiveAt: new Date(),
      },
    });

    return device;
  }

  // No pushToken, just create a new device record
  const device = await prisma.userDevice.create({
    data: {
      userId,
      pushToken: null,
      platform: data.platform,
      deviceName: data.deviceName ?? null,
    },
  });

  return device;
}

export async function removeDevice(userId: string, deviceId: string) {
  const device = await prisma.userDevice.findFirst({
    where: { id: deviceId, userId },
  });

  if (!device) {
    throw new NotFoundError('Device');
  }

  await prisma.userDevice.delete({
    where: { id: deviceId },
  });
}
