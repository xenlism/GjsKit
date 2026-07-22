import Gtk from 'gi://Gtk?version=4.0';
import { WidgetWrapper } from '../core/Wrapper.js';

export class CheckButtonWrapper extends WidgetWrapper {
    constructor(params = {}) {
        // `text` mirrors the same friendly alias ButtonWrapper accepts,
        // even though GtkCheckButton's real property is `label`.
        const { text, ...gtkParams } = params ?? {};
        super(new Gtk.CheckButton(gtkParams));

        if (text !== undefined) this.label(text);
    }

    label(text) {
        this._widget.set_label(text);
        return this;
    }

    // Getter/setter in one: call with no argument to read whether it's
    // checked, call with a boolean to set it.
    active(value) {
        if (value === undefined) return this._widget.get_active();
        this._widget.set_active(value);
        return this;
    }
}
