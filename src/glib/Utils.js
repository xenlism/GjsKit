import GLib from 'gi://GLib';

// GNOME 50 added "one-shot" variants of GLib's idle/timeout functions
// (GLib.idle_add_once, GLib.timeout_add_once, GLib.timeout_add_seconds_once).
// They exist purely so introspection tools can tell a callback is only
// ever invoked once, and unlike the classic functions the callback does
// not need to return true/false. They aren't present before GNOME 50, so
// everything here feature-detects and falls back to the classic API on
// GNOME 47-49.
const HAS_ONCE_API = typeof GLib.timeout_add_once === 'function'
    && typeof GLib.idle_add_once === 'function';

// Repeating timeout: return `true` from `callback` to keep firing,
// anything else (including undefined) stops it. Works identically on
// GNOME 47 through 50.
export const timeout = (ms, callback) => {
    return GLib.timeout_add(GLib.PRIORITY_DEFAULT, ms, () => {
        return callback() ?? false;
    });
};

// Repeating idle callback, same semantics as `timeout` above.
export const idle = (callback) => {
    return GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
        return callback() ?? false;
    });
};

// Fire-once timeout. Prefer this over `timeout()` when the callback is
// never meant to repeat - on GNOME 50+ it uses GLib.timeout_add_once()
// directly, and transparently falls back to the classic API on older
// shells (47-49).
export const timeoutOnce = (ms, callback) => {
    if (HAS_ONCE_API) {
        return GLib.timeout_add_once(GLib.PRIORITY_DEFAULT, ms, () => {
            callback();
        });
    }
    return GLib.timeout_add(GLib.PRIORITY_DEFAULT, ms, () => {
        callback();
        return false;
    });
};

// Fire-once idle callback. Same GNOME 50 detection as `timeoutOnce`.
export const idleOnce = (callback) => {
    if (HAS_ONCE_API) {
        return GLib.idle_add_once(GLib.PRIORITY_DEFAULT_IDLE, () => {
            callback();
        });
    }
    return GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
        callback();
        return false;
    });
};
