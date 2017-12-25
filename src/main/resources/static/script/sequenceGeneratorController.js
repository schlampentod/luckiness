/**
 *
 */
app.controller('sequenceGeneratorController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout) {

    var vm = this;

    var MIN_NUMBER = luckyService.currentChooser.MIN_BIG_NUMBER;
    var MAX_NUMBER = luckyService.currentChooser.MAX_BIG_NUMBER;

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

    vm.generationSequenceStrategy = vm.KeySequenceGenerationStrategy.CONCAT_STRATEGY;
    vm.generationSequenceTemplate = "";
    vm.generatedKeysSequence = [];
    vm.selectedGeneratedKey = null;

    vm.onGenerateNewSequence = function () {
        vm.generatedKeysSequence = [];

        var sum = MIN_NUMBER;

        while (sum.lesserOrEquals(MAX_NUMBER)) {

            putNewGeneratedKey(sum);

            if (vm.generationSequenceStrategy === vm.KeySequenceGenerationStrategy.CONCAT_STRATEGY) {
                var newStringVal = sum.toString(10) + vm.generationSequenceTemplate;
                sum = bigInt(newStringVal);
            } else {
                throw "Not implemented: " + vm.generationSequenceStrategy;
            }
        }

        vm.selectedGeneratedKey = vm.generatedKeysSequence[0];
    };

    vm.onTryAllGeneratedSequence = function () {

    };

    vm.onTryGeneratedSequenceElement = function (element) {

    };

    //
    //
    //

    function putNewGeneratedKey(newBigKey) {
        var strValue = newBigKey.toString(10);
        console.info("Addding: " + strValue);
        vm.generatedKeysSequence.push(strValue);
    }

}]);

