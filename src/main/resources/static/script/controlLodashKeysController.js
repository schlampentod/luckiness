app.controller('controlLodashKeysController', ['$scope', 'addressAnalyticsService', 'localStorageAccess', '$window', function ($scope, addressAnalyticsService, localStorageAccess, $window) {

    var vm = this;
    vm.mussOfKiss = [];
    vm.goFromLodashToView = function(){
        vm.mussOfKiss =localStorageAccess.getArrayFromLocalStorage("matched_keys");
    };
}]);
