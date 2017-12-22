/**
 * TODO make max and min: constants
 */
app.service('keyGenerationService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', '$q', '$window', function ($timeout, luckyConstants, luckyFactory, $http, $q, $window) {

    var srv = this;

    srv.generateMinValue = function (binchInstance) {
        _.forEach(binchInstance.binchBars, function (bar, i) {
            bar.binchBarOffsetPx = 0;
        });

        getLastBar(binchInstance).binchBarOffsetPx = 1;
    };

    srv.generateMaxValue = function (binchInstance) {
        _.forEach(binchInstance.binchBars, function (bar, i) {
            bar.binchBarOffsetPx = 1000; // TODO fixme
        });
    };

    srv.generateRandomBarOffsets = function (binchInstance) {
        _.forEach(binchInstance.binchBars, function (bar, i) {
            bar.binchBarOffsetPx = Math.floor(Math.random() * 1000);
        });
    };


    //
    //
    //

    function getLastBar(binchInstance) {
        return binchInstance.binchBars[binch.binchBars.length - 1];
    }

}]);