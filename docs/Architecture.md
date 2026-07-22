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
