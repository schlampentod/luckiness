/**
 * binch.js: Big Number Precise Chooser
 *
 * Depends on:
 * - https://github.com/peterolson/BigInteger.js
 * - JQuery
 * - Lo-dash
 */
(function (binch, $, undefined) {

    var BIG_ONE = bigInt("1");

    var ZERO_BIG_NUMBER = bigInt(0);
    var MIN_BIG_NUMBER = bigInt(1);
    var MAX_BIG_NUMBER = bigInt("115792089237316195423570985008687907852837564279074904382605163141518161494337");

    var barLengthPx = 1000;

    var chooserBarsNumber = 26; // TODO compute

    //
    // Public fields
    //

    binch.binchBars = new Array(chooserBarsNumber);
    binch.chosenValue = bigInt(0);

    //
    // Public methods
    //

    binch.incrementChosenValue = function () {
        binch.chosenValue = binch.chosenValue.add(BIG_ONE);
        binch.setProvidedChosenStringValue(binch.chosenValue.toString(10));
    };

    binch.decrementChosenValue = function () {
        binch.chosenValue = binch.chosenValue.subtract(BIG_ONE);
        binch.setProvidedChosenStringValue(binch.chosenValue.toString(10));
    };

    binch.setChooserBarsOffsets = function (barsOffsets) {

        _.forEach(binch.binchBars, function (bar, i) {
            bar.binchBarOffsetPx = barsOffsets[i];
        });

        binch.chosenValue = getSelectedLuckyValue(barsOffsets);
    };

    binch.setProvidedChosenStringValue = function (providedValue) {
        var bigValue = bigInt(providedValue);

        var newOffsets = new Array(26);

        var scale = MAX_BIG_NUMBER;
        for (var i = 0; i < 26; i++) {
            newOffsets[i] = (bigValue.divmod(scale)).quotient;

            bigValue = bigValue.subtract(scale.multiply((bigValue.divmod(scale)).quotient));
            scale = scale.divide(1000);
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
            var luckyBarNet = getLuckyBarNetValue(offsetVal, i, barLengthPx);
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

        if (MAX_BIG_NUMBER.lesserOrEquals(divisor)) {
            return bigInt(1);
        } else {
            return MAX_BIG_NUMBER.divide(divisor);
        }
    }

    function generateBinchBar(idx) {
        return {
            binchBarIndex: idx,
            binchBarLengthPx: 1000,
            binchBarOffsetPx: 500,
            binchBarSnippetRange: getSnippetRangeByIndex(idx, barLengthPx).toString(10)
        }
    }


    init();

}(window.binch = window.binch || {}, jQuery));

