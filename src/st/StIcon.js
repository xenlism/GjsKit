import St from 'gi://St';
import { StWidgetWrapper } from './StWidget.js';

export class StIconWrapper extends StWidgetWrapper {
    constructor(params) {
        super(new St.Icon(params));
    }

    // Getter/setter in one: call with no argument to read the current
    // icon name, call with a string (e.g. 'face-laugh-symbolic') to set it.
    icon_name(name) {
        if (name === undefined) return this._widget.get_icon_name();
        this._widget.set_icon_name(name);
        return this;
    }

    // Getter/setter in one: call with no argument to read the current
    // icon size in pixels, call with a number to set it.
    icon_size(px) {
        if (px === undefined) return this._widget.get_icon_size();
        this._widget.set_icon_size(px);
        return this;
    }
}
