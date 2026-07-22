# GjsKit API Documentation

## Factory: `$`
The global factory function to create GTK, Gio, and GLib wrappers. Import it from `src/index.js`.

### GTK4 Widgets
- `$.application(appId: string)`: Creates a `Gtk.Application`.
- `$.window(params?)`: Creates a `Gtk.Window`.
- `$.box(params?)`: Creates a `Gtk.Box`.
- `$.button(params?)`: Creates a `Gtk.Button`. (Accepts `{ text: string }`)
- `$.label(params?)`: Creates a `Gtk.Label`. (Accepts `{ text: string }`)

### Gio / GLib Utilities
- `$.file(path: string)`: Creates a `FileWrapper` for `Gio.File`.
- `$.timeout(ms: number, callback)`: Runs a function after a delay.
- `$.idle(callback)`: Runs a function when the event loop is idle.

---

## Base Wrapper: `WidgetWrapper`
All widgets extend this base class, providing common methods:

- `raw`: Property to access the underlying GJS GObject directly.
- `on(signal, callback)`: Connects to a GObject signal. Returns `this` for chaining.
- `visible(isVisible)`: Sets widget visibility. Returns `this`.
- `enabled(isEnabled)`: Sets widget sensitivity (enabled/disabled). Returns `this`.

## Widget Methods

### ApplicationWrapper
- `run(argv?)`: Runs the application.
- `quit()`: Quits the application.
- `add_window(window)`: Binds a window to the application (Required for GTK4).

### WindowWrapper
- `title(title)`: Sets the window title.
- `child(widget)`: Sets the child widget of the window.
- `present()`: Presents the window to the user (GTK4 replacement for `show_all`).

### BoxWrapper
- `append(widget)`: Appends a widget to the box.

### ButtonWrapper / LabelWrapper
- `text(text)`: Sets the text/label of the widget.

### FileWrapper
- `exists()`: Returns `boolean` indicating if the file exists.
- `read()`: Returns file contents as a `string` or `null` if it doesn't exist.
