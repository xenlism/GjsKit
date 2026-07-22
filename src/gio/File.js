import Gio from 'gi://Gio';

export class FileWrapper {
    constructor(path) {
        this._file = Gio.File.new_for_path(path);
    }

    get raw() {
        return this._file;
    }

    exists() {
        return this._file.query_exists(null);
    }

    read() {
        if (!this.exists()) return null;
        const [, contents] = this._file.load_contents(null);
        return new TextDecoder().decode(contents);
    }
}
