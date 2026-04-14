# RivalScan 🔍

> AI-powered competitive intelligence — research any company in seconds.

RivalScan scrapes a company's public web presence, feeds it through Groq, and returns a full structured competitive intelligence report complete with SWOT analysis, competitor comparison, and a scoring radar chart.

## ✨ Features

- 🌐 **Web Scraping** via Firecrawl (homepage, /about, /pricing, /blog)
- 🤖 **AI Analysis** via Groq AI (structured JSON output)
- 📊 **SWOT Analysis** with animated 2×2 grid
- 🏆 **Competitor Comparison** table
- 📡 **Radar/Spider Chart** (Recharts) scoring 6 axes
- 📰 **Recent News Feed** with sentiment tagging
- ⚡ **Real-time Streaming** via Server-Sent Events (SSE)
- 💾 **Redis Caching** via Upstash (24h TTL)
- 🌙 **Dark Mode** toggle
- 🖨️ **Export to PDF** via browser print

---

## 🚀 Getting Started

### 1. Clone and install

```bash
cd app
npm install
```

### 2. Configure environment variables

Copy `.env.local` (already present) and fill in your API keys:

```env
GROQ_API_KEY=sk-\.\.\.
FIRECRAWL_API_KEY=fc-...
UPSTASH_REDIS_REST_URL=https://...         # Optional
UPSTASH_REDIS_REST_TOKEN=...               # Optional
```

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Groq API key from [console.groq.com](https://console.groq.com/keys) |
| `FIRECRAWL_API_KEY` | ✅ Yes | Firecrawl key from [firecrawl.dev](https://firecrawl.dev) |
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash Redis REST URL for caching |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis REST token |

> **Note:** If Firecrawl or Redis are not configured, the app gracefully falls back — Claude will use its web knowledge and no caching will occur.

### 3. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── layout.tsx             # Root layout, fonts, theme
│   ├── page.tsx               # Homepage with search
│   ├── globals.css            # Design tokens, print styles
│   ├── api/
│   │   └── research/
│   │       └── route.ts       # POST /api/research (SSE streaming)
│   └── report/
│       └── [company]/
│           └── page.tsx       # Report page with tabs
├── components/
│   ├── navbar.tsx             # Sticky navigation bar
│   ├── theme-provider.tsx     # next-themes wrapper
│   ├── ui/                    # shadcn/ui components
│   └── report/
│       ├── OverviewCard.tsx   # Company overview
│       ├── SwotAnalysis.tsx   # 2×2 SWOT grid
│       ├── CompetitorTable.tsx# Competitor comparison table
│       ├── RadarSpiderChart.tsx# Recharts radar chart
│       ├── NewsFeed.tsx       # News cards with sentiment
│       └── ReportSkeleton.tsx # Loading skeleton
└── lib/
    ├── types.ts               # TypeScript interfaces
    ├── claude.ts              # Anthropic SDK + prompts
    └── redis.ts               # Upstash Redis cache helpers
```

---

## 🔌 API Reference

### `POST /api/research`

Request body:
```json
{ "company": "Stripe" }
```

Streams Server-Sent Events (SSE):

| Event type | Payload |
|---|---|
| `scraping` | `{ status, message }` |
| `reading` | `{ status, message }` |
| `generating` | `{ status, message }` |
| `done` | `{ status, message, data: ResearchReport }` |
| `error` | `{ status, message, error }` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Charts | Recharts |
| AI | Groq Llama 3.3 (`llama-3.3-70b-versatile`) |
| Scraping | Firecrawl SDK |
| Caching | Upstash Redis |
| Fonts | Inter (next/font) |
