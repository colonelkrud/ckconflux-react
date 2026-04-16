# ckconflux-react

A production-ready React landing page app for CK Conflux that introduces Matrix/Element onboarding, MXID basics, spaces/rooms/call-room concepts, and links for Mastodon + TeamSpeak. This repository is intentionally static-site-friendly and designed to be wrapped by Helm later in a separate chart repository.

## Tech stack

- React + Vite
- Tailwind CSS + PostCSS + Autoprefixer
- Framer Motion + Lucide React
- Vitest + React Testing Library
- Docker (multi-stage build with nginx runtime)
- GitHub Actions (CI + container build/publish)

## Prerequisites

- Node.js 22+
- npm 10+
- Docker (for container builds)

## Local development

```bash
npm ci
npm run dev
```

The app starts on `http://localhost:5173` by default.

## Testing

```bash
npm run test
npm run test:run
```

## Production build

```bash
npm run build
npm run preview
```

## Docker

Build image:

```bash
docker build -t ckconflux-react:local .
```

Run image:

```bash
docker run --rm -p 8080:80 ckconflux-react:local
```

The container serves the static app on port `80`.

## GitHub Actions

### CI workflow (`.github/workflows/ci.yml`)

Runs on pull requests and pushes to `main`:

- `npm ci`
- `npm run test:run`
- `npm run build`
- `npm run lint`

### Docker workflow (`.github/workflows/docker.yml`)

- Pull requests: build-only validation (no push)
- Pushes to `main`: build + publish to GHCR using `GITHUB_TOKEN`

Published image path:

```text
ghcr.io/<repo-owner>/ckconflux-react
```

Tag strategy:

- `sha-<shortsha>` for immutable commit tags
- `main` for default branch tip
- `latest` for default branch tip

## Helm/Kubernetes future deployment note

This repo intentionally avoids embedding Helm files so it remains a clean app/image source. A separate chart repo can consume the GHCR image tags above and manage environment-specific Helm values (replicas, ingress, secrets, resources, probes, etc.).
