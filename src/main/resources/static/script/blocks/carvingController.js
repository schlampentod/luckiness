/**
 *
 */
app.controller('carvingController', ['$scope', 'luckyService', 'luckyFactory', '$interval', '$http', '$translate', 'addressAnalyticsService', '$window', 'keyGenerationService', '$timeout', 'luckyConstants', function ($scope, luckyService, luckyFactory, $interval, $http, $translate, addressAnalyticsService, $window, keyGenerationService, $timeout, luckyConstants) {

    var vm = this;

    vm.watchForBinchChanges = false;
    vm.keepingInProbableRange = true;

    var minFeasibleNum = bigInt("1000000000000000000000000000000000000000000000000000000000000000000000000000");

    var MAX_NUMBER = luckyService.currentChooser.MAX_BIG_NUMBER;
    var BOARD_INITIAL_NUMBER = MAX_NUMBER.minus(bigInt("1"));

    vm.maxNumStrBin = MAX_NUMBER.toString(2);

    var valueLength = vm.maxNumStrBin.length; // 256 bits

    vm.carvingLinesNumber = 16; // 8, 16, 32

    vm.maxNumStrBinLines = new Array(vm.carvingLinesNumber);

    vm.carvingToolUsingDigit = null;

    vm.onResetCarveBoardElement = function (rowIdx, elemIdx) {
        vm.watchForBinchChanges = false;
        setElementValue(rowIdx, elemIdx);
    };

    vm.onResetCarveBoardLine = function (rowIdx) {
        vm.watchForBinchChanges = false;
        _.forEach(vm.maxNumStrBinLines[rowIdx], function (lineArray, elemIdx) {
            setElementValue(rowIdx, elemIdx);
        });
    };

    vm.onResetCarvingBoard = function () {
        vm.watchForBinchChanges = false;
        initCarvingBoard(BOARD_INITIAL_NUMBER.toString(2));
    };

    init();


    //
    //
    //

    function setElementValue(rowIdx, elemIdx) {
        if (vm.carvingToolUsingDigit == null) {
            return;
        }
        vm.maxNumStrBinLines[rowIdx][elemIdx] = "" + vm.carvingToolUsingDigit;
    }

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

        initCarvingBoard(BOARD_INITIAL_NUMBER.toString(2));

        $scope.$watch(function () {
            return vm.maxNumStrBinLines;
        }, function (newVal, oldVal) {

            if (vm.watchForBinchChanges) {
                return;
            }

            var finalNumBin = getFinalNumberBin();
            var bn = bigInt(finalNumBin, 2);

            if (!vm.keepingInProbableRange
                || (bn.lesserOrEquals(MAX_NUMBER) && minFeasibleNum.lesserOrEquals(bn))) {

                var bnDecStr = bn.toString(10);
                /// console.info("carved to: " + bnDecStr);
                $scope.$emit(luckyConstants.TRY_KEYS_SEQUENCE_EVT, {keysArrayToTry: [bnDecStr]});
            } else {
                initCarvingBoard(BOARD_INITIAL_NUMBER.toString(2));
            }

        }, true);

        $scope.$watch(function () {
            return vm.carvingLinesNumber;
        }, function (newVal, oldVal) {
            if (newVal && oldVal) {
                reSizeCarvingBoard();
                $("select").blur();
            }
        });

        $(document).keypress(function (evt) {
            var charCode = evt.which || evt.keyCode;
            var char = String.fromCharCode(charCode);

            if (/[1]/g.test(char)) {
                vm.carvingToolUsingDigit = "1";
            } else if (/[2]/g.test(char) || /[0]/g.test(char)) {
                vm.carvingToolUsingDigit = "0";
            } else {
                vm.carvingToolUsingDigit = null;
            }

            // console.info("onDigitUpIncrement: " + vm.carvingToolUsingDigit);

            $timeout($scope.$apply());
        });

        $(document).keyup(function (evt) {
            vm.carvingToolUsingDigit = null;
            $timeout($scope.$apply());
        });

        $scope.$on(luckyConstants.KEY_VALUE_CHANGED_EVT, function (event, args) {

            if (!vm.watchForBinchChanges) {
                return;
            }

            var newKeyVal = args.newChosenKey;
            var newKeyValBin = bigInt(newKeyVal).toString(2);
            initCarvingBoard(newKeyValBin);
        });


        $scope.$watch(function () {
            return vm.watchForBinchChanges;
        }, function (newVal, oldVal) {
            if (vm.watchForBinchChanges) {
                vm.keepingInProbableRange = false;
            }
        });
    }

    function reSizeCarvingBoard() {

        var currentVal = getFinalNumberBin();
        // BOARD_INITIAL_NUMBER.toString(2)
        initCarvingBoard(currentVal);
    }

    function initCarvingBoard(initialStrBin) {

        while (initialStrBin.length < valueLength) {
            initialStrBin = "0" + initialStrBin;
        }

        console.info("Resetting carving board.");

        var lineLength = valueLength / vm.carvingLinesNumber;

        vm.maxNumStrBinLines = new Array(vm.carvingLinesNumber);

        _.forEach(vm.maxNumStrBinLines, function (line, lineIdx) {
            vm.maxNumStrBinLines[lineIdx] = new Array(lineLength);
            var lineArray = vm.maxNumStrBinLines[lineIdx];

            _.forEach(lineArray, function (elem, elemIdx) {

                var charIdx = (lineIdx * lineLength) + elemIdx;

                var char = initialStrBin.charAt(charIdx);
                lineArray[elemIdx] = char;
            });
        });
    }

}]);

