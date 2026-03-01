import { useState, useEffect, useRef } from "react";
import { listDocuments, searchDocuments } from "../api/client.ts";
import type { Document } from "../api/types.ts";
import { useDebounce } from "./useDebounce.ts";

interface DocumentsState {
  results: Document[];
  count: number;
  loading: boolean;
}

const MAX_PRELOAD = 500;

export function useDocuments(
  query: string,
  onError?: (message: string) => void,
) {
  const debouncedQuery = useDebounce(query, 300);
  const cache = useRef<Map<number, Document>>(new Map());
  const [allDocs, setAllDocs] = useState<Document[]>([]);
  const [preloaded, setPreloaded] = useState(false);

  const [state, setState] = useState<DocumentsState>({
    results: [],
    count: 0,
    loading: true,
  });

  // Pre-load documents on mount
  useEffect(() => {
    let cancelled = false;

    async function preload() {
      try {
        let page = 1;
        let loaded: Document[] = [];
        while (loaded.length < MAX_PRELOAD) {
          const data = await listDocuments(page, 100);
          if (cancelled) return;
          for (const doc of data.results) {
            cache.current.set(doc.id, doc);
          }
          loaded = loaded.concat(data.results);
          if (!data.next || loaded.length >= data.count) break;
          page++;
        }
        if (!cancelled) {
          const sorted = loaded.sort(
            (a, b) =>
              new Date(b.created).getTime() - new Date(a.created).getTime(),
          );
          setAllDocs(sorted);
          setPreloaded(true);
          setState({
            results: sorted,
            count: sorted.length,
            loading: false,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false }));
          onError?.(err instanceof Error ? err.message : String(err));
        }
      }
    }

    preload();
    return () => {
      cancelled = true;
    };
  }, [onError]);

  // Search when query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      // No query — show all preloaded docs
      if (preloaded) {
        setState({
          results: allDocs,
          count: allDocs.length,
          loading: false,
        });
      }
      return;
    }

    // Immediately filter cached docs by title
    const lower = debouncedQuery.toLowerCase();
    const filtered = allDocs.filter((d) =>
      d.title.toLowerCase().includes(lower),
    );
    setState({
      results: filtered,
      count: filtered.length,
      loading: true,
    });

    // Fire server search for full-text/OCR results
    let cancelled = false;
    searchDocuments(debouncedQuery).then(
      (data) => {
        if (cancelled) return;
        // Merge: server results take priority, then add any cached title matches not in server results
        const serverIds = new Set(data.results.map((d) => d.id));
        const merged = [
          ...data.results,
          ...filtered.filter((d) => !serverIds.has(d.id)),
        ];
        // Update cache with server results
        for (const doc of data.results) {
          cache.current.set(doc.id, doc);
        }
        setState({
          results: merged,
          count: merged.length,
          loading: false,
        });
      },
      (err) => {
        if (!cancelled) {
          // Keep the client-filtered results, just clear loading
          setState((s) => ({ ...s, loading: false }));
          onError?.(err instanceof Error ? err.message : String(err));
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, allDocs, onError, preloaded]);

  return state;
}
