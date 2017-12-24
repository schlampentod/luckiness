/**
 *
 */
app.service('addressAnalyticsService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', '$q', '$window', '$rootScope', function ($timeout, luckyConstants, luckyFactory, $http, $q, $window, $rootScope) {

    var srv = this;

    srv.resolveBitcoinAddressByKey = function (keyValue) {

        // console.info("addressAnalyticsService: resolving: " + keyValue);

        var deferred = $q.defer();

        var promise = $http.get(createUrl('/rest/v1/lucky/resolve/' + keyValue));
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

            var promise = $http.get(createUrl('/rest/v1/lucky/check/batch/' + keyValue));
            promise.then(function (response) {

                var CheckKeyResultDto = response.data;
                var isFound = CheckKeyResultDto['checkedKeyFound'];
                var matchedKeys = CheckKeyResultDto['checkedKeysMatched'];

                if (isFound) {

                    _.forEach(matchedKeys, function (matchedKey) {

                        var isThisKnownKey = null !== _.find($rootScope.listOfKnownKeys, function (obj) {
                            return obj.knownKeyDecimal == matchedKey;
                        });

                        if (!isThisKnownKey) {
                            var numberOfKey = $window.localStorage.length;       //если ключ совпал - забить в локалсторадж
                            $window.localStorage.setItem(numberOfKey, matchedKey);
                            console.info("Found: " + matchedKey);
                        }
                    });
                }

                deferred.resolve(CheckKeyResultDto);
            });
        }

        return deferred.promise;
    };

    $rootScope.selectedKnownKey;
    $.get(createUrl('/rest/v1/lucky/known')).done(function (data) {
        $rootScope.listOfKnownKeys = [];
        for (var i = 0; i < data.knownKeyDtos.length; i++) {
            $rootScope.listOfKnownKeys[i] = data.knownKeyDtos[i];
        }
    });

    function createUrl(URI) {
        return REST_SERVER_ENDPOINT + URI;
    }

}]);