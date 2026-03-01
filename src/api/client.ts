import { config } from "../utils/config.ts";
import type {
  SearchResponse,
  ListResponse,
  Tag,
  Correspondent,
  DocumentType,
  Statistics,
} from "./types.ts";

const headers = {
  Authorization: `Token ${config.token}`,
};

export async function searchDocuments(
  query: string,
  page = 1,
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    query,
    page: String(page),
    page_size: "25",
  });
  const res = await fetch(`${config.url}/api/documents/?${params}`, {
    headers,
  });
  if (!res.ok) {
    throw new Error(`Search failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<SearchResponse>;
}

export async function listDocuments(
  page = 1,
  pageSize = 100,
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    ordering: "-created",
    page: String(page),
    page_size: String(pageSize),
  });
  const res = await fetch(`${config.url}/api/documents/?${params}`, {
    headers,
  });
  if (!res.ok) {
    throw new Error(`List failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<SearchResponse>;
}

export async function fetchTags(): Promise<Tag[]> {
  const all: Tag[] = [];
  let url: string | null = `${config.url}/api/tags/?page_size=100`;
  while (url) {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Tags fetch failed: ${res.status}`);
    const data = (await res.json()) as ListResponse<Tag>;
    all.push(...data.results);
    url = data.next;
  }
  return all;
}

export async function fetchCorrespondents(): Promise<Correspondent[]> {
  const all: Correspondent[] = [];
  let url: string | null = `${config.url}/api/correspondents/?page_size=100`;
  while (url) {
    const res = await fetch(url, { headers });
    if (!res.ok)
      throw new Error(`Correspondents fetch failed: ${res.status}`);
    const data = (await res.json()) as ListResponse<Correspondent>;
    all.push(...data.results);
    url = data.next;
  }
  return all;
}

export async function fetchDocumentTypes(): Promise<DocumentType[]> {
  const all: DocumentType[] = [];
  let url: string | null = `${config.url}/api/document_types/?page_size=100`;
  while (url) {
    const res = await fetch(url, { headers });
    if (!res.ok)
      throw new Error(`Document types fetch failed: ${res.status}`);
    const data = (await res.json()) as ListResponse<DocumentType>;
    all.push(...data.results);
    url = data.next;
  }
  return all;
}

export async function fetchStatistics(): Promise<Statistics> {
  const res = await fetch(`${config.url}/api/statistics/`, { headers });
  if (!res.ok) throw new Error(`Statistics fetch failed: ${res.status}`);
  return res.json() as Promise<Statistics>;
}

export function getDocumentUrl(id: number): string {
  return `${config.frontendUrl}/documents/${id}/details`;
}

export function getDownloadUrl(id: number): string {
  return `${config.frontendUrl}/api/documents/${id}/download/`;
}
