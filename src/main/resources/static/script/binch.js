/**
 * binch.js: Big Number Precise Chooser
 *
 * Depends on:
 * - https://github.com/peterolson/BigInteger.js
 * - JQuery
 * - Lo-dash
 */
(function (binch, $, undefined) {

    binch.BIG_ONE = bigInt("1");
    binch.ZERO_BIG_NUMBER = bigInt(0);
    binch.MIN_BIG_NUMBER = bigInt(1);
    binch.MAX_BIG_NUMBER = bigInt("115792089237316195423570985008687907852837564279074904382605163141518161494337");
    binch.BAR_LENGTH_PX = 1000;

    var barsNumber = 26; // TODO compute

    //
    // Public fields
    //

    binch.binchBars = new Array(barsNumber);
    binch.chosenValue = bigInt(0);

    //
    // Public methods
    //

    binch.getBinchBarOffsets = function () {
        var rv = [];
        _.forEach(binch.binchBars, function (bb, i) {
            rv.push(bb.binchBarOffsetPx);
        });
        return rv;
    };

    binch.setChooserBarsOffsets = function (barsOffsets) {

        _.forEach(binch.binchBars, function (bar, i) {
            bar.binchBarOffsetPx = barsOffsets[i];
        });

        binch.chosenValue = calcBarsSumValue(barsOffsets);
    };

    binch.setProvidedChosenStringValue = function (providedValueStr) {
        logInfo("ProvidedChosenStringValue: " + providedValueStr);
        var bigValue = bigInt(providedValueStr);
        binch.setChooserBarsOffsets(calcOffsetsBySumValue(bigValue));
    };

    binch.getBarDataByIndex = function (idx) {
        return binch.binchBars[idx];
    };

    //
    // Private functions
    //

    function init() {
        _.forEach(binch.binchBars, function (binchBar, i) {
            binch.binchBars[i] = generateBinchBar(i);
        });

        logInfo("initialized: " + binch.binchBars.length + " bars.");
    }

    function calcBarsSumValue(barOffsetValues) {
        var rv = bigInt(0);

        _.forEach(barOffsetValues, function (offsetVal, i) {
            var luckyBarNet = getLuckyBarNetValue(i, offsetVal);
            rv = rv.add(luckyBarNet);
        });

        return rv;
    }

    function calcOffsetsBySumValue(bigSumValue) {
        var newOffsets = new Array(barsNumber);

        /*var scale = binch.MAX_BIG_NUMBER;
        for (var i = 0; i < 26; i++) {
            newOffsets[i] = parseInt((bigSumValue.divmod(scale)).quotient.toString(10));

            bigSumValue = bigSumValue.subtract(scale.multiply((bigSumValue.divmod(scale)).quotient));
            scale = scale.divide(binch.BAR_LENGTH_PX);
        }*/

        for (var i = 0; i < barsNumber; i++) {

            var barRangeVal = getBarByIndex(i).binchBarSnippetRange;
            var barMaxVal = getLuckyBarNetValue(i, binch.BAR_LENGTH_PX);

            var barOffset = -1;

            if (bigSumValue.lesserOrEquals(barRangeVal)) {
                barOffset = 0;
            } else if (i = barsNumber - 1) {
                barOffset = bigSumValue;
            } else {
                debugger;
                var barAmount = bigSumValue.divmod(barRangeVal).quotient;
                barOffset = barAmount.divide(barRangeVal);
                bigSumValue = bigSumValue.minus(barAmount);
            }

            newOffsets[i] = parseInt(barOffset.toString(10));
        }

        debugger;
        logInfo('offsetsBySum: ' + newOffsets);

        return newOffsets;
    }

    function getLuckyBarNetValue(barIndex, offsetVal) {
        var rangeValue = getBarByIndex(barIndex).binchBarSnippetRange;
        return rangeValue.multiply(offsetVal);
    }

    function generateBinchBar(idx) {
        return {
            binchBarIndex: idx,
            binchBarLengthPx: binch.BAR_LENGTH_PX,
            binchBarOffsetPx: 500,
            binchBarSnippetRange: calcBarRangeValue(idx, binch.BAR_LENGTH_PX)
        }
    }

    function calcBarRangeValue(barIndex, slotsPerBar) {
        var divisor = bigInt(slotsPerBar).pow(barIndex + 1);

        if (binch.MAX_BIG_NUMBER.lesserOrEquals(divisor)) {
            return bigInt(1);
        } else {
            return binch.MAX_BIG_NUMBER.divide(divisor);
        }
    }

    function getBarByIndex(idx) {
        return binch.binchBars[idx];
    }

    function logInfo(msg) {
        console.info("binch.js: " + msg);
    }

    init();

}(window.binch = window.binch || {}, jQuery));

