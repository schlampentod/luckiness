var app = angular.module('luckynes', []);

/**
 *
 */
app.controller('luckyController', ['$scope', function ($scope) {
    var vm = this;

}]);


/**
 *
 */
app.directive('luckyDirective', ['$interval', 'dateFilter', function ($interval, dateFilter) {

    function link(scope, element, attrs) {
        var index = attrs["luckyDirective"];
        debugger;
    }

    return {
        link: link,
        templateUrl: 'luckyDirectiveTemplate.html'
    };
}]);