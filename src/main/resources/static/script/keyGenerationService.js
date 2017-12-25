/**
 * TODO make max and min: constants
 */
app.service('keyGenerationService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', '$q', '$window', function ($timeout, luckyConstants, luckyFactory, $http, $q, $window) {

    var srv = this;

    srv.generateMinValue = function (binchInstance) {
        var offsets = binchInstance.getBinchBarOffsets();

        _.forEach(binchInstance.binchBars, function (bar, i) {
            offsets[i] = bar.binchBarMinOffsetPx;
        });

        binchInstance.setChooserBarsOffsets(offsets);
    };

    srv.generateMaxValue = function (binchInstance) {
        var offsets = binchInstance.getBinchBarOffsets();

        _.forEach(binchInstance.binchBars, function (bar, i) {
            offsets[i] = bar.binchBarMaxOffsetPx;
        });

        binchInstance.setChooserBarsOffsets(offsets);
    };

    srv.generateRandomBarOffsets = function (binchInstance, selectedBars) {
        var offsets = binchInstance.getBinchBarOffsets();

        _.forEach(binchInstance.binchBars, function (bar, i) {
            if (selectedBars[i]) {
                offsets[i] = Math.floor(Math.random() * bar.binchBarMaxOffsetPx);
            }
        });

        binchInstance.setChooserBarsOffsets(offsets);
    };

    srv.generateRandomBarOffsetsRandomBar = function (binchInstance, barSelectionArray) {
        var offsets = binchInstance.getBinchBarOffsets();

        var selectedBarsIndexes = [];

        _.forEach(barSelectionArray, function (barSelected, i) {
            if (barSelected) {
                selectedBarsIndexes.push(i);
            }
        });

        if (!selectedBarsIndexes.length) {
            return;
        }

        var maxBarIdx = binchInstance.binchBars.length - 1;
        var randomBarIdx = -1;

        while (randomBarIdx < 0) {
            var rnd = Math.floor(Math.random() * maxBarIdx);
            if (_.includes(selectedBarsIndexes, rnd)) {
                randomBarIdx = rnd;
            }
        }

        var bar = binchInstance.binchBars[randomBarIdx];
        offsets[randomBarIdx] = Math.floor(Math.random() * bar.binchBarMaxOffsetPx);

        binchInstance.setChooserBarsOffsets(offsets);
    };

    srv.incrementChosenValue = function (binchInstance) {
        if (binch.MAX_BIG_NUMBER.lesserOrEquals(binch.chosenValue)) {
            return;
        }

        var newValue = binch.chosenValue.add(bigInt("1000")/*binchInstance.BIG_ONE*/);
        binch.setProvidedChosenStringValue(newValue.toString(10));
    };

    srv.decrementChosenValue = function (binchInstance) {
        if (binch.chosenValue.lesserOrEquals(binch.MIN_BIG_NUMBER)) {
            return;
        }

        var newValue = binch.chosenValue.subtract(bigInt("1000")/*binchInstance.BIG_ONE*/);
        binch.setProvidedChosenStringValue(newValue.toString(10));
    };

}]);