/**
 * binch.js: Big Number Precise Chooser
 *
 * Depends on:
 * - https://github.com/peterolson/BigInteger.js
 * - JQuery
 * - Lo-dash
 *
 * ScaleFactor - scale interval (ціна поділки)
 */
(function (binch, $, undefined) {

    //
    // Public constants
    //

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
            if (barsOffsets[i] < bar.binchBarMinOffsetPx) {
                bar.binchBarOffsetPx = bar.binchBarMinOffsetPx;
                console.info("Truncated bar [" + i + "] offset: from " + barsOffsets[i] + " to " + bar.binchBarOffsetPx);
            } else if (barsOffsets[i] > bar.binchBarMaxOffsetPx) {
                console.info("Truncated bar [" + i + "] offset: from " + barsOffsets[i] + " to " + bar.binchBarOffsetPx);
                bar.binchBarOffsetPx = bar.binchBarMaxOffsetPx;
            } else {
                bar.binchBarOffsetPx = barsOffsets[i];
            }
        });

        binch.chosenValue = calcBarsSumValue(barsOffsets);
    };

    binch.setProvidedChosenStringValue = function (providedValueStr) {
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

        binch.setChooserBarsOffsets(getDefaultInitialOffsets());

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

        // logInfo("calcOffsetsBySumValue: " + bigSumValue.toString(10));

        var newOffsets = new Array(barsNumber);

        for (var i = 0; i < barsNumber; i++) {

            var barScaleFactor = getBarByIndex(i).binchBarScaleFactor;

            var barOffset;

            if (isLastBar(i)) {
                barOffset = bigSumValue;
            } else {
                barOffset = bigSumValue.divmod(barScaleFactor).quotient;
                var barAmount = barOffset.multiply(barScaleFactor);
                bigSumValue = bigSumValue.minus(barAmount);
            }

            newOffsets[i] = parseInt(barOffset.toString(10));
        }

        logInfo('offsetsBySum: ' + newOffsets);

        return newOffsets;
    }

    function getLuckyBarNetValue(barIndex, offsetVal) {
        var scaleFactor = getBarByIndex(barIndex).binchBarScaleFactor;
        return scaleFactor.multiply(offsetVal);
    }

    function generateBinchBar(idx) {

        var barMainOffset = isLastBar(idx) ? 0 : 0;
        var barMaxOffset = isLastBar(idx) ? 114 : binch.BAR_LENGTH_PX - 1;
        var barScaleFactor = calcBarScaleFactor(idx, binch.BAR_LENGTH_PX);

        return {
            binchBarIndex: idx,
            binchBarMinOffsetPx: barMainOffset,
            binchBarMaxOffsetPx: barMaxOffset,
            binchBarOffsetPx: null,
            binchBarScaleFactor: barScaleFactor
        }
    }

    function calcBarScaleFactor(barIndex, slotsPerBar) {
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

    function isLastBar(idx) {
        return idx === (barsNumber - 1);
    }

    function getDefaultInitialOffsets() {
        var initialOffsets = new Array(barsNumber);
        initialOffsets.fill(binch.BAR_LENGTH_PX / 2);
        return initialOffsets;
    }

    init();

}(window.binch = window.binch || {}, jQuery));

