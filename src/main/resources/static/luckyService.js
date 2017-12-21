/**
 *
 */

app.service('luckyService', ['$timeout', 'luckyConstants', 'luckyFactory', '$http', function ($timeout, luckyConstants, luckyFactory, $http) {

    var srv = this;

    srv.currentChooser = binch;

    srv.myServiceFunc = function () {
        return luckyConstants.luckyConstant1;
    };



}]);