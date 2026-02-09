import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../utils/errors.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';
import type { Prisma } from '@prisma/client';
import type { CreateJournalEntryInput, UpdateJournalEntryInput, JournalQueryInput } from './journal.schema.js';

function serializeEntry(entry: Record<string, unknown>) {
  return {
    ...entry,
    date: (entry.date as Date).toISOString().split('T')[0],
    createdAt: (entry.createdAt as Date).toISOString(),
    updatedAt: (entry.updatedAt as Date).toISOString(),
  };
}

export async function listEntries(userId: string, filters: JournalQueryInput) {
  const { skip, take } = parsePagination(filters);

  const where: Prisma.JournalEntryWhereInput = { userId };

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date.gte = new Date(filters.startDate + 'T00:00:00Z');
    }
    if (filters.endDate) {
      where.date.lte = new Date(filters.endDate + 'T00:00:00Z');
    }
  }

  const [entries, total] = await Promise.all([
    prisma.journalEntry.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take,
    }),
    prisma.journalEntry.count({ where }),
  ]);

  return {
    entries: entries.map(serializeEntry),
    meta: buildPaginationMeta(total, filters),
  };
}

export async function createEntry(userId: string, data: CreateJournalEntryInput) {
  const entryDate = data.date
    ? new Date(data.date + 'T00:00:00Z')
    : new Date(new Date().toISOString().split('T')[0] + 'T00:00:00Z');

  const entry = await prisma.journalEntry.upsert({
    where: {
      userId_date: { userId, date: entryDate },
    },
    create: {
      userId,
      date: entryDate,
      title: data.title ?? null,
      content: data.content,
      mood: data.mood ?? null,
      tags: data.tags ?? [],
    },
    update: {
      title: data.title ?? null,
      content: data.content,
      mood: data.mood ?? null,
      tags: data.tags ?? [],
    },
  });

  return serializeEntry(entry);
}

export async function getEntry(userId: string, entryId: string) {
  const entry = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId },
  });

  if (!entry) {
    throw new NotFoundError('Journal entry');
  }

  return serializeEntry(entry);
}

export async function getEntryByDate(userId: string, dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00Z');

  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_date: { userId, date },
    },
  });

  return entry ? serializeEntry(entry) : null;
}

export async function updateEntry(userId: string, entryId: string, data: UpdateJournalEntryInput) {
  const existing = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Journal entry');
  }

  const entry = await prisma.journalEntry.update({
    where: { id: entryId },
    data,
  });

  return serializeEntry(entry);
}

export async function deleteEntry(userId: string, entryId: string) {
  const existing = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Journal entry');
  }

  await prisma.journalEntry.delete({
    where: { id: entryId },
  });
}
