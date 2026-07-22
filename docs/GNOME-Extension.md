# Developing GNOME Shell Extensions with GjsKit

GjsKit fully supports developing GNOME Shell Extensions (GNOME 45+) using `St` (Shell Toolkit).

Because `St` cannot be imported in a standalone GJS environment (like running a GTK4 app from the terminal), we separated the `St` wrappers into `src/st/`. This prevents Segmentation Faults when building desktop apps.

## How to use in an Extension

In your `extension.js` file, import the St wrappers directly from the `src/st/` folder:

```javascript
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// Import St Wrappers directly
import { StBoxLayoutWrapper, StButtonWrapper, StLabelWrapper } from './src/st/index.js';

export default class MyExtension extends Extension {
    enable() {
        this._box = new StBoxLayoutWrapper({ vertical: true });
        this._label = new StLabelWrapper({ text: "Hello Shell!" });
        this._button = new StButtonWrapper({ label: "Click Me" });

        // Using Fluent API
        this._button.on('clicked', () => {
            this._label.text("Clicked!");
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

## St Widget Methods
- `StWidgetWrapper.style_class(name)`: Sets the CSS style class name.
- `StButtonWrapper.label(text)`: Sets the button label.
- `StLabelWrapper.text(text)`: Sets the label text.
- `StBoxLayoutWrapper.append(widget)`: Adds a child widget to the box layout.
