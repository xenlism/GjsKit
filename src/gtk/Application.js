import Gtk from 'gi://Gtk?version=4.0';
import { WidgetWrapper } from '../core/Wrapper.js';

export class ApplicationWrapper extends WidgetWrapper {
    constructor(appId) {
        super(new Gtk.Application({ application_id: appId }));
    }

    run(argv = []) {
        return this._widget.run(argv);
    }

    quit() {
        this._widget.quit();
        return this;
    }

    add_window(window) {
        this._widget.add_window(window.raw);
        return this;
    }
}
