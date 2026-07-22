import St from 'gi://St';
import { StWidgetWrapper } from './StWidget.js';
import { WidgetWrapper } from '../core/Wrapper.js';

export class StBoxLayoutWrapper extends StWidgetWrapper {
    constructor(params) {
        super(new St.BoxLayout(params));
    }

    append(widget) {
        this._widget.add_child(widget.raw);
        return this;
    }
}
