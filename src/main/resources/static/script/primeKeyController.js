/**
 *
 */
app.controller('primeKeyController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    vm.luckyPrimeFormToggled = false;
    var currentIteration = bigInt(1);

    vm.primeGenerationStartFrom = null;

    $scope.$watch(function () {
        return vm.primeGenerationStartFrom;
    }, function (newVal, oldVal) {
        currentIteration = bigInt(newVal);
    });

    $scope.onGeneratePrimeNumber = function () {
        var primeKey = findNextPrime().toString(10);
        $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [primeKey]});
    };

    $scope.onStartGeneratingPrimeNumbers = function () {
        var primeKey = findNextPrime().toString(10);
        $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [primeKey]});
    };

    //
    //
    //

    function findNextPrime() {
        do {
            currentIteration = currentIteration.plus(1);
        } while (!currentIteration.isPrime())

        return currentIteration;
    }

}]);

