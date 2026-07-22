import St from 'gi://St';
import { StWidgetWrapper } from './StWidget.js';

export class StScrollViewWrapper extends StWidgetWrapper {
    constructor(params) {
        super(new St.ScrollView(params));
    }

    // St.ScrollView is a single-child container (it's a St.Bin subclass),
    // typically wrapping a StBoxLayoutWrapper full of content.
    child(widget) {
        this._widget.set_child(widget.raw);
        return this;
    }
}
