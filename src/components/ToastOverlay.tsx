import React from "react";
import { Box, Text } from "ink";
import type { Toast } from "../hooks/useToast.ts";

interface Props {
  toasts: Toast[];
}

export function ToastOverlay({ toasts }: Props) {
  if (toasts.length === 0) return null;

  return (
    <Box flexDirection="column" position="absolute" marginLeft={2} marginTop={1}>
      {toasts.map((toast) => (
        <Box
          key={toast.id}
          borderStyle="round"
          borderColor={toast.type === "error" ? "red" : "green"}
          paddingLeft={1}
          paddingRight={1}
        >
          <Text color={toast.type === "error" ? "red" : "green"} bold>
            {toast.type === "error" ? "! " : "i "}
          </Text>
          <Text>{toast.message}</Text>
        </Box>
      ))}
    </Box>
  );
}
