/**
 * <input type="text" ng-model="luckyCtrl.luckyBarsSameOffset" arrow-pressed-directive="onArrrowPressedHandler($direction)" ng-keydown="getkeySluckyBarsSameOffset($event)">
 */
app.directive('arrowPressedDirective', function () {

    return {
        link: function (scope, element, attrs) {
/*
            scope.onArrrowPressedHandler = function (event) {

                if (event.keyCode == 38) {
                    vm.luckyBarsSameOffset = oldValue + 1;
                } else if (event.keyCode == 40) {
                    vm.luckyBarsSameOffset = oldValue - 1;
                }
            };

            scope.getListOfCurrencies();*/
        }
    }
});