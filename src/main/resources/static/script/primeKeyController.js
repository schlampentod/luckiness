/**
 *
 */
app.controller('primeKeyController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    vm.luckyPrimeFormToggled = false;
    var currentIteration = bigInt(1);

    vm.primeGenerationStartFrom = null;

    vm.luckyPrimeGenerationInterval = null;

    $scope.$watch(function () {
        return vm.primeGenerationStartFrom;
    }, function (newVal, oldVal) {
        if (newVal) {
            currentIteration = bigInt(newVal);
        }
    });

    $scope.onGeneratePrimeNumber = function () {
        generateAndTryNextPrime();
    };

    $scope.onToggleGeneratingPrimeNumbers = function () {
        if (vm.luckyPrimeGenerationInterval) {
            $interval.cancel(vm.luckyPrimeGenerationInterval);
            vm.luckyPrimeGenerationInterval = null;
        } else {
            vm.luckyPrimeGenerationInterval = $interval(function () {
                generateAndTryNextPrime();
            }, 50);
        }
    };

    //
    //
    //

    function generateAndTryNextPrime() {
        var nexPrime = findNextPrime();
        if (nexPrime.lesserOrEquals(luckyService.currentChooser.MAX_BIG_NUMBER)) {
            $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [nexPrime.toString(10)]});
        } else {
            $scope.onToggleGeneratingPrimeNumbers();
            console.info("Terminated prime generating: max overflowed to: " + nexPrime.toString(10));
        }
    }

    function findNextPrime() {
        do {
            currentIteration = currentIteration.plus(1);
        } while (!currentIteration.isPrime());

        return currentIteration;
    }

}]);

