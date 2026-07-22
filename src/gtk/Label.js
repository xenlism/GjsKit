import Gtk from 'gi://Gtk?version=4.0';
import { WidgetWrapper } from '../core/Wrapper.js';

export class LabelWrapper extends WidgetWrapper {
    constructor(params) {
        super(new Gtk.Label(params));
    }

    text(label) {
        this._widget.set_label(label);
        return this;
    }
}
