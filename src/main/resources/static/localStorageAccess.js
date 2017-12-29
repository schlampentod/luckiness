/**
 *
 */
app.factory('localStorageAccess', ['$window', function ($window) {
    return {
        setStringToLocalStorage: function (key, value) {
            if (value == null) {
                $window.localStorage.removeItem(key);
            } else {
                $window.localStorage[key] = value;
            }
        },
        getStringFromLocalStorage: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObjectToLocalStorage: function (key, value) {
            if (value == null) {
                $window.localStorage.removeItem(key);
            } else {
                $window.localStorage[key] = JSON.stringify(value);
            }
        },
        getObjectFromLocalStorage: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        getObjectFromLocalStorageWithDefault: function (key, defaultObj) {
            if ($window.localStorage[key]) {
                return JSON.parse($window.localStorage[key]);
            }
            return defaultObj;
        },
        getArrayFromLocalStorage: function (key) {
            return JSON.parse($window.localStorage[key] || '[]');
        }
    }
}]);