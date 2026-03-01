import React from "react";
import { Box, Text } from "ink";
import type { Document, Tag } from "../api/types.ts";
import type { Metadata } from "../hooks/useMetadata.ts";

interface Props {
  documents: Document[];
  selectedIndex: number;
  height: number;
  metadata: Metadata;
}

const TAG_COLORS: string[] = [
  "cyan",
  "magenta",
  "yellow",
  "blue",
  "green",
  "red",
];

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const y = String(d.getFullYear()).slice(2);
  return `${m}/${day}/${y}`;
}

export function DocumentList({
  documents,
  selectedIndex,
  height,
  metadata,
}: Props) {
  if (documents.length === 0) {
    return (
      <Box
        flexDirection="column"
        height={height}
        justifyContent="center"
        alignItems="center"
      >
        <Text dimColor>No documents found</Text>
      </Box>
    );
  }

  // 2 rows per item: title line + metadata line
  const rowsPerItem = 2;
  // Reserve 1 row for the scroll indicator
  const availableHeight = height - 1;
  const visibleItems = Math.min(
    Math.floor(availableHeight / rowsPerItem),
    documents.length,
  );
  let start = selectedIndex - Math.floor(visibleItems / 2);
  start = Math.max(0, Math.min(start, documents.length - visibleItems));
  const visible = documents.slice(start, start + visibleItems);

  const scrollPercent =
    documents.length <= visibleItems
      ? -1
      : Math.round((selectedIndex / (documents.length - 1)) * 100);

  return (
    <Box flexDirection="column" height={height}>
      {visible.map((doc, i) => {
        const realIndex = start + i;
        const isSelected = realIndex === selectedIndex;

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

        const docTags = (doc.tags ?? [])
          .map((id) => metadata.tags.get(id))
          .filter(Boolean) as Tag[];

        const asnStr = doc.archive_serial_number
          ? `#${String(doc.archive_serial_number).padStart(4, "0")}`
          : "";
        const noteCount = doc.notes?.length ?? 0;

        return (
          <Box key={doc.id} flexDirection="column">
            {/* Line 1: indicator + title */}
            <Box>
              <Text color={isSelected ? "green" : "gray"} bold={isSelected}>
                {isSelected ? ">" : " "}
              </Text>
              <Text> </Text>
              <Text
                color={isSelected ? "green" : undefined}
                bold={isSelected}
                wrap="truncate"
              >
                {doc.title}
              </Text>
            </Box>
            {/* Line 2: date + ASN + correspondent + type + tags (indented under title) */}
            <Box>
              <Text>{"  "}</Text>
              <Text dimColor>{formatShortDate(doc.created)}</Text>
              {asnStr && (
                <>
                  <Text dimColor> </Text>
                  <Text color="gray">{asnStr}</Text>
                </>
              )}
              {corrName && (
                <>
                  <Text dimColor>{" | "}</Text>
                  <Text color="cyan" dimColor>
                    {corrName}
                  </Text>
                </>
              )}
              {typeName && (
                <>
                  <Text dimColor>{" | "}</Text>
                  <Text color="yellow" dimColor>
                    {typeName}
                  </Text>
                </>
              )}
              {docTags.slice(0, 3).map((tag, ti) => (
                <React.Fragment key={tag.id}>
                  <Text dimColor> </Text>
                  <Text color={TAG_COLORS[ti % TAG_COLORS.length]} dimColor>
                    [{tag.name}]
                  </Text>
                </React.Fragment>
              ))}
              {docTags.length > 3 && (
                <Text dimColor> +{docTags.length - 3}</Text>
              )}
              {noteCount > 0 && (
                <>
                  <Text dimColor>{" | "}</Text>
                  <Text color="magenta" dimColor>
                    {noteCount} note{noteCount === 1 ? "" : "s"}
                  </Text>
                </>
              )}
            </Box>
          </Box>
        );
      })}

      <Box flexGrow={1} />

      {/* Scroll position */}
      <Box justifyContent="flex-end">
        <Text dimColor>
          {selectedIndex + 1}/{documents.length}
          {scrollPercent >= 0 &&
            ` ${
              scrollPercent === 0
                ? "TOP"
                : scrollPercent === 100
                  ? "BOT"
                  : `${scrollPercent}%`
            }`}
        </Text>
      </Box>
    </Box>
  );
}
