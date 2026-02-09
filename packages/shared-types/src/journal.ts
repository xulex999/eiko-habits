export interface JournalEntry {
  id: string;
  userId: string;
  title: string | null;
  content: string;
  mood: number | null;
  tags: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalEntryInput {
  title?: string;
  content: string;
  mood?: number;
  tags?: string[];
  date?: string;
}

export interface UpdateJournalEntryInput {
  title?: string;
  content?: string;
  mood?: number;
  tags?: string[];
}
