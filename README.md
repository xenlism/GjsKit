# GjsKit

[![Language](https://img.shields.io/badge/Language-GJS%20%2F%20JavaScript-yellow)](https://gjs.guide/)
[![Toolkit](https://img.shields.io/badge/Toolkit-GTK%204.0%20%2F%20St-blue)](https://www.gtk.org/)
[![GNOME](https://img.shields.io/badge/GNOME-45--50-4A86CF)](./HANDOVER.md)
[![License](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](LICENSE)

A lightweight, fluent wrapper library for GJS (GNOME JavaScript) that makes building GTK4 desktop apps and GNOME Shell (St) extensions feel like one API instead of two.

> **Status:** Pre-1.0 — stable core, small widget set, actively reviewed for new GNOME releases.

---

## Overview

GjsKit does not invent a new language and does not replace GJS — it wraps native GTK4, St, Gio, and GLib objects in a single, chainable `WidgetWrapper` class so the same fluent code reads naturally whether it targets a desktop window or a Shell panel indicator.

The project is built around four small layers:

- **Core** — `WidgetWrapper` (the shared base class) and the `$` factory
- **GTK4** — Desktop application widgets (`Application`, `Window`, `Box`, `Button`, `Label`, `Entry`, `Switch`, `CheckButton`, `Grid`, `ListBox`)
- **St** — GNOME Shell widgets (`BoxLayout`, `Button`, `Label`, `Icon`, `Bin`, `ScrollView`, `Entry`), behind a separate entry point so `St` is never imported into a headless/desktop process
- **Gio / GLib** — File access and event-loop helpers (`timeout`, `idle`, `timeoutOnce`, `idleOnce`)

Toolkit differences (`append` vs `add_child`, opacity `0.0–1.0` vs `0–255`, `set_sensitive` vs `set_reactive`, margin `start/end` vs `left/right`) are translated automatically inside the wrapper, so application code doesn't need to branch on which toolkit it's running against.

---

## Current Status

| Component | Status |
|---|---|
| Core `WidgetWrapper` (chaining, margin, opacity, style_class, visible, enabled, focus, remove) | ✅ Complete |
| `destroy()` — GTK4/St-correct teardown | ✅ Fixed for GNOME 50 (see [HANDOVER.md](./HANDOVER.md)) |
| GTK4 widgets: Application, Window, Box, Button, Label | ✅ Complete (basic set) |
| GTK4 widgets: Entry, Switch, CheckButton, Grid, ListBox | ✅ Complete |
| St widgets: BoxLayout, Button, Label | ✅ Complete (basic set) |
| St widgets: Icon, Bin, ScrollView, Entry | ✅ Complete |
| `$.button`/`$.label` factory params forwarding (GTK4) | ✅ Fixed — non-alias params (e.g. `hexpand`, `css_classes`) are now forwarded to the native constructor instead of being silently dropped |
| Gio `FileWrapper` (exists/read) | ✅ Complete (read-only) |
| GLib utilities: `timeout`, `idle` | ✅ Complete |
| GLib one-shot utilities: `timeoutOnce`, `idleOnce` (GNOME 50 API, auto-fallback on 47-49) | ✅ Complete |
| GNOME 45–50 compatibility review | ✅ Complete — see [HANDOVER.md](./HANDOVER.md) |
| Headless test suite (`tests/run-tests.js`) | ✅ Passing (5/5, verified on GNOME 50) |
| Further widget set (Adwaita widgets, Stack, St.PopupMenu helpers, etc.) | ⏳ Planned — not started |
| TypeScript type definitions | ⏳ Planned — not started |
| npm / package distribution | ⏳ Planned — not started |
| CI (automated `gjs` test runs) | ⏳ Planned — not started |
| GTK4/St widget instantiation tests (needs a display/stage; can't run headless) | 🚧 Manual smoke-test only, no automated coverage — this includes the 9 widgets added in this pass |

*"Complete" here means implemented and covered by what the test suite / manual review can verify at this project's current size — this is a small utility library, not a full application, so see the Roadmap below for what's intentionally still out of scope.*

---

## Features

- **Unified API:** Write the same code for both GTK4 (Desktop) and St (GNOME Shell). GjsKit automatically translates methods (e.g., `append` → `add_child`) and values (e.g., opacity `0.0–1.0` → `0–255`) under the hood.
- **Fluent API (Method Chaining):** Every setter returns `this`, so UI code reads as a declarative chain.
- **Widget Set:** Buttons, labels, entries, switches, check buttons, grids, list boxes, icons, bins, and scroll views — across both GTK4 and St.
- **Gio / GLib Utilities:** Simplified file operations and event loop management, including GNOME 50's one-shot `timeoutOnce`/`idleOnce` helpers (with automatic fallback on GNOME 47-49).
- **GTK4-correct `destroy()`:** Safely tears down widgets on both toolkits, respecting GTK4's removal of `destroy()` for non-toplevel widgets.
- **Pure ES6:** No TypeScript compilation or bundlers required. Runs directly on GJS.
- **Single Entry Point:** Everything starts with the `$` factory.

---

## Architecture

```text
Application / Extension code
            │
            ▼
        $ Factory
            │
            ▼
     WidgetWrapper (core)
       ╱          ╲
      ▼            ▼
  GTK4 Widgets   St Widgets
      │              │
      ▼              ▼
  Gtk / Gio / GLib   St (GNOME Shell)
```

See [docs/Architecture.md](./docs/Architecture.md) for the full explanation of the wrapper pattern, the GTK4/St unification rules, and how `destroy()` and the GLib one-shot helpers are handled per-toolkit.

---

## Project Structure

```text
GjsKit/
├── examples/       # Usage examples (GTK4 & GNOME Shell)
│   ├── main.js
│   └── extension/
├── docs/           # Documentation
│   ├── API.md
│   ├── Architecture.md
│   ├── GettingStarted.md
│   └── GNOME-Extension.md
├── tests/          # Headless test suite
│   └── run-tests.js
├── src/
│   ├── core/       # Base Wrapper & Main Factory ($)
│   ├── gtk/        # GTK4 Widgets (Application, Window, Box, Button, Label,
│   │               #   Entry, Switch, CheckButton, Grid, ListBox)
│   ├── st/         # GNOME Shell Widgets & St Factory ($)
│   │               #   (BoxLayout, Button, Label, Icon, Bin, ScrollView, Entry)
│   ├── gio/        # FileWrapper
│   └── glib/       # timeout, idle, timeoutOnce, idleOnce utilities
├── HANDOVER.md     # GNOME 50 compatibility review notes
└── README.md
```

---

## Roadmap

### Phase 0 — Foundation
- ✅ Wrapper pattern & fluent chaining design
- ✅ GTK4 / St environment separation (`src/index.js` vs `src/st/index.js`)

### Phase 1 — Core Runtime
- ✅ `WidgetWrapper` base class (margin, opacity, style_class, visible, enabled, focus, remove)
- ✅ GTK4 widgets: Application, Window, Box, Button, Label
- ✅ St widgets: BoxLayout, Button, Label
- ✅ Gio `FileWrapper`, GLib `timeout`/`idle`

**Milestone:** the same fluent code can build a GTK4 window or a Shell panel widget. ✅ *reached*

### Phase 2 — GNOME Compatibility
- ✅ Reviewed against GNOME Shell 45 through 50 porting guides
- ✅ Fixed `destroy()` for GTK4's removal of `Widget.destroy()` on non-toplevels
- ✅ Added GNOME 50's `GLib.timeout_add_once` / `idle_add_once` support (`timeoutOnce`/`idleOnce`)
- ✅ Headless test suite passing on GNOME 50

**Milestone:** verified working on the current GNOME release. ✅ *reached — see [HANDOVER.md](./HANDOVER.md)*

### Phase 3 — Wider Widget Coverage
- ✅ GTK4: Entry, Switch, CheckButton, Grid, ListBox
- ✅ St: Icon, Bin, ScrollView, Entry
- ⏳ Adwaita widgets (`Adw.*`), GTK4 Stack
- ⏳ GTK4/St widget tests that run against a real display/stage (not just headless)

**Milestone:** cover the most commonly requested form/input widgets. ✅ *reached — see [HANDOVER.md](./HANDOVER.md)*

### Phase 4 — Distribution
- ⏳ npm package / versioned releases
- ⏳ TypeScript type definitions for editor support
- ⏳ CI pipeline running `gjs -m tests/run-tests.js` automatically

### Future
- Preferences/settings widget helpers
- Community-contributed widget wrappers

---

## GNOME Compatibility

Verified against GNOME Shell 45 through 50. See [HANDOVER.md](./HANDOVER.md) for the full GNOME 50 compatibility review, what changed, and how to verify it on a real system.

---

## Installation

Since GjsKit is pure ES6, you can simply copy the `src/` folder into your GJS project or clone this repository.

---

## Usage Example (GTK4 Desktop App)

```javascript
import { $ } from './src/index.js';
import Gtk from 'gi://Gtk?version=4.0';

const app = $.application('org.gjskit.example');

app.on('activate', () => {
    const win = $.window({ title: "GjsKit App" });
    app.add_window(win); // Required for GTK4

    const box = $.box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10 });
    const lbl = $.label({ text: "Hello from GjsKit!" });
    const btn = $.button({ text: "Click Me" });

    btn.on('clicked', () => {
        lbl.text("Button was clicked!");
    });

    box.append(lbl).append(btn);
    win.child(box).present();
});

app.run(ARGV);
```

## Usage Example (GNOME Shell Extension)

```javascript
import { $ } from './src/st/index.js'; // Use St factory

// Use the exact same Fluent API!
const box = $.box({ vertical: true });
const lbl = $.label({ text: "Hello Shell!" });
const btn = $.button({ label: "Click Me" });

btn.on('clicked', () => {
    lbl.text("Clicked!");
    btn.opacity(0.5); // Automatically converts to 0-255 for St
});

box.append(lbl).append(btn);
```

## Usage Example (New GTK4 Widgets)

```javascript
import { $ } from './src/index.js';

const grid = $.grid({ row_spacing: 6, column_spacing: 6 });

const name = $.entry({ placeholder: "Your name" });
const enabled = $.switch({ active: true });
const agree = $.checkButton({ text: "I agree to the terms" });

grid.attach(name, 0, 0)
    .attach(enabled, 0, 1)
    .attach(agree, 0, 2);
```

## Usage Example (New St Widgets)

```javascript
import { $ } from './src/st/index.js';

const icon = $.icon({ icon_name: 'face-laugh-symbolic', icon_size: 16 });
const content = $.box({ vertical: true }).append(icon);
const scroll = $.scrollView().child(content);
```

---

## Documentation

Please refer to the [docs/](./docs) directory for detailed API references, and [HANDOVER.md](./HANDOVER.md) for the GNOME 50 porting notes.

- [Getting Started](./docs/GettingStarted.md)
- [API Reference](./docs/API.md)
- [Architecture](./docs/Architecture.md)
- [GNOME Shell Extension Guide](./docs/GNOME-Extension.md)

---

## Testing

Run the headless test suite using GJS:

```bash
gjs -m tests/run-tests.js
```

Expected output on a GNOME 50 system:

```text
Running GjsKit Tests...

✅ PASS: FileWrapper should report non-existent file correctly
✅ PASS: FileWrapper read should return null for non-existent file
✅ PASS: GLib idle utility should execute callback
(GLib one-shot API detected: true)
✅ PASS: idleOnce should execute its callback exactly once
✅ PASS: timeoutOnce should execute its callback exactly once

--- Test Summary ---
Total: 5, Passed: 5, Failed: 0
```

GTK4 widget instantiation isn't covered here because it requires a running display context (segfaults headless) — see [HANDOVER.md](./HANDOVER.md) for manual verification steps.

---

## Technology

- GJS
- GTK4
- St (GNOME Shell Toolkit)
- Gio / GLib
- GObject

---

## Contributing

Contributions, bug reports and feature suggestions are welcome. Start with [docs/Architecture.md](./docs/Architecture.md) to understand the wrapper pattern before adding new widgets, and check the Roadmap above for what's already planned.

---

## License

GNU General Public License v3.0
