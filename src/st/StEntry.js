import St from 'gi://St';
import { StWidgetWrapper } from './StWidget.js';

export class StEntryWrapper extends StWidgetWrapper {
    constructor(params) {
        super(new St.Entry(params));
    }

    // Getter/setter in one: call with no argument to read the current
    // text, call with a string to set it (and keep the fluent chain).
    text(value) {
        if (value === undefined) return this._widget.get_text();
        this._widget.set_text(value);
        return this;
    }
}
