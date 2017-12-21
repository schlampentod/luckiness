/**
 *
 */
app.service('luckyAddressService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', '$q', function ($timeout, luckyConstants, luckyFactory, $http, $q) {

    var srv = this;

    srv.resolveBitcoinAddressByKey = function (keyValue) {

        var deferred = $q.defer();

        var promise = $http.get('/rest/v1/lucky/addresses/' + keyValue);
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

            var promise = $http.get('rest/v1/lucky/check/' + keyValue);
            promise.then(function (CheckKeyResultDto) {

                var isFound = CheckKeyResultDto['checkedKeyFound'];
                if (isFound) {
                    console.info("Found: " + keyValue);
                }

                deferred.resolve(CheckKeyResultDto);
            });
        }

        return deferred.promise;
    };

}]);