/**
 *
 */
app.service('addressAnalyticsService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', '$q', '$window', '$rootScope', 'localStorageAccess', function ($timeout, luckyConstants, luckyFactory, $http, $q, $window, $rootScope, localStorageAccess) {

    var srv = this;

    srv.resolveBitcoinAddressByKey = function (keyValue) {

        // console.info("addressAnalyticsService: resolving: " + keyValue);

        var deferred = $q.defer();

        var promise = $http.get('/rest/v1/lucky/resolve/' + keyValue);
        promise.then(function (response) {
            var AddressesResultDto = response.data;
            deferred.resolve(AddressesResultDto);
        });

        return deferred.promise;
    };

    srv.checkKeyInBlockChain = function (keyValue) {

        var deferred = $q.defer();

        if (keyValue.toString() == "" || keyValue.toString() == "0") {
            deferred.reject("Unable to check invalid key: " + keyValue);
        } else {

            var promise = $http.get(createUrl('/rest/v1/checky/check/batch/' + keyValue));
            promise.then(function (response) {

                var CheckKeyResultDto = response.data;
                var isFound = CheckKeyResultDto['checkedKeyFound'];
                var matchedKeys = CheckKeyResultDto['checkedKeysMatched'];

                if (isFound) {

                    _.forEach(matchedKeys, function (matchedKey) {

                            console.info("Found: " + matchedKey);

                            var knownKeyObj = _.find($rootScope.listOfKnownKeys, function (obj) {
                                return obj.knownKeyDecimal == matchedKey;
                            });

                            var isThisKnownKey = null != knownKeyObj;

                            if (!isThisKnownKey) {
                                var lengthlocalStorage = $window.localStorage.length;

                                var keyAlreadyExistsInLS = false;
                                for (var i = 0; i < lengthlocalStorage; i++) {
                                    if (matchedKey === $window.localStorage.getItem(i)) {//localStorageAccess.getStringFromLocalStorage
                                        keyAlreadyExistsInLS = true;
                                    }
                                }

                                if (keyAlreadyExistsInLS === false) {

                                    var arrayOfKeys = localStorageAccess.getArrayFromLocalStorage("matched_keys");
                                    arrayOfKeys.push(matchedKey);
                                    localStorageAccess.setObjectToLocalStorage("matched_keys", arrayOfKeys);

                                    //$window.localStorage.setItem(numberOfKey, matchedKey);
                                    console.info("Matched key missing from local storage (adding): " + matchedKey);
                                } else {
                                    console.info("Matched key already exist in local storage: " + matchedKey);
                                }
                            }
                        }
                    );
                }

                deferred.resolve(CheckKeyResultDto);
            });
        }

        return deferred.promise;
    };

    // https://blockchain.info/q/addressbalance/1FYMZEHnszCHKTBdFZ2DLrUuk3dGwYKQxh
    srv.getAddressBalance = function (address) {

        var deferred = $q.defer();

        var URL = 'https://blockchain.info/q/addressbalance/' + address;

        $http.get(URL).then(function (response) {
            var balance = response.data;
            deferred.resolve(balance);
        }, function (errors) {
            console.error(errors);
        });

        return deferred.promise;
    };

    $.get('/rest/v1/lucky/known').done(function (data) {
        $rootScope.listOfKnownKeys = [];
        $rootScope.numberOfKeys = data.knownKeyDtos.length;
        for (var i = 0; i < data.knownKeyDtos.length; i++) {
            $rootScope.listOfKnownKeys[i] = data.knownKeyDtos[i];
        }
    });

    srv.convertWifKeyToDecimal = function (wifKeyValue) {

        var deferred = $q.defer();

        var promise = $http.get('/rest/v1/lucky/convert/base68/' + wifKeyValue);
        promise.then(function (response) {
            var ConvertedKeyDto = response.data;
            deferred.resolve(ConvertedKeyDto);
        });

        return deferred.promise;
    };


    function createUrl(URI) {
        return REST_CHECKY_ENDPOINT + URI;
    }

}]);