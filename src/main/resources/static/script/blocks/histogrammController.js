/**
 *
 */
app.controller('histogrammController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    vm.histogrammValues = new Array(10);
    vm.histogrammValues.fill(0);

    $scope.$on(luckyConstants.KEY_VALUE_CHANGED_EVT, function (event, args) {

        var newKeyVal = args.newChosenKey;

        vm.histogrammValues.fill(0);

        for (var i = 0; i < newKeyVal.length; i++) {
            var charAtI = parseInt(newKeyVal.charAt(i));
            vm.histogrammValues[charAtI] = vm.histogrammValues[charAtI] + 1;
        }

    });

}]);

