import { ServiceLocator } from './sl';

const { test } = QUnit;
let sl;

QUnit.module('service locator', {
    beforeEach() {
        sl = new ServiceLocator();
    }
});

test('should return instance of registered value', assert => {
    const myValue = {};
    const notMyValue = {};
    sl.value('myValue', myValue);

    const actual = sl.get('myValue');
    assert.strictEqual(actual, myValue);
    assert.notStrictEqual(actual, notMyValue);
});

test('should return instance of registered singleton', assert => {
    function Foo() {
        this.foo = 'bar';
    }
    sl.singleton('myValue', function () {
        return new Foo();
    });

    const actual = sl.get('myValue');
    assert.strictEqual(actual.foo, 'bar');
    assert.strictEqual(sl.get('myValue'), actual);
});

test('should return different instance of registered transient', assert => {
    function Foo() {
        this.foo = 'bar';
    }
    sl.transient('myValue', function () {
        return new Foo();
    });

    const actual = sl.get('myValue');
    assert.strictEqual(actual.foo, 'bar');
    assert.notStrictEqual(sl.get('myValue'), actual);
});

test('should capture errors when get service throws', assert => {
    let capturedError = null;
    sl.singleton('willThrow', () => {
        throw new Error('willThrow');
    });
    sl.captureError(function captureError(error) {
        capturedError = error;
    });

    sl.get('willThrow');
    assert.ok(capturedError instanceof Error);
});

test('should proxy listed methods for named service', assert => {
    sl.value('foo', {
        superhero() {
            return 'batman';
        }
    });

    const proxied = sl.proxy('foo', ['superhero']);

    assert.equal(proxied.superhero(), 'batman');
});

test('should cache instance of transient service when proxied', assert => {
    let counter = 0;

    class Foo {
        constructor() {
            counter = counter + 1;
        }

        getCount() {
            return counter;
        }
    }

    sl.transient('foo', function () {
        return new Foo();
    });

    const proxied = sl.proxy('foo', ['getCount']);
    proxied.getCount();
    assert.strictEqual(proxied.getCount(), 1);
});

test('should remove service', assert => {
    sl.value('foo', {
        bar: 'foo'
    });

    assert.ok(sl.__services.has('foo'));

    sl.remove('foo');

    assert.notOk(sl.__services.has('foo'));
});

test('should destroy instance of service', assert => {
    let counter = 0;

    class Foo {
        constructor() {
            counter = counter + 1;
        }

        getCount() {
            return counter;
        }
    }

    sl.singleton('foo', function () {
        return new Foo();
    });

    sl.get('foo');
    assert.strictEqual(sl.get('foo').getCount(), 1);

    sl.destroy('foo');
    assert.strictEqual(sl.get('foo').getCount(), 2);
});

test('should call destroy cleanup method on instance when destroyed', assert => {
    const destroySpy = sinon.spy();

    sl.value('foo', {
        __destroy: destroySpy
    });

    assert.notOk(destroySpy.called);

    sl.destroy('foo');
    assert.ok(destroySpy.called);
});
