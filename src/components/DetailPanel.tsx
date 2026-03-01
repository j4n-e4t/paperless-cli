import React from "react";
import { Box, Text } from "ink";
import type { Document, Note, Tag } from "../api/types.ts";
import type { Metadata } from "../hooks/useMetadata.ts";

interface Props {
  document: Document | null;
  metadata: Metadata;
  mode: "detail" | "notes" | "content";
  height: number;
}

const TAG_COLORS: string[] = [
  "cyan",
  "magenta",
  "yellow",
  "blue",
  "green",
  "red",
  "white",
];

function tagColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length]!;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(months / 12)}y`;
}

function noteAuthorLabel(note: Note): string | null {
  const user = note.user;
  if (!user) return null;
  if (typeof user === "number") return `user #${user}`;
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return fullName || user.username || `user #${user.id}`;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Text>
      <Text dimColor>{label.padEnd(12)}</Text>
      {children}
    </Text>
  );
}

function DetailView({
  document: doc,
  metadata,
}: {
  document: Document;
  metadata: Metadata;
}) {
  const docTags = (doc.tags ?? [])
    .map((id) => metadata.tags.get(id))
    .filter(Boolean) as Tag[];

  const corrName =
    doc.correspondent__name ??
    (doc.correspondent
      ? metadata.correspondents.get(doc.correspondent)?.name
      : null);
  const typeName =
    doc.document_type__name ??
    (doc.document_type
      ? metadata.documentTypes.get(doc.document_type)?.name
      : null);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="green">
          {doc.title}
        </Text>
      </Box>

      <Field label="Corresp.">
        <Text color="cyan">{corrName ?? "—"}</Text>
      </Field>
      <Field label="Type">
        <Text color="yellow">{typeName ?? "—"}</Text>
      </Field>
      <Field label="ASN">
        <Text>
          {doc.archive_serial_number ? `#${doc.archive_serial_number}` : "—"}
        </Text>
      </Field>

      <Box marginTop={1} />

      <Field label="Created">
        <Text>
          {formatDate(doc.created)}{" "}
          <Text dimColor>({formatRelative(doc.created)})</Text>
        </Text>
      </Field>
      <Field label="Added">
        <Text>
          {formatDate(doc.added)}{" "}
          <Text dimColor>({formatRelative(doc.added)})</Text>
        </Text>
      </Field>
      {doc.modified && (
        <Field label="Modified">
          <Text>
            {formatDate(doc.modified)}{" "}
            <Text dimColor>({formatRelative(doc.modified)})</Text>
          </Text>
        </Field>
      )}

      <Box marginTop={1} />

      <Field label="Tags">
        {docTags.length > 0 ? (
          <Text>
            {docTags.map((tag, i) => (
              <Text key={tag.id}>
                {i > 0 && <Text> </Text>}
                <Text color={tagColor(i)}>
                  {tag.is_inbox_tag ? "[INBOX] " : ""}
                  {tag.name}
                </Text>
              </Text>
            ))}
          </Text>
        ) : (
          <Text dimColor>none</Text>
        )}
      </Field>

      <Box marginTop={1} />

      <Field label="Filename">
        <Text dimColor>{doc.original_file_name}</Text>
      </Field>
      {doc.archived_file_name && (
        <Field label="Archived">
          <Text dimColor>{doc.archived_file_name}</Text>
        </Field>
      )}
      {doc.page_count != null && (
        <Field label="Pages">
          <Text>{doc.page_count}</Text>
        </Field>
      )}
      {typeof doc.user_can_change === "boolean" && (
        <Field label="Access">
          <Text color={doc.user_can_change ? "green" : "yellow"}>
            {doc.user_can_change ? "editable" : "read-only"}
          </Text>
        </Field>
      )}
      <Field label="ID">
        <Text dimColor>#{doc.id}</Text>
      </Field>

      {doc.notes && doc.notes.length > 0 && (
        <>
          <Box marginTop={1} />
          <Text bold dimColor>
            Notes ({doc.notes.length})
          </Text>
          {doc.notes.map((note) => (
            <Box key={note.id} marginLeft={1}>
              <Text dimColor>{formatRelative(note.created)}: </Text>
              <Text>{note.note}</Text>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}

function ContentView({
  document: doc,
  height,
}: {
  document: Document;
  height: number;
}) {
  const maxLines = Math.max(height - 3, 5);
  const lines = (doc.content ?? "").split("\n").slice(0, maxLines);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold dimColor>
          Content (OCR)
        </Text>
      </Box>
      <Text wrap="truncate">{lines.join("\n")}</Text>
      {(doc.content ?? "").split("\n").length > maxLines && (
        <Text dimColor>
          ... {(doc.content ?? "").split("\n").length - maxLines} more lines
        </Text>
      )}
    </Box>
  );
}

function NotesView({ document: doc }: { document: Document }) {
  const notes = doc.notes ?? [];

  if (notes.length === 0) {
    return (
      <Box justifyContent="center" alignItems="center" flexGrow={1}>
        <Text dimColor>No notes</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Box marginBottom={1}>
        <Text bold dimColor>
          Notes ({notes.length})
        </Text>
      </Box>
      {notes.map((note) => (
        <Box key={note.id} flexDirection="column" marginBottom={1}>
          <Text dimColor>
            {formatDate(note.created)} ({formatRelative(note.created)})
            {noteAuthorLabel(note) ? ` by ${noteAuthorLabel(note)}` : ""}
          </Text>
          <Text>{note.note}</Text>
        </Box>
      ))}
    </Box>
  );
}

export function DetailPanel({
  document: doc,
  metadata,
  mode,
  height,
}: Props) {
  if (!doc) {
    return (
      <Box
        flexDirection="column"
        height={height}
        justifyContent="center"
        alignItems="center"
      >
        <Text dimColor>No document selected</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height={height} paddingLeft={1}>
      {/* Mode tabs */}
      <Box marginBottom={0}>
        <Text
          bold={mode === "detail"}
          color={mode === "detail" ? "green" : undefined}
          dimColor={mode !== "detail"}
        >
          {mode === "detail" ? "[d]etail" : " d·etail"}
        </Text>
        <Text>{"  "}</Text>
        <Text
          bold={mode === "notes"}
          color={mode === "notes" ? "green" : undefined}
          dimColor={mode !== "notes"}
        >
          {mode === "notes" ? "[n]otes" : " n·otes"}
        </Text>
        <Text>{"  "}</Text>
        <Text
          bold={mode === "content"}
          color={mode === "content" ? "green" : undefined}
          dimColor={mode !== "content"}
        >
          {mode === "content" ? "[c]ontent" : " c·ontent"}
        </Text>
      </Box>

      <Box flexDirection="column" flexGrow={1} marginTop={1}>
        {mode === "detail" && (
          <DetailView document={doc} metadata={metadata} />
        )}
        {mode === "notes" && <NotesView document={doc} />}
        {mode === "content" && (
          <ContentView document={doc} height={height - 2} />
        )}
      </Box>
    </Box>
  );
}
