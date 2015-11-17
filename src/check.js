'use strict';
var METHODS_FOR = {
    object: ['containsKeys', 'hasKeys', 'containsValues', 'hasValues', 'hasValueType'],
    function: ['hasParamsCount'],
    string: ['hasLength', 'hasWordsCount']
};
METHODS_FOR.array = METHODS_FOR.object.concat(['hasLength']);

/**
 * Метод, расширяющий прототип Object.prototype.
 */
exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: function () {
            /** Получаем вспомогательные методы */
            var helperMethods = getHelperMethods();
            /** Получаем тип объекта */
            var typeOfObject = getType.call(this);
            METHODS_FOR[typeOfObject].forEach(function (method) {
                helperMethods[method] = helperMethods[method].bind(this);
            }, this);
            return helperMethods;
        },
        configurable: true
    });
};

/**
 *  Возвращает вспомогательные функции
 */
function getHelperMethods() {
    return {
        containsKeys: function (keys) {
            var objectKeys = Object.keys(this);
            return keys.every(function (key) {
                return objectKeys.indexOf(key) !== -1;
            });
        },

        hasKeys: function (keys) {
            return Object.keys(this).length === keys.length && this.check.containsKeys(keys);
        },

        containsValues: function (keys) {
            var cb = function (key) {
                return this[key];
            };
            var objectValues = Object.keys(this).map(cb, this);
            return keys.every(function (key) {
                return objectValues.indexOf(key) !== -1;
            });
        },

        hasValues: function (keys) {
            return Object.keys(this).length === keys.length && this.check.containsValues(keys);
        },

        hasValueType: function (key, type) {
            if ([String, Number, Function, Array].indexOf(type) === -1) {
                return 'ERROR! Wrong type!';
            }
            if (!this.hasOwnProperty(key)) {
                return 'ERROR! Wrong field!';
            }
            return this[key] === type(this[key]);
        },

        hasLength: function (length) {
            return this.length === length;
        },

        hasParamsCount: function (length) {
            return this.length === length;
        },

        hasWordsCount: function (count) {
            return this.split(' ').length === count;
        }
    };
}

/**
 * Возвращает тип объекта
 * @returns {string}
 */
function getType() {
    if (typeof (this) === 'string') {
        return 'string';
    }
    switch (Object.getPrototypeOf(this)) {
        case Array.prototype: return 'array';
        case Function.prototype: return 'function';
        case String.prototype: return 'string';
    }
    return 'object';
}
