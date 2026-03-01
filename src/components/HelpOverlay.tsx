import React from "react";
import { Box, Text } from "ink";

interface Props {
  height: number;
  width: number;
}

const SECTIONS = [
  {
    title: "Navigation",
    keys: [
      ["j / ↓", "Move down"],
      ["k / ↑", "Move up"],
      ["g", "Go to top"],
      ["G", "Go to bottom"],
      ["Ctrl+d", "Page down"],
      ["Ctrl+u", "Page up"],
      ["Tab", "Toggle search focus"],
      ["Esc", "Back to list"],
    ],
  },
  {
    title: "Views",
    keys: [
      ["Enter", "Select document / toggle detail"],
      ["n", "Notes"],
      ["c", "Content (OCR text)"],
      ["d", "Detail (metadata)"],
    ],
  },
  {
    title: "Actions",
    keys: [
      ["o", "Open in browser (Paperless UI)"],
      ["?", "Toggle this help"],
      ["q", "Quit"],
    ],
  },
];

export function HelpOverlay({ height, width }: Props) {
  const boxW = Math.min(width - 4, 56);
  const boxH = Math.min(height - 4, 24);
  const padTop = Math.max(0, Math.floor((height - boxH) / 2));
  const padLeft = Math.max(0, Math.floor((width - boxW) / 2));

  return (
    <Box
      position="absolute"
      marginTop={padTop}
      marginLeft={padLeft}
      width={boxW}
      height={boxH}
      flexDirection="column"
      borderStyle="double"
      borderColor="green"
      paddingLeft={2}
      paddingRight={2}
      paddingTop={1}
    >
      <Box justifyContent="center" marginBottom={1}>
        <Text bold color="green">
          Keyboard Shortcuts
        </Text>
      </Box>

      {SECTIONS.map((section) => (
        <Box key={section.title} flexDirection="column" marginBottom={1}>
          <Text bold underline>
            {section.title}
          </Text>
          {section.keys.map(([key, desc]) => (
            <Box key={key}>
              <Box width={16}>
                <Text color="cyan" bold>
                  {key}
                </Text>
              </Box>
              <Text>{desc}</Text>
            </Box>
          ))}
        </Box>
      ))}

      <Box justifyContent="center">
        <Text dimColor>Press ? or Esc to close</Text>
      </Box>
    </Box>
  );
}
