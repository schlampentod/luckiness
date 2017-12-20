/**
 *
 */

app.controller('luckyController', ['$scope', 'luckyService', 'luckyFactory', '$interval', function ($scope, luckyService, luckyFactory, $interval) {
    var vm = this;

    vm.luckyCtrlPma = {
        luckyTotalGeneratedKeys: 0,
        luckyBatchGenerationInterval: null
    };

    vm.luckyCtrlDerivedKeys = {
        luckyKeyPublicAddress: null
    };

    vm.luckyBinchBarsOffsets = [];

    populateBarOffsets();

    vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);

    vm.luckyProvidedExactValue = "";

    $scope.$watch(function () {
        return vm.luckyBinchBarsOffsets;
    }, function (newVal, oldVal) {
        luckyService.currentChooser.setChooserBarsOffsets(vm.luckyBinchBarsOffsets);
        vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);
    }, true);

    $scope.$watch(function () {
        return vm.luckyBarSumValue;
    }, function (newVal, oldVal) {
        vm.luckyCtrlPma.luckyTotalGeneratedKeys++;
        luckyService.checkKeyInBlockChain(newVal);
    });

    $scope.getkeys = function (event) {
        var one = bigInt("1");
        var bigValue = bigInt(vm.luckyProvidedExactValue);
        if (event.keyCode == 38) {
            bigValue = bigValue.add(one);
            vm.luckyProvidedExactValue = bigValue.toString();
        }
        if (event.keyCode == 40) {
            bigValue = bigValue.subtract(one);
            vm.luckyProvidedExactValue = bigValue.toString();
        }
    };


    $scope.$watch(function () {
        return vm.luckyProvidedExactValue;
    }, function (newVal, oldVal) {
        /*var parsedOffsets = luckyService.splitProvidedLuckyValue(oldVal);
        _.forEach(vm.luckyBarOffsetValues, function (idx, i) {
            vm.luckyBarOffsetValues[i] = parsedOffsets[i];
        });*/
    });


    vm.onParseProvidedValueClick = function () {
        /*var parsedOffsets = luckyService.splitProvidedLuckyValue(vm.luckyProvidedExactValue);
        _.forEach(vm.luckyBarOffsetValues, function (idx, i) {
            vm.luckyBarOffsetValues[i] = parsedOffsets[i];
        });*/
    };

    vm.onGenerateMinClick = function () {
        luckyService.currentChooser.generateMinValue();
        populateBarOffsets();
        vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);
    };

    vm.onGenerateMaxClick = function () {
        luckyService.currentChooser.generateMaxValue();
        populateBarOffsets();
        vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);
    };

    vm.onGenerateRandomClick = function () {
        generateRandomOffsets();
    };

    vm.onStartRandomBatchClick = function () {
        if (vm.luckyCtrlPma.luckyBatchGenerationInterval) {
            $interval.cancel(vm.luckyCtrlPma.luckyBatchGenerationInterval);
            vm.luckyCtrlPma.luckyBatchGenerationInterval = null;
        } else {
            vm.luckyCtrlPma.luckyBatchGenerationInterval = $interval(function () {
                generateRandomOffsets();
            }, 20);
        }
    };

    //
    //
    //

    function generateRandomOffsets() {
        luckyService.currentChooser.generateRandomBarOffsets();
        populateBarOffsets();
        vm.luckyBarSumValue = luckyService.currentChooser.chosenValue.toString(10);
    }

    function populateBarOffsets() {
        vm.luckyBinchBarsOffsets = [];
        _.forEach(luckyService.currentChooser.binchBars, function (bb, i) {
            vm.luckyBinchBarsOffsets.push(bb.binchBarOffsetPx);
        });
    }

}]);

