/**
 *
 */
app.controller('trimmerController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    var MAX_NUMBER = luckyService.currentChooser.MAX_BIG_NUMBER;


    vm.luckyNumberTrimmerToggled = false;

    vm.trimmingNumberValue = null;

    $scope.$watch(function () {
        return vm.trimmingNumberValue
    }, function (newVal, oldVal) {
        onTrimmingNumberChanged(vm.trimmingNumberValue);
    });

    //
    //
    //

    function onTrimmingNumberChanged(newValue) {

        if (!newValue || newValue === "") {
            return;
        }

        var keysToCheck = [];

        var newValueBig = bigInt(newValue, 10);

        if (newValueBig.lesserOrEquals(MAX_NUMBER)) {
            keysToCheck.push(newValue);
        } else {

            var newValueCut = newValue;
            var newValueBigCut = bigInt(newValueCut);
            while (MAX_NUMBER.lesserOrEquals(newValueBigCut)) {
                newValueCut = newValueCut.substring(1);
                newValueBigCut = bigInt(newValueCut);
            }

            var newValueSubCut = newValueCut;

            while (newValueSubCut.length > 76) {
                newValueSubCut = newValueSubCut.substring(1);
                keysToCheck.push(newValueSubCut);
            }

            keysToCheck.push(newValueCut);

            //console.info("Trimmed to: " + keysToCheck);
        }

        $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: keysToCheck});
    }

}]);

