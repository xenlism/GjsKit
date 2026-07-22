import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// ดึง St Wrappers มาใช้งาน (จะไม่เดี้ยงเพราะเราแยกไฟล์ไว้แล้ว)
// ใน Extension จริง ให้ระบุ path ไปยังโฟลเดอร์ src ที่คุณคัดลอกไปไว้ในโฟลเดอร์ Extension
import { StBoxLayoutWrapper, StButtonWrapper, StLabelWrapper } from './src/st/index.js';

export default class GjsKitExampleExtension extends Extension {
    enable() {
        // สร้าง Layout และ Widgets ผ่าน GjsKit
        this._box = new StBoxLayoutWrapper({ vertical: true });
        this._label = new StLabelWrapper({ text: "Hello from GjsKit!" });
        this._button = new StButtonWrapper({ label: "Click Me", style_class: 'button' });

        // ใช้ Fluent API ผูก Event
        this._button.on('clicked', () => {
            this._label.text("Extension Button Clicked!");
        });

        // จัดวางลงใน Panel (Top Bar)
        this._box.append(this._label).append(this._button);
        
        // ใส่กล่องเข้าไปตรงกลาง Top Bar
        Main.panel._centerBox.insert_child_at_index(this._box.raw, 0);
    }

    disable() {
        // ทำความสะอาดตอนปิด Extension
        if (this._box) {
            Main.panel._centerBox.remove_child(this._box.raw);
            this._box = null;
            this._label = null;
            this._button = null;
        }
    }
}
