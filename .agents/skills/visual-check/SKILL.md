---
name: visual-check
description: Visually verify the running blog site — build, start preview, drive it with a reusable Playwright probe (navigate, wait, click, type, hover, eval), screenshot, and clean up. Use after UI/layout/styling/terminal changes, or to confirm a visual bug (clipping, black bands, seams, hover states) is fixed.
---

# Visual check

Loop: **build → preview → probe/screenshot → read screenshot → cleanup**.

## 1. Build (required)

```sh
npm run build                                  # dev shape
# or the deployed shape:
BASE_PATH="/<repo>" npm run build
```

`vite preview` serves `build/` and **refuses to start without a successful build** — a missing or half-finished build shows up as `ERR_CONNECTION_REFUSED`. If you changed source since the last build, build again before previewing.

## 2. Preview

```sh
(npm run preview -- --port 4173 >/tmp/preview.log 2>&1 &)   # add BASE_PATH=… to check the deploy shape
sleep 3
```

## 3. Probe + screenshot

```sh
node .agents/skills/visual-check/scripts/shot.mjs \
  --url /ai/basics \
  --screenshot /tmp/shot.png \
  --wait ".terminal-host .xterm-rows > div" \
  [--hover ".breadcrumb .crumb"] \
  [--click "selector" --click "selector"] \
  [--type "open about" --type-into ".agent-terminal" --press Enter] \
  [--eval "document.querySelectorAll('.breadcrumb a').length"] \
  [--base /blog] [--width 1280 --height 720]
```

The probe navigates (exits 1 on a failed status), applies waits/clicks/types/hover, prints each `--eval` result, saves the screenshot, and closes. Read the screenshot and judge the actual claim.

## 4. What to assert (known failure classes in this repo)

- Terminal pane: grid fills the pane (compare `.xterm-screen` size vs `.terminal-host` via `--eval`); text wraps at the edge, never clipped; no black band below the prompt.
- Two-pane shell: exactly one terminal frame; divider present between panes; macOS chrome (dots/title/round corners) intact.
- Links: print computed `href`s — the base prefix must appear **exactly once** (`/blog/ai`, never `/blog/blog/ai`).
- Hover/focus affordances: assert computed color (`--eval "getComputedStyle(document.querySelector('.crumb')).color"` after `--hover`), don't guess from pixels.
- Mobile: `--width 390 --height 844` — panes stack, divider hidden, no horizontal overflow.

## 5. Cleanup

```sh
pkill -f "vite preview"; rm -f /tmp/shot*.png
```

If the source tree changed during the session, rebuild so the next preview reflects reality.

## Division of labor

The e2e suite (`e2e/demo.test.ts`) encodes the durable regressions (fit dims, no ballooning, divider drag, breadcrumb nav/hover, link-click echo). Use this screenshot loop for what assertions can't express — and when a fix proves itself out, promote it to an e2e test.
