/**
 *
 */
app.controller('luckyController', ['$scope', 'luckyService', function ($scope, luckyService) {
    var vm = this;

    vm.luckyBarIndexes = new Array(26);

    vm.luckyBarOffsetValues = [];

    _.forEach(vm.luckyBarIndexes, function (idx, i) {
        vm.luckyBarOffsetValues.push(500);
    });

    $scope.$watch(function () {
        return vm.luckyBarOffsetValues;
    }, function (newVal, oldVal) {
        console.info(JSON.stringify(newVal));
    }, true);

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

