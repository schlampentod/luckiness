/**
 *
 */
app.controller('myFoundKeysListController', ['$scope', 'addressAnalyticsService', 'localStorageAccess', '$window','luckyConstants', function ($scope, addressAnalyticsService, localStorageAccess, $window, luckyConstants) {

    var vm = this;
    vm.foundkeysListFromLs = [];
    vm.selectedkLKCtrl = null;
    vm.foundkeysListFromLs = uniq(localStorageAccess.getArrayFromLocalStorage(luckyConstants.MATCHED_KEYS_LS));

    function uniq(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        })
    }

    $scope.$watch(function () {
        return $window.localStorage[luckyConstants.MATCHED_KEYS_LS];
    }, function (newValue, oldValue) {
        vm.foundkeysListFromLs = uniq(localStorageAccess.getArrayFromLocalStorage(luckyConstants.MATCHED_KEYS_LS));
    });

    vm.onFoundKeyPickedUp = function (keyValue) {
        vm.selectedkLKCtrl = keyValue;
        $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [keyValue]});
    };

}]);
