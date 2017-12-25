/**
 *
 */
app.controller('sequenceGeneratorController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    var MAX_GENERATED_KEYS = 10000;
    var ZERO_NUMBER = luckyService.currentChooser.ZERO_BIG_NUMBER;
    var MAX_NUMBER = luckyService.currentChooser.MAX_BIG_NUMBER;

    vm.KeySequenceTemplateRadix = {
        BINARY_RAD: "BINARY_RAD",
        DECIMAL_RAD: "DECIMAL_RAD",
        HEXADECIMAL_RAD: "HEXADECIMAL_RAD"
    };

    vm.allGenerationRadixes = [];
    _.forOwn(vm.KeySequenceTemplateRadix, function (value, key) {
        if (typeof value === "string") {
            vm.allGenerationRadixes.push(key);
        }
    });

    vm.KeySequenceGenerationStrategy = {
        CONCAT_STRATEGY: "CONCAT_STRATEGY",
        SUMMATION_STRATEGY: "SUMMATION_STRATEGY",
        MULTIPLICATION_STRATEGY: "MULTIPLICATION_STRATEGY"
    };

    vm.allGenerationStrategies = [];
    _.forOwn(vm.KeySequenceGenerationStrategy, function (value, key) {
        if (typeof value === "string") {
            vm.allGenerationStrategies.push(key);
        }
    });

    vm.allCheckedSequenceNames = [];

    vm.generationSequenceOnKeyPress = false;
    vm.generateAndTryAllStrategies = false;

    vm.generationSequenceRadix = vm.KeySequenceTemplateRadix.DECIMAL_RAD;
    vm.generationSequenceStrategy = vm.KeySequenceGenerationStrategy.CONCAT_STRATEGY;

    vm.generationSequenceTemplate = "";
    vm.generatedKeysSequence = [];
    vm.selectedGeneratedKey = null;


    $scope.onGenerationSequenceTemplateKeyDown = function (event) {

        if (event.keyCode == 38 || event.keyCode == 40) {

            var radix = getSelectedRadixVal();
            var oldValue = parseInt(vm.generationSequenceTemplate, radix) || 0;

            if (event.keyCode == 38) {
                vm.generationSequenceTemplate = (oldValue + 1).toString(radix).toUpperCase();
            } else if (event.keyCode == 40) {
                vm.generationSequenceTemplate = (oldValue - 1).toString(radix).toUpperCase();
            }
        }

    };

    vm.onGenerateNewSequence = function () {
        if (!vm.generationSequenceTemplate || vm.generationSequenceTemplate === "") {
            return;
        }

        var radix = getSelectedRadixVal();

        vm.generatedKeysSequence = [];

        var sum = null;

        var iterations = 0;

        while (iterations < MAX_GENERATED_KEYS && (sum == null || sum.lesserOrEquals(MAX_NUMBER))) {

            putNewGeneratedKey(sum);

            var prevStringVal = sum ? sum.toString(radix) : "";

            if (vm.generationSequenceStrategy === vm.KeySequenceGenerationStrategy.CONCAT_STRATEGY) {
                var newStringVal = prevStringVal + vm.generationSequenceTemplate;
                sum = bigInt(newStringVal, radix);
            } else if (vm.generationSequenceStrategy === vm.KeySequenceGenerationStrategy.SUMMATION_STRATEGY) {
                var prevBigVal = sum ? sum : bigInt(0);
                sum = prevBigVal.add(bigInt(vm.generationSequenceTemplate));
            } else if (vm.generationSequenceStrategy === vm.KeySequenceGenerationStrategy.MULTIPLICATION_STRATEGY) {
                var prevBigVal = sum ? sum : bigInt(1);
                sum = prevBigVal.multiply(bigInt(vm.generationSequenceTemplate, radix));
            } else {
                throw "Not implemented: " + vm.generationSequenceStrategy;
            }

            //console.info("Generated: " + sum.toString(10));
            iterations++;
        }

        vm.selectedGeneratedKey = vm.generatedKeysSequence[0];
    };

    vm.onTryAllGeneratedSequence = function () {
        var seqName = getGeneratedSequenceName();
        if (_.includes(vm.allCheckedSequenceNames, seqName)) {
            console.info("Sequence: " + seqName + " already checked..");
            return;
        }

        vm.allCheckedSequenceNames.push(seqName);

        $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: vm.generatedKeysSequence});
    };

    vm.onTemplateFieldKeyPressed = function ($event) {
        var keyCode = $event.which || $event.keyCode;

        if (vm.generationSequenceOnKeyPress || keyCode === 13) {
            vm.onGenerateNewSequenceAndTry();
            var inputElement = $event.target;
            if (!vm.generationSequenceOnKeyPress) {
                inputElement.setSelectionRange(0, inputElement.value.length)
            }
        }
    };

    vm.onGenerateNewSequenceAndTry = function () {

        if (vm.generateAndTryAllStrategies) {

            var origStrategy = vm.generationSequenceStrategy;

            _.forEach(vm.allGenerationStrategies, function (strategy, i) {

                if (vm.KeySequenceGenerationStrategy.SUMMATION_STRATEGY === strategy/*
                && vm.generationSequenceRadix === vm.KeySequenceTemplateRadix.BINARY_RAD*/) {
                    return;
                }

                vm.generationSequenceStrategy = strategy;
                generateSequenceAndTryStrategy();
            });

            vm.generationSequenceStrategy = origStrategy;
        } else {
            generateSequenceAndTryStrategy();
        }

    };

    vm.onTryGeneratedSequenceElement = function (element) {

    };

    //
    //
    //

    function generateSequenceAndTryStrategy() {
        vm.onGenerateNewSequence();
        vm.onTryAllGeneratedSequence();
    }

    function getSelectedRadixVal() {
        if (vm.generationSequenceRadix === vm.KeySequenceTemplateRadix.BINARY_RAD) {
            return 2;
        } else if (vm.generationSequenceRadix === vm.KeySequenceTemplateRadix.DECIMAL_RAD) {
            return 10;
        } else if (vm.generationSequenceRadix === vm.KeySequenceTemplateRadix.HEXADECIMAL_RAD) {
            return 16;
        } else {
            throw "Unexpected radix: " + vm.generationSequenceRadix;
        }
    }

    function getGeneratedSequenceName() {
        return vm.generationSequenceTemplate + "_" + vm.generationSequenceStrategy;
    }

    function putNewGeneratedKey(newBigKey) {
        if (!newBigKey) {
            return;
        }

        if (newBigKey.lesserOrEquals(ZERO_NUMBER)) {
            return;
        }

        var strValue = newBigKey.toString(10);
        // console.info("Adding: " + strValue);
        vm.generatedKeysSequence.push(strValue);
    }

}]);

