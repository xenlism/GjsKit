import { ButtonWrapper } from '../gtk/Button.js';
import { WindowWrapper } from '../gtk/Window.js';
import { BoxWrapper } from '../gtk/Box.js';
import { LabelWrapper } from '../gtk/Label.js';
import { ApplicationWrapper } from '../gtk/Application.js';
import { FileWrapper } from '../gio/File.js';
import { timeout, idle, timeoutOnce, idleOnce } from '../glib/Utils.js';

export const $ = {
    // GTK
    application: (appId) => new ApplicationWrapper(appId),
    window: (params) => new WindowWrapper(params),
    box: (params) => new BoxWrapper(params),
    button: (params) => {
        const btn = new ButtonWrapper();
        if (params?.text) btn.label(params.text); // แก้เป็น label
        return btn;
    },
    label: (params) => {
        const lbl = new LabelWrapper();
        if (params?.text) lbl.text(params.text);
        return lbl;
    },
    
    // Gio / GLib
    file: (path) => new FileWrapper(path),
    timeout,
    idle,
    timeoutOnce,
    idleOnce
};
