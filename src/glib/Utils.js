import GLib from 'gi://GLib';

export const timeout = (ms, callback) => {
    return GLib.timeout_add(GLib.PRIORITY_DEFAULT, ms, () => {
        return callback() ?? false;
    });
};

export const idle = (callback) => {
    return GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
        return callback() ?? false;
    });
};
