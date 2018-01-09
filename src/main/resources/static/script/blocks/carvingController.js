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

    vm.carvingToolUsingDigit = 0;

    vm.onResetCarveBoardElement = function (rowIdx, elemIdx) {
        vm.maxNumStrBinLines[rowIdx][elemIdx] = "" + vm.carvingToolUsingDigit;
    };

    vm.onResetCarvingBoard = function () {
        initCarvingBoard();
    };

    init();


    //
    //
    //

    function getFinalNumber() {

    }

    function init() {

        initCarvingBoard();

        $scope.$watch(function () {
            return vm.maxNumStrBinLines;
        }, function (newVal, oldVal) {
            getFinalNumber();
        }, true);

        $(document).keypress(function (evt) {
            var charCode = evt.which || evt.keyCode;
            var char = String.fromCharCode(charCode);

            if (/[1]/g.test(char)) {
                vm.carvingToolUsingDigit = parseInt(char);
            } else {
                vm.carvingToolUsingDigit = 0;
            }

            // console.info("onDigitUpIncrement: " + vm.carvingToolUsingDigit);

            $timeout($scope.$apply());
        });

        $(document).keyup(function (evt) {
            vm.carvingToolUsingDigit = 0;
            $timeout($scope.$apply());
        });
    }

    function initCarvingBoard() {

        _.forEach(vm.maxNumStrBinLines, function (line, lineIdx) {
            vm.maxNumStrBinLines[lineIdx] = new Array(lineLength);
            var lineArray = vm.maxNumStrBinLines[lineIdx];

            _.forEach(lineArray, function (elem, elemIdx) {
                var charIdx = (lineIdx * lineLength) + elemIdx;
                var char = vm.maxNumStrBin.charAt(charIdx);
                lineArray[elemIdx] = char;
            });
        });
    }

}]);

