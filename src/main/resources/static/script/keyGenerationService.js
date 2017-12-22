/**
 * TODO make max and min: constants
 */
app.service('keyGenerationService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', '$q', '$window', function ($timeout, luckyConstants, luckyFactory, $http, $q, $window) {

    var srv = this;

    srv.generateMinValue = function (binchInstance) {
        var offsets = binchInstance.getBinchBarOffsets();

        _.forEach(binchInstance.binchBars, function (bar, i) {
            offsets[i] = 0;
        });

        offsets[offsets.length - 1] = 1;

        binchInstance.setChooserBarsOffsets(offsets);
    };

    srv.generateMaxValue = function (binchInstance) {
        var offsets = binchInstance.getBinchBarOffsets();

        _.forEach(binchInstance.binchBars, function (bar, i) {
            offsets[i] = 1000; // TODO fixme
        });

        offsets[0] = 998;

        binchInstance.setChooserBarsOffsets(offsets);
    };

    srv.generateRandomBarOffsets = function (binchInstance) {
        var offsets = binchInstance.getBinchBarOffsets();

        _.forEach(binchInstance.binchBars, function (bar, i) {
            offsets[i] = Math.floor(Math.random() * 1000);
        });

        offsets[offsets.length - 1] = 999;

        binchInstance.setChooserBarsOffsets(offsets);
    };

    srv.incrementChosenValue = function (binchInstance) {
        var newValue = binch.chosenValue.add(binchInstance.BIG_ONE);
        binch.setProvidedChosenStringValue(newValue.toString(10));
    };

    srv.decrementChosenValue = function (binchInstance) {
        var newValue = binch.chosenValue.subtract(binchInstance.BIG_ONE);
        binch.setProvidedChosenStringValue(newValue.toString(10));
    };

}]);