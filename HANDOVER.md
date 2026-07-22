# HANDOVER — GNOME 50 Compatibility Review

**Date:** 2026-07-23
**Scope:** Review GjsKit (originally built targeting GNOME 47) and update it to
support GNOME 50, keeping GNOME 47-49 working at the same time.

## TL;DR

GjsKit is a thin fluent wrapper around GTK4, St, Gio, and GLib. It doesn't
touch GNOME Shell internals (`ui/*.js`, `Meta`, `Clutter` directly), so the
large majority of GNOME 48/49/50 breaking changes (documented on
[gjs.guide](https://gjs.guide/extensions/upgrading/)) simply don't apply to
it — those changes are about GNOME Shell's own private UI classes, which
this library never imports.

Two real issues were found and fixed, plus one hardening/consistency pass.
Everything else was reviewed and found to still be correct on GNOME 50.

## What was actually broken

### 1. `WidgetWrapper.destroy()` threw on every GTK4 non-toplevel widget
`src/core/Wrapper.js`

The old code was:
```js
destroy() {
    try {
        if ('unparent' in this._widget) this._widget.unparent();
        this._widget.destroy();          // <-- throws for GTK4 Box/Button/Label/...
    } catch (e) { /* silently ignored */ }
    return this;
}
```

**GTK4 removed `Gtk.Widget.destroy()` for anything that isn't a toplevel**
(see the [GNOME Discourse thread on this](https://discourse.gnome.org/t/how-to-not-destroy-a-widget/7449)).
This was true since GTK4 shipped — it isn't new in GNOME 50 — but it means
`destroy()` never actually worked for `BoxWrapper` / `ButtonWrapper` /
`LabelWrapper`; the `TypeError` was thrown and then swallowed by the
`catch`, so it *looked* like it worked but nothing was ever freed beyond
whatever `unparent()` already did.

**Fix:** `destroy()` now branches on which toolkit it's wrapping:
- St/Clutter actors (detected via `add_style_class_name`) still have a
  working `destroy()` — call it directly.
- GTK4 toplevels (anything with `close()`, i.e. `Gtk.Window` and
  subclasses) are closed, not destroyed.
- Every other GTK4 widget is `unparent()`-ed only, and left to normal
  GObject reference counting to finalize.

It also nulls out `this._widget` after destroying, so accidental reuse of a
destroyed wrapper fails fast (`Cannot read properties of null`) instead of
silently no-oping.

### 2. No support for GNOME 50's new one-shot GLib functions
`src/glib/Utils.js`

GNOME 50 added `GLib.idle_add_once()`, `GLib.timeout_add_once()`, and
`GLib.timeout_add_seconds_once()` — one-shot variants that (a) are
introspectable and (b) don't require the callback to return `true`/`false`
(see the [GNOME 50 porting guide](https://gjs.guide/extensions/upgrading/gnome-shell-50.html#one-shot-timeout-and-idle-functions)).

The existing `$.timeout` / `$.idle` (repeat-capable, driven by the
callback's return value) still work unchanged on GNOME 50 — GLib didn't
remove the classic functions — so nothing was actually broken here. But
since this is exactly the kind of API GjsKit exists to smooth over, two new
helpers were added:

- `$.timeoutOnce(ms, callback)`
- `$.idleOnce(callback)`

Both feature-detect `GLib.timeout_add_once` at call time and use the native
one-shot API on GNOME 50+, falling back to the classic
`GLib.timeout_add`/`GLib.idle_add` (called with an implicit `return false`)
on GNOME 47-49. `$.timeout` / `$.idle` are untouched.

## Housekeeping (not GNOME-50-specific, done while in the file)

- Removed an unused `import GObject from 'gi://GObject';` in
  `src/core/Wrapper.js` — the class never referenced `GObject`.

## What was checked and found to already be fine on GNOME 50

- **GTK version pin** (`gi://Gtk?version=4.0`): GNOME 50 still ships GTK4
  (there is no GTK5). No change needed anywhere in `src/gtk/`.
- **`St` API surface** used by GjsKit (`St.Label`, `St.Button`,
  `St.BoxLayout`, `add_child`, `add_style_class_name`, `set_opacity`,
  `set_reactive`, `grab_key_focus`, margin setters) — none of these were
  touched by the GNOME 47→50 changelogs.
- **`Gio.File` / `GLib` basics** (`new_for_path`, `query_exists`,
  `load_contents`, `timeout_add`, `idle_add`) — unchanged, stable C-level
  API.
- **Extension format** (`extension.js` default-export class,
  `metadata.json` shape, ESM imports) — the GNOME 50 porting guide
  explicitly says *"There were no relevant changes to `extension.js`"* and
  the same for `metadata.json`/`prefs.js`. `examples/extension/metadata.json`
  already lists `"shell-version": ["45", "46", "47", "48", "49", "50"]`, so
  no change was needed there.
- **X11 removal in GNOME 50**: GNOME Shell 50 dropped X11 support (Wayland
  only). GjsKit doesn't reference X11/`Meta`/`Clutter` directly anywhere,
  so this has no code impact — noted in `docs/GNOME-Extension.md` for
  extension authors who build on top of GjsKit and might have their own
  X11-specific branches.

## Files changed

| File | Change |
|---|---|
| `src/core/Wrapper.js` | Fixed `destroy()` for GTK4; removed unused import |
| `src/glib/Utils.js` | Added `timeoutOnce` / `idleOnce` with GNOME 50 feature detection |
| `src/core/Factory.js` | Exposed `timeoutOnce` / `idleOnce` on the `$` factory |
| `tests/run-tests.js` | Added tests for `timeoutOnce` / `idleOnce` |
| `README.md` | Added GNOME compatibility section, updated feature list |
| `docs/API.md` | Documented `timeoutOnce`/`idleOnce` and the new `destroy()` behavior |
| `docs/Architecture.md` | Added sections explaining the destroy() and one-shot-callback design decisions |
| `docs/GNOME-Extension.md` | Noted verified version range and GNOME 50's X11 removal |
| `docs/GettingStarted.md` | Linked to this handover doc |
| `HANDOVER.md` | This document (new) |

`src/index.js` needed no changes — it already re-exports everything from
`glib/Utils.js` via `export * from './glib/Utils.js';`, so the new
`timeoutOnce`/`idleOnce` named exports are picked up automatically.

## Testing notes / what still needs to happen on a real machine

This review was done in a sandboxed container **without a `gjs` binary or
a GNOME Shell/GTK4 runtime available**, so nothing here was executed —
the fixes are based on static review of the code against GNOME's official
porting guides and GObject/GTK documentation, not a live test run.

Before shipping, please verify on an actual GNOME 50 system:

1. `gjs -m tests/run-tests.js` — the two new one-shot tests should print
   `(GLib one-shot API detected: true)` on GNOME 50, and both
   `timeoutOnce`/`idleOnce` assertions should pass.
2. On GNOME 47-49 (or an older GLib without the one-shot functions), the
   same test file should print `(GLib one-shot API detected: false)` and
   still pass, via the fallback path.
3. In a real GTK4 app (`examples/main.js`), create and then
   `.destroy()` a `BoxWrapper`/`ButtonWrapper`/`LabelWrapper` and confirm no
   exception is thrown (this could not be exercised in headless tests,
   since GTK4 widget instantiation needs a running display — the existing
   test suite already notes this limitation).
4. In a real GNOME Shell 50 extension (`examples/extension/`), confirm
   `StBoxLayoutWrapper.destroy()` still works as before (no behavior change
   expected there, but worth a smoke test since it's on the same code
   path).

## Known pre-existing item not in scope

`patch.sh` at the repo root is an empty (0-byte) file. It isn't referenced
by anything in `src/`, `tests/`, `docs/`, or the examples, so it was left
alone — flagging it here in case it was meant to hold something.

---

## Addendum — Widget expansion pass (post-GNOME-50 review)

After the GNOME 50 review above, five GTK4 widgets and four St widgets were
added to close the biggest gaps in widget coverage:

- **GTK4** (`src/gtk/`): `EntryWrapper`, `SwitchWrapper`, `CheckButtonWrapper`,
  `GridWrapper`, `ListBoxWrapper`
- **St** (`src/st/`): `StIconWrapper`, `StBinWrapper`, `StScrollViewWrapper`,
  `StEntryWrapper`

All follow the existing wrapper conventions (extend `WidgetWrapper` /
`StWidgetWrapper`, return `this` from setters). Where a widget's real
GObject property name doesn't match the friendly alias GjsKit's factory
already uses elsewhere (`text` → `label`, `placeholder` →
`placeholder-text`), the wrapper's own constructor destructures the alias
out of `params` before forwarding the rest to the native constructor —
see `EntryWrapper`/`CheckButtonWrapper` for the pattern. This keeps the
alias handling self-contained in the wrapper itself instead of only living
in the `$` factory, so `new EntryWrapper({ placeholder: '...' })` works
the same whether it's called directly or through `$.entry(...)`.

**Bonus fix while in this area:** `$.button(params)` and `$.label(params)`
in `src/core/Factory.js` previously called `new ButtonWrapper()` /
`new LabelWrapper()` with **no arguments at all**, so any property in
`params` other than `text` (e.g. `{ hexpand: true }`) was silently
dropped. This was a pre-existing bug, not something introduced by the
GNOME 50 work — it's now fixed by destructuring the `text` alias out and
forwarding everything else to the constructor.

**Not covered by automated tests.** Like the original GTK4 widgets, none
of the 9 new widgets can be instantiated in the headless test suite —
GTK4 needs a display and St needs a Clutter/Mutter stage, both of which
segfault outside a running session. They were reviewed statically against
the GTK4/St documentation for correct property and method names, but have
not been smoke-tested on a live GNOME session. Please verify before
relying on them:

```javascript
// GTK4 — run inside examples/main.js or similar, with a display
const entry = $.entry({ placeholder: "Your name" });
const sw = $.switch({ active: true });
const cb = $.checkButton({ text: "Agree?" });
const grid = $.grid().attach(entry, 0, 0).attach(sw, 0, 1).attach(cb, 0, 2);

// St — run inside a real GNOME Shell 50 extension
const icon = $.icon({ icon_name: 'face-laugh-symbolic' });
const scroll = $.scrollView().child($.box({ vertical: true }).append(icon));
```

### Files changed in this pass

| File | Change |
|---|---|
| `src/gtk/Entry.js` | New — `EntryWrapper` |
| `src/gtk/Switch.js` | New — `SwitchWrapper` |
| `src/gtk/CheckButton.js` | New — `CheckButtonWrapper` |
| `src/gtk/Grid.js` | New — `GridWrapper` |
| `src/gtk/ListBox.js` | New — `ListBoxWrapper` |
| `src/st/StIcon.js` | New — `StIconWrapper` |
| `src/st/StBin.js` | New — `StBinWrapper` |
| `src/st/StScrollView.js` | New — `StScrollViewWrapper` |
| `src/st/StEntry.js` | New — `StEntryWrapper` |
| `src/index.js` | Re-export the 5 new GTK4 widgets |
| `src/st/index.js` | Re-export the 4 new St widgets |
| `src/core/Factory.js` | Added `$.entry`/`$.switch`/`$.checkButton`/`$.grid`/`$.listBox`; fixed `$.button`/`$.label` params forwarding |
| `src/st/Factory.js` | Added `$.icon`/`$.bin`/`$.scrollView`/`$.entry` |
| `README.md` | Updated status table, features, project structure, roadmap, added usage examples |
| `docs/API.md` | Documented all 9 new widgets |
| `HANDOVER.md` | This addendum |
