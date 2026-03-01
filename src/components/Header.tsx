import React from "react";
import { Box, Text } from "ink";
import type { Statistics } from "../api/types.ts";

interface Props {
  statistics: Statistics | null;
}

export function Header({ statistics }: Props) {
  return (
    <Box>
      <Text bold color="green">
        paperless
      </Text>
      <Text bold dimColor>
        -tui
      </Text>
      <Box flexGrow={1} />
      {statistics && (
        <Box gap={2}>
          <Text dimColor>
            <Text color="green" bold>
              {statistics.documents_total}
            </Text>{" "}
            documents
          </Text>
          {statistics.documents_inbox > 0 && (
            <Text dimColor>
              <Text color="yellow" bold>
                {statistics.documents_inbox}
              </Text>{" "}
              inbox
            </Text>
          )}
          {statistics.character_count > 0 && (
            <Text dimColor>
              {(statistics.character_count / 1_000_000).toFixed(1)}M chars
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}
