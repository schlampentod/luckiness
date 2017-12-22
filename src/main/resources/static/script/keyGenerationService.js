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
        if(binch.MAX_BIG_NUMBER.lesserOrEquals(binch.chosenValue)){
            return;
        }

        var newValue = binch.chosenValue.add(binchInstance.BIG_ONE);
        binch.setProvidedChosenStringValue(newValue.toString(10));
    };

    srv.decrementChosenValue = function (binchInstance) {
        if(binch.chosenValue.lesserOrEquals(binch.MIN_BIG_NUMBER)){
            return;
        }

        var newValue = binch.chosenValue.subtract(binchInstance.BIG_ONE);
        binch.setProvidedChosenStringValue(newValue.toString(10));
    };

}]);