/**
 *
 */
app.service('luckyService', ['$timeout', 'luckyConstants', function ($timeout, luckyConstants) {

    var srv = this;

    srv.myServiceFunc = function () {
        return luckyConstants.luckyConstant1;
    }
}]);