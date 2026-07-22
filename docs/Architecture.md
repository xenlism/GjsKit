# GjsKit Architecture

GjsKit is designed to "wrap" native GJS (GObject Introspection) objects without replacing them or inventing a new language. 

## Core Concepts

### 1. The Wrapper Pattern
At the heart of GjsKit is the `WidgetWrapper` class (located in `src/core/Wrapper.js`). 
Every GTK or St widget is wrapped in this class. It stores the native GObject in a protected `_widget` property and exposes it via the `raw` getter. This allows developers to drop down to native GJS code whenever they need an unsupported feature, without breaking out of the framework.

### 2. Fluent API (Method Chaining)
All setter methods in GjsKit wrappers return `this`. This allows developers to write clean, declarative UI code:
```javascript
win.title("My App").child(box).present();
```

### 3. Environment Separation (GTK vs St)
GNOME Desktop (GTK4) and GNOME Shell (St) run in completely different environments. 
- `src/gtk/` and `src/index.js` are strictly for GTK4 desktop apps.
- `src/st/` is strictly for GNOME Shell Extensions.
By keeping `St` imports out of `src/index.js`, we prevent GJS from crashing (Segmentation Fault) when running headless tests or desktop apps.

### 4. Pure ES6 Modules
GjsKit uses standard ES6 `import`/`export` syntax. It requires no bundler (like Webpack or Rollup) and no TypeScript compiler. It runs natively on the GJS SpiderMonkey engine. Explicit `.js` extensions are used in imports to ensure strict ESM compliance.
