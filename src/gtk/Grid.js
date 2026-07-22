import Gtk from 'gi://Gtk?version=4.0';
import { WidgetWrapper } from '../core/Wrapper.js';

export class GridWrapper extends WidgetWrapper {
    constructor(params) {
        super(new Gtk.Grid(params));
    }

    // column/row are 0-based grid cells; width/height are how many
    // columns/rows the widget spans (both default to 1).
    attach(widget, column, row, width = 1, height = 1) {
        this._widget.attach(widget.raw, column, row, width, height);
        return this;
    }
}
