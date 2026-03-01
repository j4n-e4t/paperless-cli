import React from "react";
import { Box, Text } from "ink";
import { Spinner } from "@inkjs/ui";
import type { Statistics } from "../api/types.ts";

interface Props {
  count: number;
  loading: boolean;
  statistics: Statistics | null;
  panelMode: "detail" | "notes" | "content";
}

function Keyhint({ k, label }: { k: string; label: string }) {
  return (
    <Text>
      <Text color="green" bold>
        {k}
      </Text>
      <Text dimColor>:{label} </Text>
    </Text>
  );
}

export function StatusBar({ count, loading, statistics, panelMode }: Props) {
  return (
    <Box>
      <Box>
        {loading ? (
          <Spinner label="Searching…" />
        ) : (
          <Text>
            <Text bold color="green">
              {count}
            </Text>
            <Text dimColor>
              {" "}
              doc{count !== 1 ? "s" : ""}
            </Text>
            {statistics && (
              <Text dimColor>
                {" "}
                / {statistics.documents_total} total
                {statistics.documents_inbox > 0 && (
                  <Text color="yellow">
                    {" "}
                    ({statistics.documents_inbox} inbox)
                  </Text>
                )}
              </Text>
            )}
          </Text>
        )}
      </Box>
      <Box flexGrow={1} />
      <Box gap={1}>
        <Keyhint k="j/k" label="nav" />
        <Keyhint k="d" label="detail" />
        <Keyhint k="n" label="notes" />
        <Keyhint k="c" label="content" />
        <Keyhint k="o" label="open" />
        <Keyhint k="?" label="help" />
        <Keyhint k="q" label="quit" />
      </Box>
    </Box>
  );
}
