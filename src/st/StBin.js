import St from 'gi://St';
import { StWidgetWrapper } from './StWidget.js';

export class StBinWrapper extends StWidgetWrapper {
    constructor(params) {
        super(new St.Bin(params));
    }

    // St.Bin holds exactly one child.
    child(widget) {
        this._widget.set_child(widget.raw);
        return this;
    }
}
