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
