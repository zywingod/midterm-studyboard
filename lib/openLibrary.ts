import axios from "axios";

const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";

// Open Library's etiquette guidelines ask every client to identify
// itself via a descriptive User-Agent header, including a way to
// contact the developer. Many third-party APIs enforce this outright —
// it's good practice to always set one, whether it's required or not.
const USER_AGENT =
  process.env.OPENLIBRARY_USER_AGENT ??
  "StudyBoard/1.0 (educational project; no-reply@studyboard.local)";

// This is OUR shape — the one the rest of our app will work with.
export type BookResult = {
  key: string;
  title: string;
  authors: string[];
  firstPublishYear: number | null;
  coverUrl: string | null;
};

// THEIR shape — what Open Library's search.json endpoint actually
// returns (only the fields we're requesting via `fields` below).
type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

type OpenLibrarySearchResponse = {
  numFound: number;
  docs: OpenLibraryDoc[];
};

// TODO (Step 1): Implement searchBooks using axios.
//
// 1. Call axios.get<OpenLibrarySearchResponse>() against
//    `${OPEN_LIBRARY_BASE_URL}/search.json`, passing a config object with:
//      - params: { q: query, fields: "key,title,author_name,first_publish_year,cover_i", limit: 8 }
//      - headers: { "User-Agent": USER_AGENT }
//      - timeout: 5000  (milliseconds — never let a slow third party hang forever)
// 2. axios puts the parsed JSON body on `response.data`.
// 3. Map response.data.docs into an array of BookResult objects:
//      - key: doc.key
//      - title: doc.title
//      - authors: doc.author_name ?? []            (it's optional!)
//      - firstPublishYear: doc.first_publish_year ?? null
//      - coverUrl: doc.cover_i
//          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
//          : null
//
// Why reshape their data into our own BookResult type instead of just
// returning response.data.docs directly? If Open Library ever renames a
// field, only THIS file needs to change — nothing downstream (the route,
// the component) needs to know or care what Open Library actually calls things.
export async function searchBooks(query: string): Promise<BookResult[]> {
  const response = await axios.get<OpenLibrarySearchResponse>(
    `${OPEN_LIBRARY_BASE_URL}/search.json`,
    {
      params: {
        q: query,
        fields: "key,title,author_name,first_publish_year,cover_i",
        limit: 8
      },
      headers: { "User-Agent": USER_AGENT },
      timeout: 5000
    }
  );

  return response.data.docs.map((doc) => ({
    key: doc.key,
    title: doc.title,
    authors: doc.author_name ?? [],
    firstPublishYear: doc.first_publish_year ?? null,
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
  }))
}