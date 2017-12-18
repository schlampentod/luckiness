/**
 *
 */
app.directive('luckyDirective', ['$interval', 'dateFilter', function ($interval, dateFilter) {

    function link(scope, element, attrs) {

        var index = parseInt(attrs["luckyDirective"]);

        console.info("Created: " + index);

        scope.luckyBarId = "lucky_bar_" + index;
        scope.luckySliderId = "lucky_slider_" + index;

        element.mousemove(function (evt) {

            var offset  = evt.offsetX;
            var sliderElem = getLuckySliderElem();

            console.info("Moved: " + index + " to " + offset);

            sliderElem.css("margin-left", offset + "px");
        });

        element.click(function (evt) {
            console.info("Clicked: " + index);
        });

        function getLuckySliderElem() {
            var luckySliderElem = $("#" + scope.luckySliderId);
            return luckySliderElem;
        }
    }

    return {
        link: link,
        templateUrl: 'luckyDirectiveTemplate.html'
    };
}]);