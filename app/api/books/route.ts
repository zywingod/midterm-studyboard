import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { searchBooks } from "@/lib/openLibrary";

// TODO (Step 2): Define a schema requiring a non-empty `q` string,
// max 200 characters (same pattern as Week 7's validation schemas).
const searchQuerySchema = z.object({
  q: z.string().trim().min(1, "A search query is required").max(200),
});

// GET /api/books?q=... — OUR OWN endpoint, which the browser calls.
// The browser never talks to openlibrary.org directly; it talks to us,
// and WE talk to Open Library, server-side.
//
// TODO (Step 3): Implement this handler.
// 1. Query params (unlike a JSON body) come from the URL, not
//    request.json(). Use: const { searchParams } = new URL(request.url);
//    then searchParams.get("q") to read it.
// 2. Validate with searchQuerySchema.safeParse({ q: searchParams.get("q") }).
//    If invalid, return 400 with the Zod error message.
// 3. Call searchBooks(parsed.data.q) INSIDE A TRY/CATCH block — a network
//    call to a third party can fail in ways a database call usually
//    doesn't (timeout, DNS failure, the service being down).
// 4. On success, return the books as JSON.
// 5. In the catch block, check `axios.isAxiosError(error)` — if true,
//    this means Open Library itself failed, not a bug in our code.
//    Return a 502 (Bad Gateway — "we're a gateway to an upstream that
//    failed") with a friendly error message. If it's NOT an axios error,
//    re-throw it (something unexpected happened; don't hide it).
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const parsed = searchQuerySchema.safeParse({ q: searchParams.get("q") });
    
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0].message },
            { status: 400 }
        );
    }

    try {
        const books = await searchBooks(parsed.data.q);
        return NextResponse.json(books);
    } catch (error) {
        if (axios.isAxiosError(error)){
            console.error("Open Library request failed:", error.message);
            return NextResponse.json(
                { error: "Book search is temporarily unavailable. Please try again later." },
                { status: 502 }

            )
        }
        throw error;
    }
}