import Gtk from 'gi://Gtk?version=4.0';
import { WidgetWrapper } from '../core/Wrapper.js';

export class SwitchWrapper extends WidgetWrapper {
    constructor(params) {
        super(new Gtk.Switch(params));
    }

    // Getter/setter in one: call with no argument to read the current
    // on/off state, call with a boolean to set it.
    active(value) {
        if (value === undefined) return this._widget.get_active();
        this._widget.set_active(value);
        return this;
    }
}
