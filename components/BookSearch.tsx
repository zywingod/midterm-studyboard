"use client";

import { useState, FormEvent } from "react";

type BookResult = {
  key: string;
  title: string;
  authors: string[];
  firstPublishYear: number | null;
  coverUrl: string | null;
};

export default function BookSearch({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<BookResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setHasSearched(true);

    // Notice: this fetch() goes to OUR OWN /api/books route, not to
    // openlibrary.org. The browser has no idea a third party is involved
    // at all — that's entirely our server's business.
    const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`);

    setIsLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setResults([]);
      return;
    }

    const data: BookResult[] = await res.json();
    setResults(data);
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for reference books..."
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {hasSearched && !isLoading && !error && results.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">No books found.</p>
      )}

      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {results.map((book) => (
          <li key={book.key} className="text-sm">
            {book.coverUrl ? (
              // Using a plain <img> here rather than next/image, since
              // next/image requires allow-listing external domains in
              // next.config.mjs — a reasonable next step, but out of
              // scope for this lab.
              <img
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                className="mb-1 h-32 w-full rounded object-cover"
              />
            ) : (
              <div className="mb-1 flex h-32 w-full items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                No cover
              </div>
            )}
            <p className="font-medium leading-tight">{book.title}</p>
            {book.authors.length > 0 && (
              <p className="text-gray-500">{book.authors.join(", ")}</p>
            )}
            {book.firstPublishYear && (
              <p className="text-gray-400">{book.firstPublishYear}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}