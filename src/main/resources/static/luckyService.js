/**
 *
 */
app.service('luckyService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', function ($timeout, luckyConstants, luckyFactory, $http) {

    var srv = this;

    srv.myServiceFunc = function () {
        return luckyConstants.luckyConstant1;
    };

    srv.getSelectedLuckyValue = function (barOffsetValues) {
        var rv = bigInt(0);

        _.forEach(barOffsetValues, function (offsetVal, i) {
            var luckyBarNet = srv.getLuckyBarNetValue(offsetVal, i, luckyFactory.SLOTS_PER_BAR);
            rv = rv.add(luckyBarNet);
        });

        return rv;
    };

    srv.splitProvidedLuckyValue = function (providedValue) {
        var rv = new Array(26);

        // TODO fixme
        rv.fill(33);

        return rv;
    };

    srv.getLuckyBarNetValue = function (offsetVal, barIndex, slotsPerBar) {
        var rangeValue = luckyFactory.getSnippetRangeByIndex(barIndex, slotsPerBar);
        return rangeValue.multiply(offsetVal);
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