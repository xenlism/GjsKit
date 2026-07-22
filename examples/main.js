import { $ } from '../src/index.js';
import Gtk from 'gi://Gtk?version=4.0';

const app = $.application('org.gjskit.example');

app.on('activate', () => {
    const win = $.window({ title: "GjsKit Framework" });
    app.add_window(win); // จำเป็นสำหรับ GTK4
    
    const box = $.box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10 });
    const lbl = $.label({ text: "Hello from Fluent API!" });
    const btn = $.button({ text: "Click Me" });
    
    btn.on('clicked', () => {
        lbl.text("Button was clicked!");
    });
    
    box.append(lbl).append(btn);
    win.child(box).present(); // ใช้ present() แทน visible(true)
});

app.run(ARGV);
