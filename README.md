# ckconflux-react

A production-ready React landing page app for CK Conflux that introduces Matrix/Element onboarding, MXID basics, spaces/rooms/call-room concepts, and links for Mastodon + TeamSpeak.

## Tech stack

- React + Vite
- Tailwind CSS + PostCSS + Autoprefixer
- Framer Motion + Lucide React
- Vitest + React Testing Library
- Docker (multi-stage build with nginx runtime)
- Helm (deployment packaging)
- GitHub Actions (CI + container + chart publishing)

## Prerequisites

- Node.js 22+
- npm 10+
- Docker (for container builds)
- Helm 3.15+
- kubeconform (for schema checks)

## Local development

```bash
npm ci --include=dev
npm run dev
```

The app starts on `http://localhost:5173` by default.

## Testing

```bash
npm run test
npm run test:run
npm run lint
npm run build
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

The container serves the static app on port `80`, and the Docker healthcheck probes `http://127.0.0.1:80/`.

## Helm chart

Chart path: `charts/ckconflux-react`

### Why OCI in GHCR?

This repository already publishes application images to GHCR, so publishing Helm charts as OCI artifacts in GHCR keeps auth, permissions, and provenance in one registry. This avoids maintaining a second distribution surface (like GitHub Pages index hosting) and uses the default `GITHUB_TOKEN` with package write permission.

### Install from OCI

```bash
helm registry login ghcr.io -u <github-user>
helm install ckconflux-react oci://ghcr.io/colonelkrud/charts/ckconflux-react --version 0.1.0
```

### Common values

```yaml
replicaCount: 2
image:
  repository: ghcr.io/colonelkrud/ckconflux-react
  tag: "main"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: ckconflux.example.com
      paths:
        - path: /
          pathType: Prefix

env:
  - name: NODE_ENV
    value: production

configMapRefs:
  - ckconflux-react-config
secretRefs:
  - ckconflux-react-secret
```

Probes default to HTTP `GET /` on the `http` port, which is safe for this static nginx-served app.
The default container security context keeps `readOnlyRootFilesystem: false` to avoid nginx runtime write-path failures out of the box; you can harden this with explicit writable mounts via `extraVolumes`/`extraVolumeMounts` if needed.

## Validation commands (no cluster required)

```bash
helm lint charts/ckconflux-react
helm template ckconflux-react charts/ckconflux-react > /tmp/ckconflux-react-rendered.yaml
kubeconform -strict -summary -ignore-missing-schemas /tmp/ckconflux-react-rendered.yaml
ct lint --charts charts/ckconflux-react
```

Or run the bundled target:

```bash
make helm-validate
```

## GitHub Actions

### CI workflow (`.github/workflows/ci.yml`)

Runs on pull requests and pushes to `main`:

- npm install/test/build/lint checks
- Helm lint
- Helm template render checks (default + CI values)
- kubeconform schema validation
- chart-testing lint

### Docker workflow (`.github/workflows/docker.yml`)

- Pull requests: build-only validation (no push)
- Pushes to `main`: build + publish image to GHCR using `GITHUB_TOKEN`

Published image path:

```text
ghcr.io/<repo-owner>/ckconflux-react
```

### Helm release workflow (`.github/workflows/helm-release.yml`)

Publishes chart packages to GHCR OCI only when:

- Changes are pushed to `main` affecting chart files/workflow, or
- A `chart-v*` tag is pushed, or
- Manually run via `workflow_dispatch`.

Published chart path:

```text
oci://ghcr.io/<repo-owner>/charts/ckconflux-react
```

