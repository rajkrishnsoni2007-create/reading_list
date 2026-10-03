import { useMemo, useState } from 'react';
import {
  BookOpen,
  Library,
  Plus,
  Trash2,
  BookMarked,
  BookCheck,
  BookText,
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  type Book,
  type FilterStatus,
  STATUS_META,
  STATUS_ORDER,
  FILTER_LABELS,
} from '@/types';

const STORAGE_KEY = 'reading-list-books';

function App() {
  const [books, setBooks] = useLocalStorage<Book[]>(STORAGE_KEY, []);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [error, setError] = useState('');

  const addBook = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a book title.');
      return;
    }
    if (trimmed.length > 60) {
      setError('Book title must be 60 characters or fewer.');
      return;
    }
    const normalized = trimmed.replace(/\s+/g, ' ').toLowerCase();
    if (books.some((b) => b.title.replace(/\s+/g, ' ').toLowerCase() === normalized)) {
      setError('This book is already in your reading list.');
      return;
    }
    setError('');
    const book: Book = {
      id: crypto.randomUUID(),
      title: trimmed,
      status: 'want-to-read',
      createdAt: Date.now(),
    };
    setBooks((prev) => [book, ...prev]);
    setTitle('');
  };

  const changeStatus = (id: string, status: Book['status']) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const removeBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const counts = useMemo(() => {
    const c = { all: books.length, 'want-to-read': 0, reading: 0, finished: 0 };
    for (const b of books) c[b.status]++;
    return c;
  }, [books]);

  const visibleBooks = useMemo(
    () =>
      filter === 'all'
        ? books
        : books.filter((b) => b.status === filter),
    [books, filter]
  );

  const filterKeys: FilterStatus[] = ['all', ...STATUS_ORDER];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-stone-900 text-white shrink-0">
            <Library size={22} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight">
              Reading List
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 leading-tight">
              Keep track of your books
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Add book form */}
        <form onSubmit={addBook} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter a book title..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 active:scale-[0.98] transition shrink-0"
            >
              <Plus size={18} />
              Add Book
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>

        {/* Filters */}
        {books.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filterKeys.map((key) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition border',
                    active
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400',
                  ].join(' ')}
                >
                  {FILTER_LABELS[key]}
                  <span
                    className={[
                      'text-xs tabular-nums',
                      active ? 'text-stone-300' : 'text-stone-400',
                    ].join(' ')}
                  >
                    {counts[key]}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {books.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl font-semibold text-stone-900 tabular-nums leading-none">
                {counts.all}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-stone-500 leading-tight">
                Total Books
              </p>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl font-semibold text-amber-600 tabular-nums leading-none">
                {counts.reading}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-stone-500 leading-tight">
                Currently Reading
              </p>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl font-semibold text-emerald-600 tabular-nums leading-none">
                {counts.finished}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-stone-500 leading-tight">
                Finished
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {books.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
              <BookOpen size={28} className="text-stone-400" />
            </div>
            <p className="text-stone-600 text-base sm:text-lg font-medium">
              Your reading list is empty. Add your first book.
            </p>
          </div>
        )}

        {/* Book list */}
        {books.length > 0 && visibleBooks.length === 0 && (
          <p className="text-center text-stone-500 text-sm py-12">
            No books match this filter.
          </p>
        )}

        {visibleBooks.length > 0 && (
          <ul className="space-y-3">
            {visibleBooks.map((book) => (
              <li
                key={book.id}
                className={[
                  'group bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition',
                  STATUS_META[book.status].border,
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      'flex items-center justify-center w-10 h-10 rounded-lg shrink-0',
                      STATUS_META[book.status].badge,
                    ].join(' ')}
                  >
                    {book.status === 'want-to-read' && <BookMarked size={18} />}
                    {book.status === 'reading' && <BookText size={18} />}
                    {book.status === 'finished' && <BookCheck size={18} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-stone-900 leading-snug break-words">
                      {book.title}
                    </h3>

                    {/* Status badges */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {STATUS_ORDER.map((s) => {
                        const meta = STATUS_META[s];
                        const active = book.status === s;
                        return (
                          <button
                            key={s}
                            onClick={() => changeStatus(book.id, s)}
                            className={[
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition border',
                              active
                                ? `${meta.badge} ${meta.border}`
                                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                'w-1.5 h-1.5 rounded-full',
                                active ? meta.dot : 'bg-stone-300',
                              ].join(' ')}
                            />
                            {meta.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => removeBook(book.id)}
                    aria-label="Remove book"
                    className="shrink-0 p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition opacity-60 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
