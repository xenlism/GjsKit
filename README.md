# GjsKit

> **GjsKit** is a lightweight Fluent API framework for GJS (GNOME JavaScript) that makes developing GTK4, St (GNOME Shell), Gio, and GLib applications easier. It does not invent a new language and does not replace GJS—it simply wraps it in a clean, chainable API.

**Developed with Z.ai GLM 5.2**

## Features
- **Fluent API (Method Chaining):** Write cleaner and more readable UI code.
- **GTK4 & St Support:** Native support for both desktop apps (GTK4) and GNOME Shell extensions (St).
- **Gio / GLib Utilities:** Simplified file operations and event loop management.
- **Pure ES6:** No TypeScript compilation or bundlers required. Runs directly on GJS.
- **Single Entry Point:** Everything starts with the `$` factory.

## Project Structure
```text
GjsKit/
├── examples/       # Usage examples
├── docs/           # Documentation
├── tests/          # Test suites
├── src/
│   ├── core/       # Base Wrapper & Factory ($)
│   ├── gtk/        # GTK4 Widgets (Application, Window, Box, Button, Label)
│   ├── st/         # GNOME Shell Widgets (StWidget, StButton, StLabel, StBoxLayout)
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
    const box = $.box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10 });
    
    const lbl = $.label({ text: "Hello from GjsKit!" });
    const btn = $.button({ text: "Click Me" });
    
    btn.on('clicked', () => {
        lbl.text("Button was clicked!");
    });
    
    box.append(lbl).append(btn);
    win.child(box).visible(true);
});

app.run(ARGV);
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
