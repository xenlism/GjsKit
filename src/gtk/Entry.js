import Gtk from 'gi://Gtk?version=4.0';
import { WidgetWrapper } from '../core/Wrapper.js';

export class EntryWrapper extends WidgetWrapper {
    constructor(params = {}) {
        // `placeholder` is a friendly alias, not a real GtkEntry property
        // (the real one is `placeholder-text`), so it has to be pulled out
        // before we hand the rest of `params` to the native constructor.
        const { placeholder, ...gtkParams } = params ?? {};
        super(new Gtk.Entry(gtkParams));

        if (placeholder !== undefined) this.placeholder(placeholder);
    }

    // Getter/setter in one: call with no argument to read the current
    // text, call with a string to set it (and keep the fluent chain).
    text(value) {
        if (value === undefined) return this._widget.get_text();
        this._widget.set_text(value);
        return this;
    }

    placeholder(text) {
        this._widget.set_placeholder_text(text);
        return this;
    }
}
