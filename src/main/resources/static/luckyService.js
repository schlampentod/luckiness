/**
 *
 */

app.service('luckyService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', function ($timeout, luckyConstants, luckyFactory, $http) {

    var srv = this;

    srv.currentChooser = binch;

    srv.myServiceFunc = function () {
        return luckyConstants.luckyConstant1;
    };

    srv.checkKeyInBlockChain = function (keyValue) {
        if (keyValue.toString() == "" || keyValue.toString() == "0") {
            console.info("Unable to check key: " + keyValue);
            return;
        }
        var promise = $http.get('rest/v1/lucky/check/' + keyValue);
        promise.then(function (CheckKeyResultDto) {
            var isFound = CheckKeyResultDto['checkedKeyFound'];
            if (isFound) {
                console.info("Found: " + keyValue);
                alert("Found: " + keyValue);
            } else {
                // console.info("Not found: " + keyValue);
            }
        });
    }
}]);