/**
 *
 */
app.service('luckyAddressService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', '$q','$window', function ($timeout, luckyConstants, luckyFactory, $http, $q, $window) {

    var srv = this;

    srv.resolveBitcoinAddressByKey = function (keyValue) {

        console.info("luckyAddressService: resolving: " + keyValue);

        var deferred = $q.defer();

        var promise = $http.get('/rest/v1/lucky/resolve/' + keyValue);
        promise.then(function (response) {

            var AddressesResultDto = response.data;
            deferred.resolve(AddressesResultDto);

            console.info("luckyAddressService: resolved to: " + AddressesResultDto['publicAddressAsHex']);
        });

        return deferred.promise;
    };

    srv.checkKeyInBlockChain = function (keyValue) {

        var deferred = $q.defer();

        if (keyValue.toString() == "" || keyValue.toString() == "0") {
            deferred.reject("Unable to check invalid key: " + keyValue);
        } else {

            var promise = $http.get('rest/v1/lucky/check/' + keyValue);
            promise.then(function (CheckKeyResultDto) {

                var isFound = CheckKeyResultDto['checkedKeyFound'];
                if (isFound) {
                    var numberOfKey=$window.localStorage.length;       //если ключ совпал - забить в локалсторадж
                    $window.localStorage.setItem(numberOfKey,keyValue);
                    console.info("Found: " + keyValue);
                }
                deferred.resolve(CheckKeyResultDto);
            });
        }

        return deferred.promise;
    };

}]);