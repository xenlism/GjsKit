import GObject from 'gi://GObject';

export class WidgetWrapper {
    constructor(widget) {
        this._widget = widget;
    }

    get raw() {
        return this._widget;
    }

    on(signal, callback) {
        this._widget.connect(signal, callback);
        return this;
    }

    visible(isVisible) {
        if ('set_visible' in this._widget) {
            this._widget.set_visible(isVisible);
        }
        return this;
    }

    enabled(isEnabled) {
        if ('set_sensitive' in this._widget) {
            this._widget.set_sensitive(isEnabled);
        }
        return this;
    }
}
