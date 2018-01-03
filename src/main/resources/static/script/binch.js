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
    binch.GLOBAL_DIVISOR = bigInt(1000); //
    binch.BAR_LENGTH_PX = binch.GLOBAL_DIVISOR - 1; // bar width

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
                // console.info("Truncated bar [" + i + "] offset: from " + barsOffsets[i] + " to " + bar.binchBarOffsetPx);
            } else if (barsOffsets[i] > bar.binchBarMaxOffsetPx) {
                // console.info("Truncated bar [" + i + "] offset: from " + barsOffsets[i] + " to " + bar.binchBarOffsetPx);
                bar.binchBarOffsetPx = bar.binchBarMaxOffsetPx;
            } else {
                bar.binchBarOffsetPx = barsOffsets[i];
            }
        });

        binch.chosenValue = calcBarsSumValue(binch.getBinchBarOffsets());
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

        var remainValue = binch.MAX_BIG_NUMBER;
        _.forEach(binch.binchBars, function (binchBar, i) {
            var BinchBar = generateBinchBar(i, remainValue);
            binch.binchBars[i] = BinchBar;
            remainValue = BinchBar.binchBarRemainValueAfter;
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
                var bar = binch.binchBars[i];
                barOffset = bigInt.min(bigSumValue.divmod(barScaleFactor).quotient/*.minus(bigInt(1))*/, bar.binchBarMaxOffsetPx);
                var barAmount = barOffset.multiply(barScaleFactor);
                bigSumValue = bigSumValue.minus(barAmount);
            }

            newOffsets[i] = parseInt(barOffset.toString(10));
        }

        //logInfo('new offsets: ' + newOffsets);

        return newOffsets;
    }

    function getLuckyBarNetValue(barIndex, offsetVal) {
        var scaleFactor = getBarByIndex(barIndex).binchBarScaleFactor;
        return scaleFactor.multiply(offsetVal);
    }

    function generateBinchBar(idx, remainValue) {

        var fractionValue = calcBarScaleFactor(remainValue); // ;
        var consumingValue = binch.GLOBAL_DIVISOR.multiply(fractionValue);
        var maxPossibleValue = consumingValue.minus(fractionValue);
        var remainForNext = remainValue.minus(maxPossibleValue);

        var barMainOffset = /*isLastBar(idx) ? 0 : */0;
        var barMaxOffset = isLastBar(idx) ? 646 : binch.BAR_LENGTH_PX;

        return {
            binchBarIndex: idx,
            binchBarMinOffsetPx: barMainOffset,
            binchBarMaxOffsetPx: barMaxOffset,
            binchBarOffsetPx: null,
            binchBarScaleFactor: fractionValue, //barScaleFactor,
            binchBarMaxValue: maxPossibleValue, //maxValue,
            binchBarRemainValueBefore: remainValue,
            binchBarRemainValueAfter: remainForNext //remainValue.minus(maxValue)
        }
    }

    function calcBarScaleFactor(remainValue) {
        if (remainValue.lesserOrEquals(binch.GLOBAL_DIVISOR)) {
            return bigInt(1);
        } else {
            return remainValue.divide(binch.GLOBAL_DIVISOR);
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
        initialOffsets.fill(Math.ceil(binch.GLOBAL_DIVISOR / 2));
        return initialOffsets;
    }

    init();

}(window.binch = window.binch || {}, jQuery));


/*

115792089237316195423570985008687907852837564279074904382605163141518161494337

115792089237316195423570985008687907852837564279074904382605163141518161494
115792089237316195423570985008687907852837564279074904382605163141518161
231584178474632390847141970017375815705675128558149808765210326283036
115792089237316195423570985008687907852837564279074904382605163141
115792089237316195423570985008687907852837564279074904382605163
115792089237316195423570985008687907852837564279074904382605
115792089237316195423570985008687907852837564279074904382
115792089237316195423570985008687907852837564279074904
115792089237316195423570985008687907852837564279074
115792089237316195423570985008687907852837564279
115792089237316195423570985008687907852837564
115792089237316195423570985008687907852837
115792089237316195423570985008687907852
115792089237316195423570985008687907
115792089237316195423570985008687
115792089237316195423570985008
115792089237316195423570985
115792089237316195423570
115792089237316195423
115792089237316195
115792089237316
115792089237
115792089
115792
115
1

*/

