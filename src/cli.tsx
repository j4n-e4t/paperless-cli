#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import packageJson from "../package.json" with { type: "json" };

function printHelp() {
  console.log(`paperless-cli ${packageJson.version}

Terminal UI for browsing and searching Paperless-ngx documents.

Usage:
  paperless-cli
  paperless-cli --help
  paperless-cli --version

Required environment:
  PAPERLESS_URL           Base URL for your Paperless-ngx instance
  PAPERLESS_TOKEN         API token for your Paperless-ngx user

Optional environment:
  PAPERLESS_FRONTEND_URL  Override the browser URL used for opening documents
`);
}

const args = new Set(process.argv.slice(2));

if (args.has("--help") || args.has("-h")) {
  printHelp();
  process.exit(0);
}

if (args.has("--version") || args.has("-v")) {
  console.log(packageJson.version);
  process.exit(0);
}

const { App } = await import("./app.tsx");

render(<App />);
