/**
 *
 */
app.controller('topMenuController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout) {

    var vm = this;


    $scope.changeLanguage = function (lang) {
        $translate.use(lang);
    };

}]);

