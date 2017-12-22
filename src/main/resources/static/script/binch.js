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

    var chooserBarsNumber = 26; // TODO compute

    //
    // Public fields
    //

    binch.binchBars = new Array(chooserBarsNumber);
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

        binch.chosenValue = getSelectedLuckyValue(barsOffsets);
    };

    binch.setProvidedChosenStringValue = function (providedValue) {

        logInfo("ProvidedChosenStringValue: " + providedValue);

        var bigValue = bigInt(providedValue);

        binch.chosenValue = bigValue;

        var newOffsets = new Array(26);

        var scale = binch.MAX_BIG_NUMBER;
        for (var i = 0; i < 26; i++) {
            newOffsets[i] = parseInt((bigValue.divmod(scale)).quotient.toString(10));

            bigValue = bigValue.subtract(scale.multiply((bigValue.divmod(scale)).quotient));
            scale = scale.divide(binch.BAR_LENGTH_PX);
        }

        binch.setChooserBarsOffsets(newOffsets);
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

    function logInfo(msg) {
        console.info("binch.js: " + msg);
    }

    function getSelectedLuckyValue(barOffsetValues) {
        var rv = bigInt(0);

        _.forEach(barOffsetValues, function (offsetVal, i) {
            var luckyBarNet = getLuckyBarNetValue(offsetVal, i, binch.BAR_LENGTH_PX);
            rv = rv.add(luckyBarNet);
        });

        return rv;
    }

    function getLuckyBarNetValue(offsetVal, barIndex, slotsPerBar) {
        var rangeValue = getSnippetRangeByIndex(barIndex, slotsPerBar);
        return rangeValue.multiply(offsetVal);
    }

    function getSnippetRangeByIndex(barIndex, slotsPerBar) {

        var divisor = bigInt(slotsPerBar).pow(barIndex + 1);

        if (binch.MAX_BIG_NUMBER.lesserOrEquals(divisor)) {
            return bigInt(1);
        } else {
            return binch.MAX_BIG_NUMBER.divide(divisor);
        }
    }

    function generateBinchBar(idx) {
        return {
            binchBarIndex: idx,
            binchBarLengthPx: binch.BAR_LENGTH_PX,
            binchBarOffsetPx: 500,
            binchBarSnippetRange: getSnippetRangeByIndex(idx, binch.BAR_LENGTH_PX).toString(10)
        }
    }


    init();

}(window.binch = window.binch || {}, jQuery));

