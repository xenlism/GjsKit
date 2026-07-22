# Getting Started with GjsKit

GjsKit requires a modern version of GJS (GNOME 41+ recommended for full ES6 module support). The GTK4 and St wrappers have been reviewed against GNOME 45 through GNOME 50; see [HANDOVER.md](../HANDOVER.md) for the details of that review.

## 1. Running your first GTK4 app

Create a file named `main.js`:

```javascript
import { $ } from './src/index.js';
import Gtk from 'gi://Gtk?version=4.0';

const app = $.application('org.gjskit.HelloWorld');

app.on('activate', () => {
    const win = $.window({ title: "Hello World" });
    const btn = $.button({ text: "Click me!" });
    
    btn.on('clicked', () => {
        print("Button clicked!");
        app.quit();
    });
    
    app.add_window(win);
    win.child(btn).present();
});

app.run(ARGV);
```

## 2. Execute with GJS

Run the application from your terminal:

```bash
gjs -m main.js
```
