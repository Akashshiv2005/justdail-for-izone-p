# Antigravity Agent Crash Fix Guide

## Why the Agent Crashes

Your system: **8GB RAM + AMD Ryzen 3** (entry-level laptop).

Antigravity IDE alone uses **~2.5 GB RAM** across 15+ processes. When the agent edits code:
1. It reads/writes files → VS Code file watcher triggers → TypeScript server re-indexes → **memory spikes**
2. Your large component files (Home.tsx=55KB, BusinessOwner.tsx=54KB, SuperAdmin.tsx=52KB) make this worse
3. When total RAM hits ~95%, Windows kills the agent's `language_server` process → `ECONNREFUSED`

Network reconnections also crash the agent because the gRPC connection doesn't auto-recover (extension limitation).

---

## Fixes Applied ✅

| Fix | What it does |
|-----|-------------|
| Aggressive file watcher exclusions | Stops VS Code from watching node_modules, venv, __pycache__, .db, .tsbuildinfo |
| Disabled minimap | Saves ~50MB GPU/RAM |
| Disabled git auto-refresh/fetch | Stops background git operations eating RAM |
| Disabled npm auto-detect | Stops package scanning |
| TypeScript memory limit = 1GB | Prevents TS server from growing unbounded |
| Cleaned 87+ __pycache__ directories | Removed ~30MB of cached files |
| AGENTS.md rules | Tells agent to avoid scanning heavy directories |

---

## What YOU Must Do (One-Time)

### 1. Increase Page File (Virtual Memory)
- `Win+R` → `SystemPropertiesAdvanced` → Performance Settings → Advanced → Virtual Memory → Change
- Uncheck "Automatically manage" → Custom: Initial=8000, Max=16000 → Set → OK
- **RESTART PC**

### 2. Disable WiFi Power Saving
- `Win+X` → Device Manager → Network adapters → Realtek 8821CE → Properties
- Power Management tab → UNCHECK "Allow computer to turn off this device"
- Advanced tab → Power Saving Mode → Disabled

### 3. Control Panel Power Plan
- `Win+R` → `control powercfg.cpl` → Change plan settings → Change advanced
- Wireless Adapter Settings → Power Saving Mode → Maximum Performance (both battery & plugged in)

---

## When Agent Crashes (Quick Recovery)

**Option 1:** Press `Ctrl+Shift+P` → type `Reload Window` → Enter

**Option 2:** Double-click `fix_agent.bat` in project root, then reload window

---

## Tips to Prevent Crashes

1. **Keep only 1-2 files open** - don't keep many editor tabs open
2. **Close DevTools** - the browser DevTools window uses ~200MB extra
3. **Don't run dev servers** while asking the agent to do heavy work
4. **Break large components** - files over 30KB are problematic; consider splitting them
5. **Close browser** while doing heavy agent work
