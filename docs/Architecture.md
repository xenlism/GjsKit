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

### 5. Destruction (GTK4 vs. St)
GTK4 and St disagree about what "destroying" a widget means, and GjsKit's `destroy()` has to branch on which one it's holding:
- **St / Clutter actors** still expose a working `destroy()` method (unchanged through GNOME 47-50), so `WidgetWrapper.destroy()` calls it directly.
- **GTK4 widgets** removed `Gtk.Widget.destroy()` for anything other than a toplevel. A `Gtk.Window` (or subclass) is closed via `close()`; every other GTK4 widget is simply `unparent()`-ed and left to normal GObject reference counting to finalize once nothing else holds a reference to it.

This distinction matters because calling the old, version-blind `destroy()` (unparent, then always call `.destroy()`) throws on any non-toplevel GTK4 widget — the error was previously being swallowed silently by a catch block, so it looked like it worked but never actually freed anything.

### 6. GNOME 50 GLib one-shot callbacks
GNOME 50 added `GLib.idle_add_once()`, `GLib.timeout_add_once()`, and `GLib.timeout_add_seconds_once()` — one-shot variants that don't require the callback to return `true`/`false`. `src/glib/Utils.js` feature-detects these (`typeof GLib.timeout_add_once === 'function'`) and exposes `$.timeoutOnce` / `$.idleOnce`, which use the native one-shot API on GNOME 50+ and transparently fall back to the classic repeating API (called with an implicit `return false`) on GNOME 47-49. The original repeating `$.timeout` / `$.idle` helpers are untouched and continue to work unchanged on every supported version.
