export type ReadingStatus = 'want-to-read' | 'reading' | 'finished';

export interface Book {
  id: string;
  title: string;
  status: ReadingStatus;
  createdAt: number;
}

export const STATUS_META: Record<
  ReadingStatus,
  { label: string; badge: string; dot: string; border: string }
> = {
  'want-to-read': {
    label: 'Want to Read',
    badge: 'bg-sky-100 text-sky-700',
    dot: 'bg-sky-500',
    border: 'border-sky-200',
  },
  reading: {
    label: 'Reading',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
    border: 'border-amber-200',
  },
  finished: {
    label: 'Finished',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200',
  },
};

export const STATUS_ORDER: ReadingStatus[] = ['want-to-read', 'reading', 'finished'];

export type FilterStatus = 'all' | ReadingStatus;

export const FILTER_LABELS: Record<FilterStatus, string> = {
  all: 'All',
  'want-to-read': 'Want to Read',
  reading: 'Reading',
  finished: 'Finished',
};
