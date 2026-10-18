# Muzac — Liquid Glass & Claymorphism Hi-Fi Music Player

**Muzac** is a progressive web music player combining the catalogs, discovery, and chart ecosystems of **Spotify**, **YouTube Music**, and **Apple Music** with a **Liquid Glass + Claymorphism Hybrid ("Liquid Clay") UI**, lossless audio badges, real-time time-synced karaoke lyrics, podcasts, music videos, and an in-app download engine with **zero redirects**.

---

## 📱 Mobile App & PWA (Install on Phone)

Muzac is built with full Progressive Web App (PWA) support. You can install and use it directly on your phone with zero command prompts or localhost setups:

### On iPhone (iOS Safari):
1. Open your deployed Vercel link (e.g. `https://muzac.vercel.app`) in **Safari**.
2. Tap the **Share** button (box with upward arrow).
3. Tap **"Add to Home Screen"**.
4. Tap **Add**. An app icon will appear on your home screen and open in standalone borderless app mode.

### On Android (Chrome):
1. Open your Vercel link in **Chrome**.
2. Tap the **three dots menu (⋮)** in the top right.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. Tap **Install**. Muzac will install to your app drawer like a native app.

---

## ☁️ Deploying to Vercel (Cloud Hosting)

The repository is configured for instantaneous Vercel deployment with frontend build and serverless API routing:

1. Push this repository to your GitHub account (`https://github.com/Pranshu125/Muzac.git`).
2. Log into [vercel.com](https://vercel.com).
3. Click **"Add New..."** → **"Project"** → Import **`Muzac`**.
4. Framework Preset will auto-detect as **Vite**.
5. Click **Deploy**. Vercel will build the frontend (`dist/`) and deploy serverless functions (`api/index.js` via `vercel.json`).

---

## 🌟 Key Features

### 1. 💧 Liquid Glass + Claymorphism ("Liquid Clay") UI
- **Obsidian Liquid Glass**: High-translucency frosted glass (`backdrop-filter: blur(28px) saturate(190%)`), refractive specular border highlights (`border-t border-white/22`), and dynamic ambient fluid mesh sampling album art in real time.
- **3D Inflated Clay Geometry**: Soft dual drop shadows, smooth pill curves, and squishy tactile micro-interactions (`active:scale-[0.96]`).
- **Responsive Mobile Layout**: Floating liquid clay mini-player with spinning artwork and a mobile bottom navigation dock.

### 2. 🎤 Real-Time Synced Karaoke Lyrics (Apple Music Sing)
- Millisecond-precise time-synced lyrics powered by **LRCLIB**.
- Auto-scrolling lyrics with glowing active-line illumination and interactive click-to-seek.
- Apple Music Sing vocal reduction controls.

### 3. 📻 YouTube Music & Seamless Video Switcher
- **Instant Audio / Video Toggle**: Switch between **Audio Mode** and **HD Video Mode** without losing playback position (`V` hotkey).
- **Infinite Radio / Smart Autoplay**: Plays related discovery tracks when your queue finishes.

### 4. 🎵 Spotify Metadata & Curated Charts Bridge
- **Zero-Login Spotify Importer**: Paste any Spotify playlist, album, or track URL to stream high-fidelity audio with zero ads.
- Curated top charts: *Today's Top Hits, Top 50 Global, Viral 50, RapCaviar, Chill Hits, Rock Classics*.

### 5. 🎙️ Integrated Podcasts Catalog
- Curated shows (Lex Fridman, Huberman Lab, Joe Rogan, MKBHD, Darknet Diaries) with 15s skip controls and speed settings.

---

## ⌨️ Desktop Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play / Pause |
| `Ctrl + Right` | Next Track |
| `Ctrl + Left` | Previous Track |
| `Right Arrow` / `Left Arrow` | Seek Forward / Backward 5s |
| `Up Arrow` / `Down Arrow` | Volume Up / Down |
| `M` | Mute / Unmute |
| `L` | Toggle Synced Lyrics |
| `V` | Toggle Audio / Music Video Mode |
| `F` | Toggle Fullscreen Mode |

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local backend (port 3001) and Vite frontend (port 5173) concurrently
npm run dev
```

Open your browser at **`http://localhost:5173`**.
