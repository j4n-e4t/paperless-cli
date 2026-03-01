import React, { useState, useCallback, useEffect } from "react";
import { Box, useApp, useInput } from "ink";
import { Header } from "./components/Header.tsx";
import { SearchInput } from "./components/SearchInput.tsx";
import { DocumentList } from "./components/DocumentList.tsx";
import { DetailPanel } from "./components/DetailPanel.tsx";
import { StatusBar } from "./components/StatusBar.tsx";
import { ToastOverlay } from "./components/ToastOverlay.tsx";
import { HelpOverlay } from "./components/HelpOverlay.tsx";
import { useDocuments } from "./hooks/useDocuments.ts";
import { useMetadata } from "./hooks/useMetadata.ts";
import { useToast } from "./hooks/useToast.ts";
import { useTerminalSize } from "./hooks/useTerminalSize.ts";
import { getDocumentUrl } from "./api/client.ts";
import { openExternalUrl } from "./utils/open.ts";

type Focus = "search" | "list";
type PanelMode = "detail" | "notes" | "content";

export function App() {
  const { exit } = useApp();
  const { rows: termHeight, columns: termWidth } = useTerminalSize();
  // Horizontal split: list gets top ~40%, detail gets bottom ~60%
  const contentHeight = Math.max(termHeight - 4, 6); // minus header + search + status + border
  const listHeight = Math.max(Math.floor(contentHeight * 0.4), 4);
  const detailHeight = contentHeight - listHeight;

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [focus, setFocus] = useState<Focus>("list");
  const [panelMode, setPanelMode] = useState<PanelMode>("detail");
  const [showHelp, setShowHelp] = useState(false);

  const { toasts, addToast } = useToast();
  const handleError = useCallback(
    (message: string) => addToast(message, "error"),
    [addToast],
  );

  const { results, count, loading } = useDocuments(query, handleError);
  const metadata = useMetadata(handleError);

  useEffect(() => {
    if (results.length === 0) {
      if (selectedIndex !== 0) setSelectedIndex(0);
      if (selectedDocId !== null) setSelectedDocId(null);
      return;
    }

    const existingIndex =
      selectedDocId === null
        ? -1
        : results.findIndex((doc) => doc.id === selectedDocId);

    if (existingIndex >= 0) {
      if (existingIndex !== selectedIndex) {
        setSelectedIndex(existingIndex);
      }
      return;
    }

    const nextIndex = Math.min(selectedIndex, results.length - 1);
    const nextDoc = results[nextIndex];

    if (nextIndex !== selectedIndex) {
      setSelectedIndex(nextIndex);
    }
    if (nextDoc && nextDoc.id !== selectedDocId) {
      setSelectedDocId(nextDoc.id);
    }
  }, [results, selectedDocId, selectedIndex]);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setSelectedIndex(0);
    setSelectedDocId(null);
  }, []);

  // Auto-select doc when navigating
  const selectDoc = useCallback(
    (index: number) => {
      const doc = results[index];
      if (doc) {
        setSelectedDocId(doc.id);
      }
    },
    [results],
  );

  const pageSize = Math.max(Math.floor(listHeight / 2) - 2, 1);

  useInput((input, key) => {
    // Help toggle
    if (input === "?") {
      setShowHelp((h) => !h);
      return;
    }

    // Close help with Esc
    if (key.escape) {
      if (showHelp) {
        setShowHelp(false);
        return;
      }
      if (focus === "search") {
        handleQueryChange("");
        setFocus("list");
        return;
      }
      return;
    }

    // Don't handle other keys while help is open
    if (showHelp) return;

    // Quit
    if (input === "q" && focus === "list") {
      exit();
      return;
    }

    // Focus switching
    if (key.tab || (input === "/" && focus === "list")) {
      setFocus((f) => (f === "search" ? "list" : "search"));
      return;
    }

    if (focus === "list") {
      // Navigation
      if (input === "j" || key.downArrow) {
        const next = Math.min(selectedIndex + 1, results.length - 1);
        setSelectedIndex(next);
        selectDoc(next);
      } else if (input === "k" || key.upArrow) {
        const next = Math.max(selectedIndex - 1, 0);
        setSelectedIndex(next);
        selectDoc(next);
      } else if (input === "g") {
        setSelectedIndex(0);
        selectDoc(0);
      } else if (input === "G") {
        const last = results.length - 1;
        setSelectedIndex(last);
        selectDoc(last);
      } else if (key.ctrl && input === "d") {
        const next = Math.min(selectedIndex + pageSize, results.length - 1);
        setSelectedIndex(next);
        selectDoc(next);
      } else if (key.ctrl && input === "u") {
        const next = Math.max(selectedIndex - pageSize, 0);
        setSelectedIndex(next);
        selectDoc(next);
      }
      // Select / Enter
      else if (key.return) {
        const doc = results[selectedIndex];
        if (doc) {
          setSelectedDocId(doc.id);
          if (panelMode !== "detail") setPanelMode("detail");
        }
      }
      // Panel mode switches
      else if (input === "n") {
        const doc = results[selectedIndex];
        if (doc) setSelectedDocId(doc.id);
        setPanelMode("notes");
      } else if (input === "d") {
        const doc = results[selectedIndex];
        if (doc) setSelectedDocId(doc.id);
        setPanelMode("detail");
      } else if (input === "c") {
        const doc = results[selectedIndex];
        if (doc) setSelectedDocId(doc.id);
        setPanelMode("content");
      }
      // Open in browser
      else if (input === "o") {
        const doc = results[selectedIndex];
        if (doc) {
          const url = getDocumentUrl(doc.id);
          void openExternalUrl(url).then(
            () => {
              addToast(`Opened #${doc.id} in browser`, "info");
            },
            () => {
              addToast(`Failed to open browser`, "error");
            },
          );
        }
      }
    }
  });

  const selectedDoc = selectedDocId
    ? results.find((d) => d.id === selectedDocId) ?? null
    : null;

  return (
    <Box flexDirection="column" height={termHeight}>
      <Header statistics={metadata.statistics} />
      <SearchInput
        query={query}
        onChange={handleQueryChange}
        isActive={focus === "search"}
        resultCount={count}
        loading={loading}
      />
      <Box flexDirection="column" flexGrow={1}>
        <DocumentList
          documents={results}
          selectedIndex={selectedIndex}
          height={listHeight}
          metadata={metadata}
        />
        <Box
          borderStyle="single"
          borderTop
          borderBottom={false}
          borderLeft={false}
          borderRight={false}
          borderColor="gray"
        >
          <DetailPanel
            document={selectedDoc}
            metadata={metadata}
            mode={panelMode}
            height={detailHeight}
          />
        </Box>
      </Box>
      <StatusBar
        count={count}
        loading={loading}
        statistics={metadata.statistics}
        panelMode={panelMode}
      />
      <ToastOverlay toasts={toasts} />
      {showHelp && <HelpOverlay height={termHeight} width={termWidth} />}
    </Box>
  );
}
