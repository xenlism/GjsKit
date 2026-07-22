import Gtk from 'gi://Gtk?version=4.0';
import { WidgetWrapper } from '../core/Wrapper.js';

export class ListBoxWrapper extends WidgetWrapper {
    constructor(params) {
        super(new Gtk.ListBox(params));
    }

    append(widget) {
        this._widget.append(widget.raw);
        return this;
    }

    // `remove(widget)` doesn't need to be redefined here — GtkListBox has
    // a native `remove()` method, so WidgetWrapper's base `remove()`
    // (see core/Wrapper.js) already covers it.
}
