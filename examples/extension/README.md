# GjsKit GNOME Shell Extension Example

นี่คือตัวอย่างการใช้ GjsKit ในการสร้าง GNOME Shell Extension (รองรับ GNOME 45+)

## วิธีติดตั้งทดสอบบนเครื่อง

1. คัดลอกโฟลเดอร์ `src` ไปไว้ในโฟลเดอร์ Extension ของคุณ:
   ```bash
   mkdir -p ~/.local/share/gnome-shell/extensions/gjskit-example@yourname.com
   cp -r ../../src ~/.local/share/gnome-shell/extensions/gjskit-example@yourname.com/
   cp metadata.json extension.js ~/.local/share/gnome-shell/extensions/gjskit-example@yourname.com/
   ```

2. รีสตาร์ท GNOME Shell:
   - **X11**: กด `Alt + F2` พิมพ์ `r` แล้วกด Enter
   - **Wayland**: ออกจากระบบ (Log out) แล้วเข้าใหม่

3. เปิดแอป **Extensions** แล้วเปิดใช้งาน `GjsKit Example Extension`

คุณจะเห็นข้อความและปุ่มโผล่ขึ้นมาตรงกลาง Top Bar ของหน้าจอครับ
