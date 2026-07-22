import { $ } from '../src/index.js';
import GLib from 'gi://GLib';

const GJS_HAS_ONCE_API = typeof GLib.timeout_add_once === 'function';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
    if (condition) {
        print(`✅ PASS: ${message}`);
        testsPassed++;
    } else {
        print(`❌ FAIL: ${message}`);
        testsFailed++;
    }
}

print("Running GjsKit Tests...\n");

// Note: GTK Widget instantiation is not tested here because GTK4 requires 
// a running application/display context, which causes Segmentation Faults in headless tests.

// Test Gio FileWrapper
try {
    const file = $.file('/tmp/nonexistent_file_gjskit_test.txt');
    assert(file.exists() === false, "FileWrapper should report non-existent file correctly");
    assert(file.read() === null, "FileWrapper read should return null for non-existent file");
} catch (e) {
    assert(false, `Gio Test failed with error: ${e.message}`);
}

// Test GLib Utils
try {
    let idleCalled = false;
    $.idle(() => {
        idleCalled = true;
        return false; // Stop repeating
    });
    
    // Wait briefly for idle to execute
    const loop = new GLib.MainLoop(null, false);
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
        loop.quit();
        return false;
    });
    loop.run();
    
    assert(idleCalled === true, "GLib idle utility should execute callback");
} catch (e) {
    assert(false, `GLib Test failed with error: ${e.message}`);
}

// Test GLib one-shot Utils ($.timeoutOnce / $.idleOnce)
// On GNOME 50+ these use the new GLib.timeout_add_once/idle_add_once API;
// on GNOME 47-49 they transparently fall back to the classic functions.
try {
    print(`(GLib one-shot API detected: ${GJS_HAS_ONCE_API})`);

    let onceIdleCalls = 0;
    $.idleOnce(() => {
        onceIdleCalls++;
    });

    let onceTimeoutCalls = 0;
    $.timeoutOnce(20, () => {
        onceTimeoutCalls++;
    });

    const loop = new GLib.MainLoop(null, false);
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 150, () => {
        loop.quit();
        return false;
    });
    loop.run();

    assert(onceIdleCalls === 1, "idleOnce should execute its callback exactly once");
    assert(onceTimeoutCalls === 1, "timeoutOnce should execute its callback exactly once");
} catch (e) {
    assert(false, `GLib one-shot Test failed with error: ${e.message}`);
}

print("\n--- Test Summary ---");
print(`Total: ${testsPassed + testsFailed}, Passed: ${testsPassed}, Failed: ${testsFailed}`);

if (testsFailed > 0) {
    // Throw an error to exit with non-zero status code safely
    throw new Error("Some tests failed.");
}
