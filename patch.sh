#!/usr/bin/env bash

# ==================================================
# FILE: ./README.md
# ==================================================
cat << 'EOF' > README.md
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
EOF

# ==================================================
# FILE: ./docs/API.md
# ==================================================
cat << 'EOF' > docs/API.md
# GjsKit API Documentation

## Factory: `$`
The global factory function to create widgets. 
- Use `import { $ } from './src/index.js'` for GTK4.
- Use `import { $ } from './src/st/index.js'` for GNOME Shell (St).

### Widgets
- `$.application(appId: string)`: Creates a `Gtk.Application` (GTK4 only).
- `$.window(params?)`: Creates a `Gtk.Window` (GTK4 only).
- `$.box(params?)`: Creates a Box container.
- `$.button(params?)`: Creates a Button. (Accepts `{ text: string }` or `{ label: string }`)
- `$.label(params?)`: Creates a Label. (Accepts `{ text: string }`)

### Gio / GLib Utilities (GTK4 only)
- `$.file(path: string)`: Creates a `FileWrapper` for `Gio.File`.
- `$.timeout(ms: number, callback)`: Runs a function after a delay.
- `$.idle(callback)`: Runs a function when the event loop is idle.

---

## Base Wrapper: `WidgetWrapper`
All widgets extend this base class. GjsKit unifies the differences between GTK4 and St here.

### Common Methods
- `raw`: Property to access the underlying native GJS GObject directly.
- `on(signal, callback)`: Connects to a signal. Returns `this`.
- `visible(isVisible)`: Sets widget visibility. Returns `this`.
- `enabled(isEnabled)`: Sets sensitivity (GTK) or reactive state (St). Returns `this`.
- `style_class(className)`: Adds a CSS class (GTK) or style class (St). Returns `this`.
- `remove(widget)`: Removes a child from a container. Returns `this`.
- `focus()`: Grabs focus (GTK) or key focus (St). Returns `this`.
- `destroy()`: Safely destroys the widget. Returns `this`.

### Styling Methods
- `margin(top, right, bottom, left)`: Sets margins. Handles `start/end` (GTK) and `left/right` (St) automatically. Returns `this`.
- `marginAll(px)`: Sets all margins to the same value. Returns `this`.
- `opacity(value)`: Sets opacity from `0.0` to `1.0`. Converts to `0-255` for St automatically. Returns `this`.

## Widget Specific Methods

### ApplicationWrapper
- `run(argv?)`: Runs the application.
- `quit()`: Quits the application.
- `add_window(window)`: Binds a window to the application.

### WindowWrapper
- `title(title)`: Sets the window title.
- `child(widget)`: Sets the child widget.
- `present()`: Presents the window to the user.

### BoxWrapper
- `append(widget)`: Appends a widget. (Translates to `add_child` in St).

### ButtonWrapper
- `label(text)`: Sets the button text.

### LabelWrapper
- `text(text)`: Sets the label text.

### FileWrapper
- `exists()`: Returns `boolean`.
- `read()`: Returns file contents as a `string` or `null`.
EOF

# ==================================================
# FILE: ./docs/GettingStarted.md
# ==================================================
cat << 'EOF' > docs/GettingStarted.md
# Getting Started with GjsKit

GjsKit requires a modern version of GJS (GNOME 41+ recommended for full ES6 module support).

## 1. Running your first GTK4 app

Create a file named `main.js`:

```javascript
import { $ } from './src/index.js';
import Gtk from 'gi://Gtk?version=4.0';

const app = $.application('org.gjskit.HelloWorld');

app.on('activate', () => {
    const win = $.window({ title: "Hello World" });
    const btn = $.button({ text: "Click me!" });
    
    btn.on('clicked', () => {
        print("Button clicked!");
        app.quit();
    });
    
    app.add_window(win);
    win.child(btn).present();
});

app.run(ARGV);
```

## 2. Execute with GJS

Run the application from your terminal:

```bash
gjs -m main.js
```
EOF

# ==================================================
# FILE: ./docs/GNOME-Extension.md
# ==================================================
cat << 'EOF' > docs/GNOME-Extension.md
# Developing GNOME Shell Extensions with GjsKit

GjsKit fully supports developing GNOME Shell Extensions (GNOME 45+) using `St` (Shell Toolkit).

Because `St` cannot be imported in a standalone GJS environment, we separated the `St` wrappers and its own `$` factory into `src/st/`.

## How to use in an Extension

In your `extension.js` file, import the `$` factory directly from `src/st/index.js`:

```javascript
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// Import $ for St
import { $ } from './src/st/index.js';

export default class MyExtension extends Extension {
    enable() {
        this._box = $.box({ vertical: true });
        this._label = $.label({ text: "Hello Shell!" });
        this._button = $.button({ label: "Click Me" });

        this._button.on('clicked', () => {
            this._label.text("Clicked!");
            this._button.opacity(0.5); // Automatically handled
        });

        this._box.append(this._label).append(this._button);
        Main.panel._centerBox.insert_child_at_index(this._box.raw, 0);
    }

    disable() {
        if (this._box) {
            Main.panel._centerBox.remove_child(this._box.raw);
            this._box = null;
            this._label = null;
            this._button = null;
        }
    }
}
```
EOF

# ==================================================
# FILE: ./docs/Architecture.md
# ==================================================
cat << 'EOF' > docs/Architecture.md
# GjsKit Architecture

GjsKit is designed to "wrap" native GJS (GObject Introspection) objects without replacing them. 

## Core Concepts

### 1. The Wrapper Pattern
At the heart of GjsKit is the `WidgetWrapper` class (located in `src/core/Wrapper.js`). 
Every GTK or St widget is wrapped in this class. It stores the native GObject in a protected `_widget` property and exposes it via the `raw` getter. This allows developers to drop down to native GJS code whenever they need an unsupported feature.

### 2. Unified API (Transparency)
GNOME Desktop (GTK4) and GNOME Shell (St) have different APIs for similar concepts. GjsKit hides these differences:
- **Containers:** `append()` works for both `Gtk.Box` and `St.BoxLayout` (translates to `add_child`).
- **States:** `enabled()` works for both (translates to `set_sensitive` in GTK, `set_reactive` in St).
- **Styling:** `style_class()` works for both (translates to `add_css_class` in GTK, `add_style_class_name` in St).
- **Values:** `opacity()` accepts `0.0-1.0` and automatically converts it to `0-255` for St.
- **Layout:** `margin()` handles the Left/Right vs Start/End translation automatically.

### 3. Fluent API (Method Chaining)
All setter methods in GjsKit wrappers return `this`. This allows developers to write clean, declarative UI code:
```javascript
box.margin(10, 10, 10, 10).append(lbl).style_class("my-box");
```

### 4. Environment Separation
By keeping `St` imports out of `src/index.js` and providing a separate factory in `src/st/index.js`, we prevent GJS from crashing (Segmentation Fault) when running headless tests or desktop apps.
EOF

echo "README.md and docs/ have been updated successfully!"
