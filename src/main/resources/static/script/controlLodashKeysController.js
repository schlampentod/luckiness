app.controller('controlLodashKeysController', ['$scope', 'addressAnalyticsService', 'localStorageAccess', '$window', function ($scope, addressAnalyticsService, localStorageAccess, $window) {

    var vm = this;
    vm.mussOfKiss = [];
    //localStorageAccess.setStringToLocalStorage("About", "Grisha");
    vm.goFromLodashToView = function(){
        //vm.mussOfKiss[0]=localStorageAccess.getArrayFromLocalStorage("About Grisha");
        //alert(localStorageAccess.getArrayFromLocalStorage('A'));
        _.forEach($window.localStorage, function(value, key) {
            vm.mussOfKiss[key]=$window.localStorage.key(key);
        });

    };
}]);
