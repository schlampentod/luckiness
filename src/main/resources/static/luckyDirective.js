/**
 *
 */
app.directive('luckyDirective', ['$interval', 'luckyFactory', '$timeout', '$compile', '$parse', function ($interval, luckyFactory, $timeout, $compile, $parse) {

    function link(scope, element, attrs, ngModel) {

        var index = parseInt(attrs["luckyDirective"]);

        // console.info("Created: " + index);

        ngModel.$render = function () {
            var actualValue = ngModel.$modelValue;
            scope.luckySliderOffset = actualValue;
            $timeout(function () {
                onLuckySliderMoved(scope.luckySliderOffset);
            });
        };

        scope.luckyBarId = "lucky_bar_" + index;
        scope.luckySliderId = "lucky_slider_" + index;

        scope.luckyBarRangeValue = luckyFactory.getSnippetRangeByIndex(index, luckyFactory.SLOTS_PER_BAR);
        scope.luckySliderOffset = 0;

        /*if (scope.luckyBarRange.keyRangeIsNonFull) {
            var customWidth = scope.luckyBarRange.keyRangeFrom + "px";
            $(element).width(customWidth);
        }*/

        // Subscribe
        getLuckyBarElem().mousemove(function (evt) {
            scope.luckySliderOffset = evt.offsetX;
            onLuckySliderMoved(scope.luckySliderOffset);
        });

        function onLuckySliderMoved(newOffset) {
            var sliderElem = getLuckySliderElem();

            // console.info("Moved: " + index + " to " + newOffset);

            sliderElem.css("margin-left", (newOffset - 0) + "px");

            if (newOffset !== ngModel.$viewValue) {
                scope.$evalAsync(function () {
                    ngModel.$setViewValue(newOffset);
                });
            }
        }

        // Subscribe
        getLuckyBarElem().click(function (evt) {
            console.info("Clicked: " + index);
        });

        function getLuckySliderElem() {
            var luckySliderElem = $("#" + scope.luckySliderId);
            return luckySliderElem;
        }

        function getLuckyBarElem() {
            return element.find(".lucky_bar");
        }

        scope.$watch(function () {
            return ngModel.$modelValue;
        }, function (newValue, oldValue) {
            if (scope.luckySliderOffset !== newValue) {
                debugger;
            }
        }, true);
    }

    return {
        link: link,
        templateUrl: 'luckyDirectiveTemplate.html',
        restrict: 'EA',
        require: 'ngModel'
    };
}]);