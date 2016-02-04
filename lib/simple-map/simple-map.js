export default class SimpleMap {
    constructor() {
        this.__values = {};
    }

    set(name, value) {
        this.__values[name] = value;
    }

    delete(name) {
        delete this.__values[name];
    }

    clear() {
        this.__values = {};
    }

    has(name) {
        return this.__values.hasOwnProperty(name);
    }

    get(name) {
        if (this.has(name)) {
            return this.__values[name];
        }

        throw new Error(`SimpleMap: ${name} not found`);
    }
}
