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
            /** Добавляем .not */
            Object.defineProperty(Object.prototype, 'not', {
                get: function () {
                    return extendBasePrototype.call(this, false);
                }.bind(this),
                configurable: true
            });
            return extendBasePrototype.call(this, true);
        },
        configurable: true
    });
};

/**
 * Возвращает методы, которыми будем расширять прототип.
 * Зависит от typeOfProperty: если он true, то вызвались из check, если false - из not
 * @param {boolean} typeOfProperty
 */
function extendBasePrototype(typeOfProperty) {
    /** Получаем вспомогательные методы */
    var helperMethods = getHelperMethods.call(this);
    /** Получаем тип объекта */
    var typeOfObject = getType.call(this);
    METHODS_FOR[typeOfObject].forEach(function (method) {
        helperMethods[method] = helperMethods[method].bind(this, typeOfProperty);
    }, this);
    return helperMethods;
};

/**
 * Обертка для объектов
 */
exports.wrap = function (obj) {
    if (obj === null) {
        return {
            get: function () {
                return null;
            },
            isNull: function () {
                return true;
            }
        };
    }

    Object.defineProperty(Object.prototype, 'isNull', {
        get: function () {
            return false;
        }
    });
    exports.init.call(this);
    return obj;
};

/**
 *  Возвращает вспомогательные функции
 */
function getHelperMethods() {
    return {
        containsKeys: function () {
            var args = [].slice.call(arguments, -2);
            var typeOfProperty = args[0];
            var keys = args[1];
            var objectKeys = Object.keys(this);
            var answer = keys.every(function (key) {
                return objectKeys.indexOf(key) !== -1;
            });
            return getAnswer(typeOfProperty, answer);
        },

        hasKeys: function (typeOfProperty, keys) {
            return getAnsToHasMethods.call(this, typeOfProperty, keys, 'Keys');
        },

        containsValues: function () {
            var args = [].slice.call(arguments, -2);
            var typeOfProperty = args[0];
            var values = args[1];
            var cb = function (key) {
                return this[key];
            };
            var objectValues = Object.keys(this).map(cb, this);
            var answer = values.every(function (key) {
                return objectValues.indexOf(key) !== -1;
            });
            return getAnswer(typeOfProperty, answer);
        },

        hasValues: function (typeOfProperty, keys) {
            return getAnsToHasMethods.call(this, typeOfProperty, keys, 'Values');
        },

        hasValueType: function (typeOfProperty, key, type) {
            if ([String, Number, Function, Array].indexOf(type) === -1) {
                return 'ERROR! Wrong type!';
            }
            if (!this.hasOwnProperty(key)) {
                return 'ERROR! Wrong field!';
            }
            return getAnswer(typeOfProperty, areEqual(this[key], type(this[key])));
        },

        hasLength: function (typeOfProperty, length) {
            return getAnswer(typeOfProperty, areEqual(this.length, length));
        },

        hasParamsCount: function (typeOfProperty, length) {
            return this.check.hasLength.call(this, typeOfProperty, length);
        },

        hasWordsCount: function (typeOfProperty, count) {
            return getAnswer(typeOfProperty, areEqual(this.split(' ').length, count));
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

function areEqual(a, b) {
    return a === b;
}

/** Сначала считаем всегда для check, а потом инвертируем ответ, если нужно */
function getAnsToHasMethods(typeOfProperty, keys, param) {
    return getAnswer(typeOfProperty, areEqual(Object.keys(this).length, keys.length) &&
        this.check['contains' + param](true, keys));
}

function getAnswer(typeOfProperty, answer) {
    if (typeOfProperty) {
        return answer;
    }
    return !answer;
}
