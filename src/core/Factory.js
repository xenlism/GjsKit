import { ButtonWrapper } from '../gtk/Button.js';
import { WindowWrapper } from '../gtk/Window.js';
import { BoxWrapper } from '../gtk/Box.js';
import { LabelWrapper } from '../gtk/Label.js';
import { ApplicationWrapper } from '../gtk/Application.js';
import { EntryWrapper } from '../gtk/Entry.js';
import { SwitchWrapper } from '../gtk/Switch.js';
import { CheckButtonWrapper } from '../gtk/CheckButton.js';
import { GridWrapper } from '../gtk/Grid.js';
import { ListBoxWrapper } from '../gtk/ListBox.js';
import { FileWrapper } from '../gio/File.js';
import { timeout, idle, timeoutOnce, idleOnce } from '../glib/Utils.js';

export const $ = {
    // GTK
    application: (appId) => new ApplicationWrapper(appId),
    window: (params) => new WindowWrapper(params),
    box: (params) => new BoxWrapper(params),
    button: (params) => {
        // Gtk.Button has no "text" property (it's "label"), so `text` is
        // pulled out as a friendly alias and the rest of `params` (e.g.
        // `hexpand`, `css_classes`, ...) is still forwarded to the
        // native constructor.
        const { text, ...gtkParams } = params ?? {};
        const btn = new ButtonWrapper(gtkParams);
        if (text !== undefined) btn.label(text); // แก้เป็น label
        return btn;
    },
    label: (params) => {
        // Same idea as `button` above: Gtk.Label's real property is
        // "label", so `text` is handled as an alias rather than passed
        // straight through.
        const { text, ...gtkParams } = params ?? {};
        const lbl = new LabelWrapper(gtkParams);
        if (text !== undefined) lbl.text(text);
        return lbl;
    },
    entry: (params) => new EntryWrapper(params),
    switch: (params) => new SwitchWrapper(params),
    checkButton: (params) => new CheckButtonWrapper(params),
    grid: (params) => new GridWrapper(params),
    listBox: (params) => new ListBoxWrapper(params),

    // Gio / GLib
    file: (path) => new FileWrapper(path),
    timeout,
    idle,
    timeoutOnce,
    idleOnce
};
