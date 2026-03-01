import React from "react";
import { Box, Text } from "ink";
import { TextInput } from "@inkjs/ui";

interface Props {
  query: string;
  onChange: (value: string) => void;
  isActive: boolean;
  resultCount: number;
  loading: boolean;
}

export function SearchInput({
  query,
  onChange,
  isActive,
  resultCount,
  loading,
}: Props) {
  return (
    <Box borderStyle="round" borderColor={isActive ? "green" : "gray"} paddingLeft={1}>
      <Text bold color={isActive ? "green" : "gray"}>
        {isActive ? "/" : " "}{" "}
      </Text>
      {isActive ? (
        <TextInput
          key={query}
          defaultValue={query}
          placeholder="search documents…"
          onChange={onChange}
        />
      ) : (
        query ? <Text>{query}</Text> : <Text dimColor>Tab or / to search</Text>
      )}
      <Box flexGrow={1} />
      {loading && (
        <Text dimColor color="yellow">
          {" "}searching…{" "}
        </Text>
      )}
    </Box>
  );
}
