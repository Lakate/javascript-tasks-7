'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'namespace', {
        writable: false,
        value: helperMethods()
    });

    Object.defineProperty(Object.prototype, 'wrap', {
        value: 
    });
};

function helperMethods() {
    Object.defineProperty(Object.prototype, 'checkContainsKeys', {
        writable: false,
        value: function (keys) {
            if (incorrectType(Object.getPrototypeOf(this), [Array.prototype, Object.prototype])) {
                return throwError(typeof (this), 'checkContainsKeys');
            }
            var objectKeys = Object.keys(this);
            return keys.every(function (key) {
                return objectKeys.indexOf(key) !== -1;
            });
        }
    });

    Object.defineProperty(Object.prototype, 'checkHasKeys', {
        writable: false,
        value: function (keys) {
            if (incorrectType(Object.getPrototypeOf(this), [Array.prototype, Object.prototype])) {
                return throwError(typeof (this), 'checkHasKeys');
            }
            return Object.keys(this).length === keys.length && this.checkContainsKeys(keys);
        }
    });

    Object.defineProperty(Object.prototype, 'checkContainsValues', {
        writable: false,
        value: function (keys) {
            if (incorrectType(Object.getPrototypeOf(this), [Array.prototype, Object.prototype])) {
                return throwError(typeof (this), 'checkContainsValues');
            }
            var cb = function (key) {
                return this[key];
            };
            var objectValues = Object.keys(this).map(cb, this);
            return keys.every(function (key) {
                return objectValues.indexOf(key) !== -1;
            });
        }
    });

    Object.defineProperty(Object.prototype, 'checkHasValues', {
        writable: false,
        value: function (keys) {
            if (incorrectType(Object.getPrototypeOf(this), [Array.prototype, Object.prototype])) {
                return throwError(typeof (this), 'checkHasValues');
            }
            return Object.keys(this).length === keys.length && this.checkContainsValues(keys);
        }
    });

    Object.defineProperty(Object.prototype, 'checkHasValueType', {
        writable: false,
        value: function (key, type) {
            if (incorrectType(Object.getPrototypeOf(this), [Array.prototype, Object.prototype])) {
                return throwError(typeof (this), 'checkHasValueType');
            }
            if ([String, Number, Function, Array].indexOf(type) === -1) {
                return 'ERROR! Wrong type!';
            }
            if (!this.hasOwnProperty(key)) {
                return 'ERROR! Wrong field!';
            }
            return this[key] === type(this[key]);
        }
    });

    Object.defineProperty(Object.prototype, 'checkHasLength', {
        writable: false,
        value: function (length) {
            if (!(typeof (this) === 'string') &&
                incorrectType(Object.getPrototypeOf(this), [Array.prototype, String.prototype])) {
                return throwError(typeof (this), 'checkHasLength');
            }
            return this.length === length;
        }
    });

    Object.defineProperty(Object.prototype, 'checkHasParamsCount', {
        writable: false,
        value: function (length) {
            if (incorrectType(Object.getPrototypeOf(this), [Function.prototype])) {
                return throwError(typeof (this), 'checkHasParamsCount');
            }
            return this.length === length;
        }
    });

    Object.defineProperty(Object.prototype, 'checkHasWordsCount', {
        writable: false,
        value: function (count) {
            if (!(typeof (this) === 'string') &&
                incorrectType(Object.getPrototypeOf(this), [String.prototype])) {
                return throwError(typeof (this), 'checkHasWordsCount');
            }
            return this.split(' ').length === count;
        }
    });
}

function incorrectType(prototypeOfObject, correctPrototypes) {
    return correctPrototypes.indexOf(prototypeOfObject) === -1;
}

function throwError(typeOfObject, property) {
    return 'ERROR!' + typeOfObject + ' has not \'' + property + '\' property';
}
