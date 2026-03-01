import { useState, useEffect } from "react";
import {
  fetchTags,
  fetchCorrespondents,
  fetchDocumentTypes,
  fetchStatistics,
} from "../api/client.ts";
import type { Tag, Correspondent, DocumentType, Statistics } from "../api/types.ts";

export interface Metadata {
  tags: Map<number, Tag>;
  correspondents: Map<number, Correspondent>;
  documentTypes: Map<number, DocumentType>;
  statistics: Statistics | null;
  loaded: boolean;
}

export function useMetadata(onError?: (message: string) => void): Metadata {
  const [tags, setTags] = useState<Map<number, Tag>>(new Map());
  const [correspondents, setCorrespondents] = useState<Map<number, Correspondent>>(new Map());
  const [documentTypes, setDocumentTypes] = useState<Map<number, DocumentType>>(new Map());
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [tagsData, corrsData, typesData, statsData] = await Promise.all([
          fetchTags(),
          fetchCorrespondents(),
          fetchDocumentTypes(),
          fetchStatistics(),
        ]);

        if (cancelled) return;

        setTags(new Map(tagsData.map((t) => [t.id, t])));
        setCorrespondents(new Map(corrsData.map((c) => [c.id, c])));
        setDocumentTypes(new Map(typesData.map((d) => [d.id, d])));
        setStatistics(statsData);
        setLoaded(true);
      } catch (err) {
        if (!cancelled) {
          onError?.(err instanceof Error ? err.message : String(err));
          setLoaded(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [onError]);

  return { tags, correspondents, documentTypes, statistics, loaded };
}
