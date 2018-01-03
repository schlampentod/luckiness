app.controller('controlLodashKeysController', ['$scope', 'addressAnalyticsService', 'localStorageAccess', '$window','luckyConstants', function ($scope, addressAnalyticsService, localStorageAccess, $window, luckyConstants) {

    var vm = this;
    vm.mussOfKiss = [];
    vm.selectedkLKCtrl = null;
    vm.mussOfKiss = uniq(localStorageAccess.getArrayFromLocalStorage("matched_keys"));

    function uniq(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        })
    }

    $scope.$watch(function () {
        return $window.localStorage[luckyConstants.MATCHED_KEYS_LS];
    }, function (newValue, oldValue) {
        vm.mussOfKiss = uniq(localStorageAccess.getArrayFromLocalStorage(luckyConstants.MATCHED_KEYS_LS));
    });

    vm.onSelectkLKCtrl = function (keyValue) {
        vm.selectedkLKCtrl = keyValue;
        $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [keyValue]});
    };

}]);
