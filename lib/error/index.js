const errorProps = [
    'description',
    'fileName',
    'lineNumber',
    'message',
    'name',
    'number',
    'stack'
];

export function CustomError() {
    const tmp = Error.apply(this, arguments);

    // Adds a `stack` property to the given error object that will yield the
    // stack trace at the time captureStackTrace was called.
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this);
    }

    // Unfortunately errors are not enumerable in Chrome (at least), so
    // `for prop in tmp` doesn't work.
    errorProps.forEach(prop => {
        if (prop === 'name') {
            return;
        }

        this[prop] = tmp[prop];
    });
}
CustomError.prototype = Object.create(Error.prototype);

/**
  Create custom errors
*/
export function customError(errorConstructor, name = 'AnonymousCustomError') {
    errorConstructor.prototype = Object.create(CustomError.prototype); // eslint-disable-line no-param-reassign
    errorConstructor.prototype.name = name; // eslint-disable-line no-param-reassign

    return errorConstructor;
}

export function isError(error) {
    return error instanceof Error;
}
