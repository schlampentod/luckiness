/**
 *
 */
app.controller('keyConversionController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;


    vm.luckyKeyConversionFormToggled = false;

    vm.onParseProvidedWIFKey = function (luckyWIFKeyForConversion) {
        addressAnalyticsService.convertWifKeyToDecimal(luckyWIFKeyForConversion).then(function (ConvertedKeyDto) {
            var convertedValue = ConvertedKeyDto['decimalKeyValue'];
            $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [convertedValue]});
        });
    };

    vm.onParseProvidedHEXKey = function(luckyHEXKeyForConversion){
        var luckyHEXKey_10 = bigInt(luckyHEXKeyForConversion.toString(), 16);
        $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [luckyHEXKey_10.toString(10)]});
    };

}]);

