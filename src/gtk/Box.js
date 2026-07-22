import Gtk from 'gi://Gtk?version=4.0';
import { WidgetWrapper } from '../core/Wrapper.js';

export class BoxWrapper extends WidgetWrapper {
    constructor(params) {
        super(new Gtk.Box(params));
    }

    append(widget) {
        this._widget.append(widget.raw);
        return this;
    }
}
