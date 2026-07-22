# Developing GNOME Shell Extensions with GjsKit

GjsKit fully supports developing GNOME Shell Extensions (GNOME 45 through 50, verified) using `St` (Shell Toolkit).

> **GNOME 50 note:** GNOME Shell 50 dropped X11 support entirely (Wayland only). GjsKit's `St` wrappers don't touch `X11`, `Meta`, or `Clutter` directly, so nothing in this library is affected — but if your own extension code still branches on X11-specific behavior, that code path will simply never run on GNOME 50.

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
