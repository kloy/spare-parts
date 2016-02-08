import SimpleMap from '../simple-map';
import { noop } from '../utils';


/**
 * Service locator pattern plus some dependency injection traits mixed in.
 */
export class ServiceLocator {
    constructor() {
        this.__captureError = noop;
        this.__services = new SimpleMap();
    }

    /**
     * Register service as singleton.
     *
     * @param {string} name - name for service
     * @param {function} factory - creates instance for service
     * @return {ServiceLocator} - instance of self
     */
    singleton(name, factory) {
        const config = {
            singleton: true,
            factory,
            instantiated: false,
            instance: null
        };
        this.__services.set(name, config);

        return this;
    }

    /**
     * Register service as transient. Will return a new instance of service when invoked.
     *
     * @param {string} name - name for service
     * @param {function} factory - creates instance for service
     * @return {ServiceLocator} - instance of self
     */
    transient(name, factory) {
        const config = {
            singleton: false,
            factory,
            instantiated: false,
            instance: null
        };
        this.__services.set(name, config);

        return this;
    }

    /**
     * Register value as singleton.
     *
     * @param {string} name - name for service
     * @param {object} instance - previously created instance to be registered
     * @return {ServiceLocator} - instance of self
     */
    value(name, instance) {
        const config = {
            singleton: true,
            instantiated: true,
            instance
        };
        this.__services.set(name, config);

        return this;
    }

    /**
     * Remove service from service locator by name.
     *
     * @param {string} name - name for service
     * @return {ServiceLocator} - instance of self
     */
    remove(name) {
        this.__services.delete(name);

        return this;
    }

    /**
     * Destroy service instance and call destroy method on service.
     *
     * @param {string} name - name for service
     * @return {ServiceLocator} - instance of self
     */
    destroy(name) {
        const serviceConfig = this.__services.get(name);
        const { instantiated, instance } = serviceConfig;

        if (instantiated && '__destroy' in instance) {
            instance.__destroy();
        }

        this.__services.set(name, Object.assign({}, serviceConfig, {
            instantiated: false,
            instance: null
        }));

        return this;
    }

    /**
     * Get an instance of service by name.
     *
     * @param {string} name - name of service
     * @return {object} - instance of service
     */
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
            this.__captureError(error);
        }
    }

    __getProxiedMethod(service, methodName, bindToSelf) {
        let method = service[methodName];

        if (bindToSelf === true) {
            method = method.bind(service);
        }

        return method;
    }

    /**
     * Create proxy instance of service. Purpose is to provide sugar for commonly used services by allowing ES6 imports
     * while allowing for service replacement prior to first call.
     *
     * @param {string} serviceName - name of service
     * @param {array} methods - name of methods/properties to proxy
     * @param {boolean} bindToSelf - should proxied methods be bound to service's instance
     * @return {object} - object implementing proxied methods and properties
     */
    proxy(serviceName, methods, bindToSelf = false) {
        const mirror = {
            __service: null
        };
        const that = this;

        const getProxiedService = __serviceName => {
            if (mirror.__service !== null) {
                return mirror.__service;
            }

            const serviceConfig = this.__services.get(__serviceName);

            if (serviceConfig.singleton === false) {
                const service = this.get(__serviceName);
                mirror.__service = service;

                return service;
            }

            return this.get(__serviceName);
        };

        function mirrorMethod(methodName) {
            Object.defineProperty(mirror, methodName, {
                configurable: false,
                get: function getMethod() {
                    const service = getProxiedService(serviceName);
                    return that.__getProxiedMethod(service, methodName, bindToSelf);
                },
                set: function setMethod() {
                    const service = getProxiedService(serviceName);
                    return that.__getProxiedMethod(service, methodName, bindToSelf);
                },
            });
        }

        methods.forEach(mirrorMethod);

        return mirror;
    }

    /**
     * Assign function for capturing errors from service locator. Useful for remote logging errors.
     *
     * @param {function} captureError - capture error listener
     * @return {ServiceLocator} - instance of self
     */
    captureError(captureError) {
        this.__captureError = captureError;

        return this;
    }
}

const sl = new ServiceLocator();

export default sl;
