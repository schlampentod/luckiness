/**
 *
 */
app.controller('luckyController', ['$scope', 'luckyService', function ($scope, luckyService) {
    var vm = this;

    vm.luckyBarIndexes = new Array(26);

    vm.onGenerateRandomClick = function () {
        var someVal = luckyService.myServiceFunc();
    };

}]);

