/**
 *
 */
app.controller('myFoundKeysListController', ['$scope', 'addressAnalyticsService', 'localStorageAccess', '$window', 'luckyConstants', '$localStorage', '$interval', function ($scope, addressAnalyticsService, localStorageAccess, $window, luckyConstants, $localStorage, $interval) {

    var vm = this;
    vm.foundkeysListFromLs = [];
    vm.selectedkLKCtrl = null;
    vm.foundkeysListFromLs = null;

    function uniq(a) {
        return a.sort().filter(function (item, pos, ary) {
            return !pos || item != ary[pos - 1];
        })
    }

    vm.funcInterval = function(){
        vm.foundkeysListFromLs = uniq(localStorageAccess.getArrayFromLocalStorage(luckyConstants.MATCHED_KEYS_LS))
    };

    $interval(vm.funcInterval, 1000);

    vm.onFoundKeyPickedUp = function (keyValue) {
        vm.selectedkLKCtrl = keyValue;
        $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [keyValue]});
    };

    vm.onDelKeyPickedUp = function (indexFoundKey) {
        //debugger;
        vm.funcInterval();
        vm.foundkeysListFromLs.splice(indexFoundKey, 1);
        localStorageAccess.setObjectToLocalStorage(luckyConstants.MATCHED_KEYS_LS, vm.foundkeysListFromLs);
    }

}]);
