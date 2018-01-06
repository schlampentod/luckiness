/**
 *
 */
app.controller('generationTabsController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout) {

    var vm = this;

    vm.KeyGenerationTabName = {
        BLOCK_FOR_CALCULATOR: "BLOCK_FOR_CALCULATOR",
        CONTROL_LODASH_KEYS: "CONTROL_LODASH_KEYS",
        DIGITS_GENERATOR_TEMPLATE: "DIGITS_GENERATOR_TEMPLATE",
        DUMMY_KEYS_TEMPLATE: "DUMMY_KEYS_TEMPLATE",
        KEY_CONVERSION_TEMPLATE: "KEY_CONVERSION_TEMPLATE",
        KNOWN_TEMPLATE: "KNOWN_TEMPLATE",
        NUMBER_TRIMMER_TEMPLATE: "NUMBER_TRIMMER_TEMPLATE",
        PRIME_TEMPLATE: "PRIME_TEMPLATE",
        RANDOM_TEMPLATE: "RANDOM_TEMPLATE",
        SEQUENCE_GENERATOR_TEMPLATE: "SEQUENCE_GENERATOR_TEMPLATE"
    };

    vm.selectedGenerationTemplate = null;

}]);

