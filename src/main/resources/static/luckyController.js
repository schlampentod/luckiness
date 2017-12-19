/**
 *
 */
app.controller('luckyController', ['$scope', 'luckyService', 'luckyFactory', '$interval', function ($scope, luckyService, luckyFactory, $interval) {
    var vm = this;

    vm.luckyCtrlPma = {
        luckyTotalGeneratedKeys: 0,
        luckyBatchGenerationInterval: null
    };

    vm.luckyBarIndexes = new Array(26);

    vm.luckyBarOffsetValues = [];
    vm.luckyBarSumValue = luckyFactory.MIN_BTC_KEY;

    vm.luckyProvidedExactValue = "";

    _.forEach(vm.luckyBarIndexes, function (idx, i) {
        vm.luckyBarOffsetValues.push(500);
    });

    $scope.$watch(function () {
        return vm.luckyBarOffsetValues;
    }, function (newVal, oldVal) {
        //console.info(JSON.stringify(newVal));
        vm.luckyBarSumValue = luckyService.getSelectedLuckyValue(vm.luckyBarOffsetValues).toString(10);
    }, true);

    $scope.$watch(function () {
        return vm.luckyBarSumValue;
    }, function (newVal, oldVal) {
        vm.luckyCtrlPma.luckyTotalGeneratedKeys++;
        luckyService.checkKeyInBlockChain(newVal);
    });

    vm.onParseProvidedValueClick = function () {
        var parsedOffsets = luckyService.splitProvidedLuckyValue(vm.luckyProvidedExactValue);
        _.forEach(vm.luckyBarOffsetValues, function (idx, i) {
            vm.luckyBarOffsetValues[i] = parsedOffsets[i];
        });
    };

    vm.onGenerateMinClick = function () {
        _.forEach(vm.luckyBarOffsetValues, function (idx, i) {
            vm.luckyBarOffsetValues[i] = 0;
        });
    };

    vm.onGenerateMaxClick = function () {
        _.forEach(vm.luckyBarOffsetValues, function (idx, i) {
            vm.luckyBarOffsetValues[i] = 1000;// TODO fixme
        });
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
        _.forEach(vm.luckyBarOffsetValues, function (idx, i) {
            vm.luckyBarOffsetValues[i] = Math.floor(Math.random() * 1000);
        });
    }

}]);

