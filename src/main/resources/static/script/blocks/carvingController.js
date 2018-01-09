/**
 *
 */
app.controller('carvingController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    var MAX_NUMBER = luckyService.currentChooser.MAX_BIG_NUMBER;
    var BOARD_INITIAL_NUMBER = bigInt("57953998617275373084870362867211165091510292431969421612915497067826907655000");

    vm.maxNumStrBin = MAX_NUMBER.toString(2);
    vm.initialStrBin = BOARD_INITIAL_NUMBER.toString(2);

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

    function getFinalNumberBin() {
        var rv = "";
        _.forEach(vm.maxNumStrBinLines, function (lineArray, lineIdx) {
            _.forEach(lineArray, function (elem, elemIdx) {
                rv += elem;
            });
        });

        // console.info("getFinalNumber: " + rv);
        return rv;
    }

    function init() {

        initCarvingBoard();

        $scope.$watch(function () {
            return vm.maxNumStrBinLines;
        }, function (newVal, oldVal) {
           var finalNumBin =  getFinalNumberBin();
           var bn = bigInt(finalNumBin, 2);
           if(bn.lesserOrEquals(MAX_NUMBER)) {
               var bnDecStr = bn.toString(10);
               console.info("carved to: " + bnDecStr);
               $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [bnDecStr]});
           }else{
               initCarvingBoard();
           }

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

        console.info("Resetting carving board.");

        _.forEach(vm.maxNumStrBinLines, function (line, lineIdx) {
            vm.maxNumStrBinLines[lineIdx] = new Array(lineLength);
            var lineArray = vm.maxNumStrBinLines[lineIdx];

            _.forEach(lineArray, function (elem, elemIdx) {
                var charIdx = (lineIdx * lineLength) + elemIdx;
                //var char = vm.maxNumStrBin.charAt(charIdx);
                var char = vm.initialStrBin.charAt(charIdx);
                lineArray[elemIdx] = char;
            });
        });
    }

}]);

