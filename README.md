# GjsKit

> **GjsKit** is a lightweight Fluent API framework for GJS (GNOME JavaScript) that makes developing GTK4, St (GNOME Shell), Gio, and GLib applications easier. It does not invent a new language and does not replace GJS—it simply wraps it in a clean, chainable API.

**Developed with Z.ai GLM 5.2**

## Features
- **Unified API:** Write the same code for both GTK4 (Desktop) and St (GNOME Shell). GjsKit automatically translates methods (e.g., `append` -> `add_child`) and values (e.g., opacity `0.1-1.0` -> `0-255`) under the hood.
- **Fluent API (Method Chaining):** Write cleaner and more readable UI code.
- **Gio / GLib Utilities:** Simplified file operations and event loop management.
- **Pure ES6:** No TypeScript compilation or bundlers required. Runs directly on GJS.
- **Single Entry Point:** Everything starts with the `$` factory.

## Project Structure
```text
GjsKit/
├── examples/       # Usage examples (GTK4 & GNOME Shell)
├── docs/           # Documentation
├── tests/          # Test suites
├── src/
│   ├── core/       # Base Wrapper & Main Factory ($)
│   ├── gtk/        # GTK4 Widgets (Application, Window, Box, Button, Label)
│   ├── st/         # GNOME Shell Widgets & St Factory ($)
│   ├── gio/        # FileWrapper
│   └── glib/       # timeout, idle utilities
└── README.md
```

## Installation
Since GjsKit is pure ES6, you can simply copy the `src/` folder into your GJS project or clone this repository.

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

## Documentation
Please refer to the [docs/](./docs) directory for detailed API references.

## Testing
Run the test suite using GJS:
```bash
gjs -m tests/run-tests.js
```

## License
GPL-3.0
