/**
 *
 */
app.controller('digitsGeneratorController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    var MIN_DIGIT = 0;
    var MAX_DIGIT = 9;

    var MAX_NUMBER = luckyService.currentChooser.MAX_BIG_NUMBER;

    vm.luckyDigitsFormToggled = false;
    vm.luckyDigitsFormCtrlOnly = true;

    vm.digitGeneratorPiles;

    vm.digitGeneratorEnableReversing = 0;

    $scope.$on(luckyConstants.KEY_VALUE_CHANGED_EVT, function (event, args) {

        if (isValueChangedInternally()) {
            return;
        }

        var newKeyVal = args.newChosenKey;
        var newArray = convertKeyValueToPiles(newKeyVal);

        var mainArrMaxIdx = vm.digitGeneratorPiles.length - 1;
        var newArrMaxIdx = newArray.length - 1;

        var arrLenDiff = (mainArrMaxIdx - newArrMaxIdx);

        _.forEach(vm.digitGeneratorPiles, function (pileVal, i) {
            var mainArrIdx = i;
            var newArrIdx = (i - arrLenDiff);

            var pileNewVal;
            if (newArrIdx < 0) {
                pileNewVal = "0";
            } else {
                pileNewVal = newArray[newArrIdx];
            }

            vm.digitGeneratorPiles[mainArrIdx] = pileNewVal;
        });

    });

    vm.onDigitUpIncrement = function (idx, evt) {
        if (vm.luckyDigitsFormCtrlOnly && !evt.ctrlKey) {
            return;
        }
        var newVal = vm.digitGeneratorPiles[idx] + 1;
        if (newVal <= MAX_DIGIT) {
            vm.digitGeneratorPiles[idx] = newVal;
        }

        setValueChangedInternally();
    };

    vm.onDigitDownDecrement = function (idx, evt) {
        if (vm.luckyDigitsFormCtrlOnly && !evt.ctrlKey) {
            return;
        }
        var newVal = vm.digitGeneratorPiles[idx] - 1;
        if (newVal >= MIN_DIGIT) {
            vm.digitGeneratorPiles[idx] = newVal;
        }

        setValueChangedInternally();
    };

    initArray();

    //
    //
    //

    function convertKeyValueToPiles(keyValStr) {
        var numberLen = keyValStr.length;
        var newArray = new Array(numberLen);
        for (var i = 0; i < numberLen; i++) {
            newArray[i] = keyValStr.charAt(i);
        }
        return newArray;
    }

    function getCompleteValue() {
        var rv = "";
        _.forEach(vm.digitGeneratorPiles, function (digVal, i) {
            rv = rv + digVal;
        });

        while (rv.charAt(0) == '0') {
            rv = rv.substring(1);
        }
        return rv;
    }

    function initArray() {
        var pilesNumber = MAX_NUMBER.toString(10).length;

        console.info("Digit piles number: " + pilesNumber);

        vm.digitGeneratorPiles = new Array(pilesNumber);
        vm.digitGeneratorPiles.fill(1);

        $scope.$watch(function () {
            return vm.digitGeneratorPiles;
        }, function (newVal, oldVal) {
            onDigitsChangedInternally(newVal, oldVal);
        }, true);
    }

    function onDigitsChangedInternally(newVal, oldVal) {
        if (!vm.luckyDigitsFormToggled || !isValueChangedInternally()) {
            return;
        }

        var currentKeyValue = getCompleteValue();
        if (bigInt(currentKeyValue).lesserOrEquals(MAX_NUMBER)) {
            console.info("New digits value: " + currentKeyValue);
            $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [currentKeyValue]});
        } else {
            vm.digitGeneratorPiles = oldVal
        }
    }

    function setValueChangedInternally() {
        vm.digitGeneratorEnableReversing = new Date().getTime();
    }

    function isValueChangedInternally() {
        return (new Date().getTime() - vm.digitGeneratorEnableReversing) < 1000;
    }

}]);

