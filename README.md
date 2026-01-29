# Patchies Goodies

A collection of custom widgets for [Patchies](https://github.com/heypoom/patchies) — a creative coding patcher for audio-visual things that runs on the web.

## What is Patchies?

[Patchies](https://github.com/heypoom/patchies) is a creative coding patcher for audio-visual things that runs on the web. Connect tools and libraries you know and try out new ones ✨

Patchies is designed to mix textual coding and visual patching, using the best of both worlds. Instead of writing long chunks of code or patching together a huge web of small objects, Patchies encourages you to write small and compact programs and patch 'em together.

If you haven't used a patching environment before, patching is a visual way to program by connecting objects together. Each object does something e.g. generate sound, generate visual, compute some values. You connect the output of one object to the input of another object to create a flow of data.

This lets you visually see the program's core composition and its in-between results such as audio, video and message flows, while using tools you're already familiar with that lets you do a lot with a bit of code. This is done through Message Passing, Video Chaining and Audio Chaining. They're heavily inspired by tools like Max, Pd, TouchDesigner and VVVV.

## What is Patchies Goodies?

This repository hosts a collection of custom widgets designed to be embedded in Patchies patches. These widgets run as standalone web applications that communicate with Patchies via `postMessage`, allowing seamless integration into your patches.

Each widget is a self-contained route that can be embedded as an iframe in Patchies.

## Available Widgets

### YouTube Player

**Route:** `/youtube`  
**URL:** `https://<your-github-username>.github.io/patchies-goodies/youtube`

A YouTube video player widget that can be controlled via postMessage. Perfect for integrating video playback into your patches.

#### Messages (Incoming)

Send these messages from Patchies to control the player:

```javascript
// Load a video
{type: "load", videoId: "dQw4w9WgXcQ"}

// Playback control
{type: "play"}
{type: "pause"}

// Seek to position (in seconds)
{type: "seek", position: 120}
```

#### Messages (Outgoing)

The widget sends these messages back to Patchies:

```javascript
// Player is ready
{type: "ready"}

// Playback state changed
{type: "stateChange", state: "PLAYING" | "PAUSED" | "ENDED" | "BUFFERING"}

// Time update (sent every 500ms when playing)
{type: "timeUpdate", currentTime: 123.45, duration: 240.0}

// Error occurred
{type: "error", message: "Invalid video ID"}
```

## Development

### Prerequisites

- Node.js 22+ (managed via mise)
- pnpm 10+

### Setup

```bash
# Install mise tools and dependencies
mise install

# Enable pnpm via corepack
corepack enable

# Install dependencies
pnpm install
```

### Development Server

```bash
pnpm dev
```

Runs at http://localhost:5062

### Build

```bash
pnpm build
```

Static files are output to `dist/client/` with all routes prerendered as static HTML.

## Deployment

This project is configured for automatic deployment to GitHub Pages.

1. Push to `main` branch
2. GitHub Actions will automatically build and deploy
3. Site will be available at `https://<your-username>.github.io/patchies-goodies/`

## Creating New Widgets

1. Create a new file in `src/routes/` (e.g., `my-widget.tsx`)
2. Use `createFileRoute` from TanStack Router
3. Implement your widget with postMessage communication
4. The route will be automatically available at `/<route-name>`

Example widget structure:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/my-widget')({
  component: MyWidget,
})

function MyWidget() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle incoming messages from Patchies
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const sendToParent = (data: any) => {
    window.parent.postMessage(data, '*')
  }

  return <div>Your widget here</div>
}
```

## Project Structure

- `src/routes/` - Widget routes (file-based routing)
- `src/components/` - Shared components
- `vite.config.ts` - Build configuration with prerendering

## License

MIT
