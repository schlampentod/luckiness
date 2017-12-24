/**
 *
 */
app.service('addressAnalyticsService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', '$q', '$window', '$rootScope', function ($timeout, luckyConstants, luckyFactory, $http, $q, $window, $rootScope) {

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

            var promise = $http.get('http://192.168.1.102:8080/rest/v1/lucky/check/' + keyValue);
            promise.then(function (response) {

                var CheckKeyResultDto = response.data;
                var isFound = CheckKeyResultDto['checkedKeyFound'];

                if (isFound) {

                    var isThisKnownKey = null !== _.find($rootScope.listOfMagicKeys, function (obj) {
                        return obj.knownKeyDecimal == keyValue;
                    });

                    if (!isThisKnownKey) {
                        var numberOfKey = $window.localStorage.length;       //если ключ совпал - забить в локалсторадж
                        $window.localStorage.setItem(numberOfKey, keyValue);
                        console.info("Found: " + keyValue);
                    }
                }

                deferred.resolve(CheckKeyResultDto);
            });
        }

        return deferred.promise;
    };

    $rootScope.selectedMagicKeys;
    $.get('/rest/v1/lucky/known').done(function (data) {
        $rootScope.listOfMagicKeys = [];
        for (var i = 0; i < data.knownKeyDtos.length; i++) {
            $rootScope.listOfMagicKeys[i] = data.knownKeyDtos[i];
        }
    });

}]);