# Geek — Retro PC Simulator

A nostalgic PC simulator built with Electron that recreates the look and feel of classic Windows operating systems — from Windows 95 to Windows 11.

> **Notice:** This project is not affiliated with Microsoft in any way and should not be confused with any Microsoft product or service.

---

## About

Geek simulates a full desktop environment for 8 generations of Windows:

- Windows 95 / 98
- Windows XP
- Windows Vista
- Windows 7
- Windows 8
- Windows 10
- Windows 11

Each theme includes accurate taskbar styling, boot/shutdown screens, lock screens, and window decorations. The app ships with a small set of built-in programs and a persistent save system.

---

## Features

- **Multi-OS themes** — full UI re-skin per OS version, including taskbar, menus, icons, and animations
- **Desktop environment** — draggable, resizable, and z-ordered windows
- **Built-in programs** — GreenBank (wallet), Settings, Store, Help, and more
- **Boot sequence** — PC loading → OS loading → lock screen → desktop
- **Persistent state** — user data saved locally between sessions
- **Program system** — modular, manifest-driven app architecture for easy extensibility

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop runtime | Electron 28 |
| UI | HTML + SCSS + Mustache templates |
| Bundler | Webpack 5 via Electron Forge |
| State | Custom singleton Storage class |
| Threading | Web Workers (clock, etc.) |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start in development mode
npm start
```

**Build a distributable:**

```bash
npm run make
```

Output is placed in the `out/` directory. Supported targets: Windows (Squirrel installer), macOS (ZIP), Linux (DEB / RPM).

---

## Project Structure

```
src/
├── assets/
│   ├── images/themes/      # Per-OS backgrounds, icons, boot screens
│   ├── programs/           # Built-in app bundles (manifest + JS + assets)
│   ├── scripts/            # Application logic
│   │   ├── blocks/         # UI blocks: desktop, taskbar, main menu
│   │   ├── modules/        # Shared utilities
│   │   ├── programs/       # Window and program manager
│   │   ├── storage/        # Persistent state
│   │   ├── templates/      # Template loader
│   │   └── workers/        # Web workers
│   ├── styles/             # SCSS source
│   │   └── themes/         # Per-OS stylesheets
│   └── templates/          # Mustache HTML templates
│       └── themes/         # Per-OS template variants
└── index.html              # App shell
```

---

## _Work in progress_

This project is actively developed. Contributions and feedback are welcome — open an issue or a pull request.

---

## License

MIT
