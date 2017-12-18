/**
 *
 */
app.service('luckyService', ['$timeout', 'luckyConstants', 'luckyFactory', function ($timeout, luckyConstants, luckyFactory) {

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
}]);