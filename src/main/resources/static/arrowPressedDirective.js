/**
 * <input arrow-pressed-directive="onArrrowPressedHandler($direction)">
 */
app.directive('arrowPressedDirective', function () {
    return function (scope, element, attrs) {

        function onKeyDown(e) {

            var arrowDir;
            if (e.keyCode === 37) {
                arrowDir = "LEFT";
            } else if (e.keyCode === 39) {
                arrowDir = "RIGHT";
            } else if(e.keyCode === 38){
                arrowDir = "UP";
            } else if(e.keyCode === 40){
                arrowDir = "DOWN";
            }

            scope.$apply(function () {
                scope.$eval(attrs.arrowPressedDirective, {'$direction': arrowDir});
            });
        }

        scope.$on('$destroy', function () {
            $(element).unbind('keydown', onKeyDown);
        });

        $(element).keydown(onKeyDown);
    }
});