# Patchies Goodies

A static site built with TanStack Start, configured for deployment to GitHub Pages.

## Quick Start

### Prerequisites
- Node.js 22+
- pnpm 10+

### Development

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:5062)
pnpm dev
```

### Production Build

```bash
# Build static site
pnpm build

# Preview production build
pnpm preview
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Initial Setup

1. Create a GitHub repository named `patchies-goodies`
2. Push this code to the repository's `main` branch
3. Go to repository Settings → Pages
4. Under "Build and deployment", select "GitHub Actions" as the source
5. The deployment workflow will run automatically on every push to `main`

### Manual Deployment (Alternative)

```bash
pnpm build
# Static files will be in `dist/client/`
```

Then deploy the `dist/client/` directory to GitHub Pages manually.

## Project Structure

- `src/routes/` - File-based routes (file-to-route mapping)
- `src/components/` - Reusable components
- `src/utils/` - Utility functions
- `src/styles/` - Global styles
- `public/` - Static assets
- `.github/workflows/` - GitHub Actions workflows

## Configuration

- Base path: `/patchies-goodies/` (configured in `vite.config.ts`)
- Port: 5062 (development)
- Output directory: `dist/client/` (production)

## Learn More

- [TanStack Start Docs](https://tanstack.com/start)
- [TanStack Router Docs](https://tanstack.com/router)
- [Vite Docs](https://vitejs.dev)
