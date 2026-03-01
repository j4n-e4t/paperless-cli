# paperless-cli

Terminal UI for browsing and searching documents in Paperless-ngx.

## Requirements

- Node.js 20 or newer at runtime
- Bun 1.3 or newer to build from source
- `PAPERLESS_URL` and `PAPERLESS_TOKEN` in the environment

## Usage

```sh
paperless-cli
```

Environment variables:

- `PAPERLESS_URL`: base URL for your Paperless-ngx instance
- `PAPERLESS_TOKEN`: API token for your Paperless-ngx user
- `PAPERLESS_FRONTEND_URL`: optional override used when opening a document in the browser

## Local development

```sh
bun run dev
```

## Build

```sh
bun run build
./dist/paperless-cli --help
```

## Homebrew release notes

The repository includes a formula template at [Formula/paperless-cli.rb](/Users/julian/p/paperless-cli/Formula/paperless-cli.rb). For each release:

1. Tag and publish a GitHub release for the new version.
2. Download the release tarball and compute its SHA-256.
3. Update the formula `url`, `sha256`, and `license`.
4. Commit the formula to your tap repository.

This template already points at `j4n-e4t/paperless-cli`.

The formula test runs `paperless-cli --version`, so that command should remain non-interactive.
