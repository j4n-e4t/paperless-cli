export interface Document {
  id: number;
  title: string;
  owner?: number | null;
  owner_username?: string | null;
  user_can_change?: boolean;
  correspondent: number | null;
  correspondent__name?: string | null;
  document_type: number | null;
  document_type__name?: string | null;
  storage_path: number | null;
  tags: number[];
  created: string;
  added: string;
  modified: string;
  archive_serial_number: number | null;
  original_file_name: string;
  archived_file_name: string | null;
  content: string;
  page_count?: number;
  notes?: Note[];
}

export interface Note {
  id: number;
  note: string;
  created: string;
  user?:
    | number
    | {
        id: number;
        username?: string | null;
        first_name?: string | null;
        last_name?: string | null;
      }
    | null;
}

export interface Tag {
  id: number;
  name: string;
  color: string;        // hex color like "#a6cee3"
  text_color: string;   // hex color
  is_inbox_tag: boolean;
  document_count: number;
}

export interface Correspondent {
  id: number;
  name: string;
  document_count: number;
  last_correspondence: string | null;
}

export interface DocumentType {
  id: number;
  name: string;
  document_count: number;
}

export interface SearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Document[];
}

export interface ListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Statistics {
  documents_total: number;
  documents_inbox: number;
  inbox_tag: number | null;
  document_file_type_counts: { mime_type: string; mime_type_count: number }[];
  character_count: number;
}
