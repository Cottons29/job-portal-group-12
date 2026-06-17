# FirstStep — Project Presentation (Group 12)

A **reveal.js** slide deck about the FirstStep student part-time job portal.
25 slides covering the problem, solution, live UI, architecture, tech stack,
security, trust & safety, demo flow, challenges, and roadmap.

## Run it

Any static file server works. The simplest options:

```bash
# Option A — npm script (uses npx serve)
npm start            # → http://localhost:4321

# Option B — Python (no install)
python3 -m http.server 4321   # → http://localhost:4321/index.html

# Option C — Docker (served by nginx, via docker-compose)
docker compose up -d presentation   # → http://localhost:3083
```

Then open the printed URL in a browser.

## Controls

- Arrow keys / Space — navigate slides
- `F` — fullscreen
- `S` — speaker view (script notes per slide)
- `Esc` / `O` — slide overview

## Structure

```
presentation/
├── index.html          # the deck (reveal.js via CDN)
├── assets/
│   ├── custom.css      # FirstStep dark theme
│   ├── landing-hero.png, landing.png, auth.png,
│   │   about.png, contact.png, privacy.png, terms.png   # live UI screenshots
└── README.md
```

## Notes

- Slides use the reveal.js CDN, so an internet connection is required for the
  framework/theme; screenshots are local in `assets/`.
- Screenshots were captured from the running frontend at `http://localhost:5173`.
- Content is based on `../PRESENTATION.md`.
