import SimpleMap from '../simple-map';


class ServiceLocator {
    constructor() {
        this.__services = new SimpleMap();
    }

    singleton(name, factory) {
        const config = {
            singleton: true,
            factory,
            instantiated: false,
            instance: null,
        };
        this.__services.set(name, config);
    }

    transient(name, factory) {
        const config = {
            singleton: false,
            factory,
            instantiated: false,
            instance: null,
        };
        this.__services.set(name, config);
    }

    value(name, instance) {
        const config = {
            singleton: true,
            instantiated: true,
            instance,
        };
        this.__services.set(name, config);
    }

    remove(name) {
        this.__services.remove(name);
    }

    destroy(name) {
        const config = this.__services.get(name);
        config.instance = null;
        config.instantiated = false;
        this.__services.set(name, config);
    }

    get(name) {
        try {
            const service = this.__services.get(name);

            if (service.instantiated) {
                return service.instance;
            }

            const instance = service.factory();

            if (service.singleton) {
                service.instance = instance;
                service.instantiated = true;
                this.__services.set(name, service);
            }

            return instance;
        } catch (err) {
            const error = new Error(`sl: unable to get service ${name}`);
            this.__logFatal(error);
            throw err;
        }
    }

    __logFatal(error) {
        if (this.__services.has('logger')) {
            const logger = this.get('logger');
            logger.fatal(error);
        } else {
            console.trace(error); // eslint-disable-line no-console
        }
    }

    proxy(name, methods, bindToSelf = false) {
        const mirror = {};
        const that = this;

        function mirrorMethod(methodName) {
            Object.defineProperty(mirror, methodName, {
                get: function getMethod() {
                    const service = that.get(name);
                    let method = service[methodName];

                    if (bindToSelf === true) {
                        method = method.bind(service);
                    }

                    return method;
                },
            });
        }

        methods.forEach(mirrorMethod);

        return mirror;
    }
}

const sl = new ServiceLocator();

export default sl;

// should throw error if does not exit
// should log all exceptions
// should register singletons
// should register transient instances
// should allow simple facade wrapping
// should automatically re-wrap facades when instance is changed
// should lazily instantiate requested items
