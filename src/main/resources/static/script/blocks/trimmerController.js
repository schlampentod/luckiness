/**
 *
 */
app.controller('trimmerController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    var MAX_NUMBER = luckyService.currentChooser.MAX_BIG_NUMBER;

    vm.trimmingNumberValue = "57953998617275373084870362867211165091510292431969421612915497067826907655000";

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

            //var newValueSubCut = "1" + newValue;
            /*while (bigInt(newValueSubCut).lesserOrEquals(MAX_NUMBER)) {
                keysToCheck.push(newValueSubCut);
                newValueSubCut = "1" + newValueSubCut;
            }*/

        } else {

            var newValueCut = newValue;
            while (MAX_NUMBER.lesserOrEquals(bigInt(newValueCut))) {
                newValueCut = newValueCut.substring(1);
            }

            keysToCheck.push(newValueCut);

            newValueCut = newValueCut.substring(1);
            keysToCheck.push(newValueCut);

            var newValueSubCut = "1" + newValueCut;

            while (bigInt(newValueSubCut).lesserOrEquals(MAX_NUMBER)) {
                keysToCheck.push(newValueSubCut);
                newValueSubCut = "1" + newValueSubCut;
            }

            //console.info("Trimmed to: " + keysToCheck);
        }

        $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: keysToCheck});
    }

}]);

