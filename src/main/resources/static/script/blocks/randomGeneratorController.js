/**
 *
 */
app.controller('randomGeneratorController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    vm.luckyBatchGenerationInterval = null;

    vm.luckyBatchGenerationFrom = null;
    vm.luckyBatchGenerationTill = null;

    vm.onGenerateRandomClick = function () {
        generateRandomOffsets();
    };

    vm.onStartRandomBatchClick = function () {
        if (vm.luckyBatchGenerationInterval) {
            $interval.cancel(vm.luckyBatchGenerationInterval);
            vm.luckyBatchGenerationInterval = null;
        } else {
            vm.luckyBatchGenerationInterval = $interval(function () {
                generateRandomOffsetsRandomBar();
            }, 50);
        }
    };

    //
    //
    //

    function getSelectedBars() {
        var selectedBars = new Array(luckyService.currentChooser.binchBars.length);
        selectedBars.fill(true);

        return selectedBars;
    }

    function generateRandomOffsets() {
        var newOffsets = generateRandomBarOffsets(luckyService.currentChooser, getSelectedBars());

        $scope.$emit(luckyConstants.TRY_BAR_OFFSETS_EVT, {offsetsArrayToTry: newOffsets});
    }

    function generateRandomOffsetsRandomBar() {
        var newOffsets = generateRandomBarOffsetsRandomBar(luckyService.currentChooser, getSelectedBars());

        $scope.$emit(luckyConstants.TRY_BAR_OFFSETS_EVT, {offsetsArrayToTry: newOffsets});
    }

    function generateRandomBarOffsets(binchInstance, selectedBars) {
        var offsets = binchInstance.getBinchBarOffsets();

        _.forEach(binchInstance.binchBars, function (bar, i) {
            if (selectedBars[i]) {
                offsets[i] = getRandomOffset(bar);
            }
        });
        return offsets;
    }

    function generateRandomBarOffsetsRandomBar(binchInstance, barSelectionArray) {
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
        offsets[randomBarIdx] = getRandomOffset(bar);

        return offsets;
    }

    //
    //
    //

    function getRandomOffset(bar) {
        var min = Math.ceil(vm.luckyBatchGenerationFrom === null || vm.luckyBatchGenerationFrom === "" ? 0 : vm.luckyBatchGenerationFrom);
        var max = Math.floor(vm.luckyBatchGenerationTill === null || vm.luckyBatchGenerationTill === "" ? bar.binchBarMaxOffsetPx : vm.luckyBatchGenerationTill);

        if (max <= min) {
            min = 0;
            max = bar.binchBarMaxOffsetPx;
        }

        var rv = Math.floor(Math.random() * (max - min + 1)) + min;

        //console.info(rv + " from " + min + " to " + max);

        return rv;
    }

}]);

