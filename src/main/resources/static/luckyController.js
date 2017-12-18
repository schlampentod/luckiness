/**
 *
 */
app.controller('luckyController', ['$scope', 'luckyService', 'luckyFactory', function ($scope, luckyService, luckyFactory) {
    var vm = this;

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

    vm.onParseProvidedValueClick = function () {
        var parsedOffsets = luckyService.splitProvidedLuckyValue(vm.luckyProvidedExactValue);
        _.forEach(vm.luckyBarOffsetValues, function (idx, i) {
            vm.luckyBarOffsetValues[i] = parsedOffsets[i];
        });
    };

    vm.onGenerateZeroClick = function () {
        _.forEach(vm.luckyBarOffsetValues, function (idx, i) {
            vm.luckyBarOffsetValues[i] = 0;
        });
    };

    vm.onGenerateRandomClick = function () {
        generateRandomOffsets();
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

