/**
 *
 */
app.controller('carvingController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    var MAX_NUMBER = luckyService.currentChooser.MAX_BIG_NUMBER;

    vm.maxNumStrBin = MAX_NUMBER.toString(2);

    var valueLength = vm.maxNumStrBin.length; // 256 bits
    var lineLength = 32; // 32 == 256 / 8;

    vm.maxNumStrBinLines = new Array(8);
    vm.digitGeneratorPressedKeyDigit = null;

    init();


    //
    //
    //

    function init() {

        _.forEach(vm.maxNumStrBinLines, function (line, lineIdx) {
            vm.maxNumStrBinLines[lineIdx] = new Array(lineLength);
            var lineArray = vm.maxNumStrBinLines[lineIdx]

            _.forEach(lineArray, function (elem, elemIdx) {
                var charIdx = (lineIdx * lineLength) + elemIdx;
                var char = vm.maxNumStrBin.charAt(charIdx);
                lineArray[elemIdx] = char;
            });
        });

        $(document).keypress(function (evt) {
            var charCode = evt.which || evt.keyCode;
            var char = String.fromCharCode(charCode);

            if (/[0-1]/g.test(char)) {
                vm.digitGeneratorPressedKeyDigit = parseInt(char);
            } else {
                vm.digitGeneratorPressedKeyDigit = null;
            }

            console.info("onDigitUpIncrement: " + vm.digitGeneratorPressedKeyDigit);
            $timeout($scope.$apply());
        });

        $(document).keyup(function (evt) {
            vm.digitGeneratorPressedKeyDigit = null;
            $timeout($scope.$apply());
        });
    }

}]);

