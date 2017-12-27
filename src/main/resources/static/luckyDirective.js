/**
 *
 */
app.directive('luckyDirective', ['$interval', 'luckyService', '$timeout', '$compile', '$parse', function ($interval, luckyService, $timeout, $compile, $parse) {

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

        scope.luckyBarIndex = index;
        scope.luckyBarId = "lucky_bar_" + index;
        scope.luckySliderId = "lucky_slider_" + index;

        scope.luckyBarRangeValue = luckyService.currentChooser.getBarDataByIndex(index).binchBarScaleFactor.toString(10);// luckyFactory.getSnippetRangeByIndex(index, luckyFactory.SLOTS_PER_BAR);
        scope.luckySliderOffset = 0;

        /*if (scope.luckyBarRange.keyRangeIsNonFull) {
            var customWidth = scope.luckyBarRange.keyRangeFrom + "px";
            $(element).width(customWidth);
        }*/

        // Subscribe
        getLuckyBarElem().mousemove(function (evt) {
            handleMotion(evt)
        });

        getLuckyBarElem().click(function (evt) {

            handleMotion(evt)
        });

        function handleMotion(evt) {

            if (evt.shiftKey) {

            }

            if (evt.ctrlKey || evt.type == "click" || detectLeftButton(evt)) {

                /*if (isOdd(index)) {
                    scope.luckySliderOffset = 1000 - evt.offsetX;
                } else {
                    scope.luckySliderOffset = evt.offsetX - 1;
                }
                */

                scope.luckySliderOffset = evt.offsetX - 1;
                onLuckySliderMoved(scope.luckySliderOffset);
            }

            if (evt.altKey) {

            }
        }

        function detectLeftButton(evt) {
            evt = evt || window.event;
            if ("buttons" in evt) {
                return evt.buttons == 1;
            }
            var button = evt.which || evt.button;
            return button == 1;
        }

        function onLuckySliderMoved(newOffset) {
            var sliderElem = getLuckySliderElem();

            // console.info("Moved: " + index + " to " + newOffset);

            //sliderElem.css("margin-left", (newOffset - 0) + "px");
            sliderElem.css("width", (newOffset - 0) + "px");

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

        scope.$watch(function () {
            return scope.luckySliderOffset;
        }, function (newValue, oldValue) {

            onLuckySliderMoved(newValue);

        }, true);

        function isOdd(num) {
            return num % 2;
        }
    }

    return {
        link: link,
        templateUrl: 'templates/binchBarTemplate.html',
        restrict: 'EA',
        require: 'ngModel'
    };
}]);