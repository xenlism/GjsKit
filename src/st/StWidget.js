import St from 'gi://St';
import { WidgetWrapper } from '../core/Wrapper.js';

export class StWidgetWrapper extends WidgetWrapper {
    style_class(style) {
        this._widget.set_style_class_name(style);
        return this;
    }
}
