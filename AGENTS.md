# AGENTS.md — CekSound

## What is this

Audio deepfake detection web app. Next.js frontend + Flask Python backend. Indonesian language UI.

## Architecture

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (New York style)
- **Backend**: Flask API (`api/analyze.py`) — runs on port 5328
- **AI**: Two strategies controlled by `AI_STRATEGY` env var:
  - `onnx` — local ONNX model (`models/model.onnx`, gitignored)
  - `resemble` — Resemble AI cloud API
- **Auth/DB**: Supabase (auth + `detection_history` table)
- **Deploy**: Vercel (frontend), separate host for Flask backend

## Key directories

```
app/               # Next.js App Router pages
  (auth)/          # Login/register (route group)
  dashboard/       # User dashboard with detection history
  periksa/         # Main audio analysis page
  pengaturan/      # Settings
  api/             # Empty — API calls go to Flask via proxy
api/
  analyze.py       # Flask backend — the actual API
components/        # React components (app-layout, sidebar, landing sections)
  ui/              # shadcn/ui primitives
lib/
  supabase.ts      # Supabase client (uses NEXT_PUBLIC_ env vars)
  utils.ts         # cn() helper for Tailwind
hooks/             # Custom React hooks
models/            # ONNX model files (gitignored)
```

## Dev commands

```bash
# Frontend
npm run dev        # Next.js dev server

# Backend (separate terminal, requires Python)
pip install -r requirements.txt
python api/analyze.py   # Flask on port 5328
```

In development, Next.js rewrites `/api/*` to `http://127.0.0.1:5328/api/*` (see `next.config.mjs`). Both servers must run for analysis to work.

## Lint / typecheck

```bash
npm run lint       # ESLint 9 flat config (eslint.config.mjs) — typescript-eslint + next + react-hooks
```

**No typecheck command**: `typescript` is a devDependency but there's no `typecheck` script. Build ignores TS errors (`ignoreBuildErrors: true` in `next.config.mjs`). Run `npx tsc --noEmit` manually if needed.

## Gotchas

- **Flask backend is separate**: Not a Next.js API route. The `app/api/` directory is empty. All `/api/analyze` calls proxy to Flask.
- **Python deps not in package.json**: `requirements.txt` has Flask, librosa, onnxruntime, supabase, resemble, imageio-ffmpeg. Install separately.
- **Models gitignored**: `models/`, `*.onnx`, `*.safetensors` are in `.gitignore`. ONNX model must be placed manually at `models/model.onnx`.
- **ffmpeg required for m4a/mp4**: `api/analyze.py` uses `imageio-ffmpeg` (bundled) with fallback to system `ffmpeg`.
- **Supabase credentials in `.env.local`**: Uses `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. The service role key is used server-side in Flask for storage uploads (Resemble strategy).
- **shadcn/ui style**: New York, neutral base, CSS variables enabled. Use `npx shadcn@latest add <component>` to add components.
- **Path alias**: `@/*` maps to project root (e.g., `import { supabase } from '@/lib/supabase'`).
- **No README**: No README file exists. This file and the code are the primary documentation.
