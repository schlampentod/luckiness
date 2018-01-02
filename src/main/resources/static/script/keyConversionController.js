/**
 *
 */
app.controller('keyConversionController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    var MAX_NUMBER = luckyService.currentChooser.MAX_BIG_NUMBER;

    vm.luckyKeyConversionFormToggled = false;

    vm.luckyWIFKeyForConversion = null;
    vm.luckyHEXKeyForConversion = null;

    $scope.$watch(function () {
        return vm.luckyHEXKeyForConversion;
    }, function (newVal, oldVal) {
        if (!newVal) {
            return;
        }
        var luckyHEXKey_10 = bigInt(newVal, 16);
        if (luckyHEXKey_10.lesserOrEquals(MAX_NUMBER)) {
            $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [luckyHEXKey_10.toString(10)]});
        } else {
            vm.luckyHEXKeyForConversion = MAX_NUMBER.toString(16).toUpperCase();
        }

    });

    vm.onParseProvidedWIFKey = function (luckyWIFKey) {
        addressAnalyticsService.convertWifKeyToDecimal(luckyWIFKey).then(function (ConvertedKeyDto) {
            var convertedValue = ConvertedKeyDto['decimalKeyValue'];
            $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [convertedValue]});
        });
    };

    vm.onParseProvidedHEXKey = function (luckyHEXKey) {

    };

}]);

