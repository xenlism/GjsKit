import Gtk from 'gi://Gtk?version=4.0';
import { WidgetWrapper } from '../core/Wrapper.js';

export class WindowWrapper extends WidgetWrapper {
    constructor(params) {
        super(new Gtk.Window(params));
    }

    title(title) {
        this._widget.set_title(title);
        return this;
    }

    child(widget) {
        this._widget.set_child(widget.raw);
        return this;
    }

    present() {
        this._widget.present();
        return this;
    }
}
