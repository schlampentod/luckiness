/**
 *
 */
app.controller('digitsGeneratorController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    var MIN_DIGIT = 0;
    var MAX_DIGIT = 9;

    var MAX_NUMBER = luckyService.currentChooser.MAX_BIG_NUMBER;

    vm.luckyDigitsFormToggled = false;
    vm.luckyDigitsFormCtrlOnly = false;

    vm.luckyDigitsArray;

    vm.onDigitUpIncrement = function (idx, evt) {
        if (vm.luckyDigitsFormCtrlOnly && !evt.ctrlKey) {
            return;
        }
        var newVal = vm.luckyDigitsArray[idx] + 1;
        if (newVal <= MAX_DIGIT) {
            vm.luckyDigitsArray[idx] = newVal;
        }
    };

    vm.onDigitDownDecrement = function (idx, evt) {
        if (vm.luckyDigitsFormCtrlOnly && !evt.ctrlKey) {
            return;
        }
        var newVal = vm.luckyDigitsArray[idx] - 1;
        if (newVal >= MIN_DIGIT) {
            vm.luckyDigitsArray[idx] = newVal;
        }
    };

    initArray();

    //
    //
    //

    function getCompleteValue() {
        var rv = "";
        _.forEach(vm.luckyDigitsArray, function (digVal, i) {
            rv = rv + digVal;
        });

        return rv;
    }

    function initArray() {
        vm.luckyDigitsArray = new Array(MAX_NUMBER.toString(10).length);
        vm.luckyDigitsArray.fill(1);

        $scope.$watch(function () {
            return vm.luckyDigitsArray;
        }, function (newVal, oldVal) {

            if (!vm.luckyDigitsFormToggled) {
                return;
            }

            var currentKeyValue = getCompleteValue();
            if (bigInt(currentKeyValue).lesserOrEquals(MAX_NUMBER)) {
                // console.info("New digits value: " + currentKeyValue);
                $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [currentKeyValue]});
            } else {

                vm.luckyDigitsArray = oldVal;
            }
        }, true);
    }

}]);

