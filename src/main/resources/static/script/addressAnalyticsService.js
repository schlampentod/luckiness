/**
 *
 */
app.service('addressAnalyticsService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', '$q','$window', function ($timeout, luckyConstants, luckyFactory, $http, $q, $window) {

    var srv = this;

    srv.resolveBitcoinAddressByKey = function (keyValue) {

        // console.info("addressAnalyticsService: resolving: " + keyValue);

        var deferred = $q.defer();

        var promise = $http.get('/rest/v1/lucky/resolve/' + keyValue);
        promise.then(function (response) {

            var AddressesResultDto = response.data;
            deferred.resolve(AddressesResultDto);
            $("#idOfWIF").text(AddressesResultDto['privateKeyAsWIF']);//вывести на странице "privateKeyAsWIF"(из ответа на запрос)
            // console.info("addressAnalyticsService: resolved to: " + AddressesResultDto['publicAddressAsHex']);
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

    $.get('http://localhost:8080/rest/v1/lucky/known').done(function (data) {//забить некоторые данные в списочек
        for(i=0;i<data.knownKeyDtos.length;i++){
            $('#list1').append('<option value="' + data.knownKeyDtos[i].knownKeyDecimal + '">' +data.knownKeyDtos[i].knownKeyDecimal + '</option>');
        };

    });

}]);