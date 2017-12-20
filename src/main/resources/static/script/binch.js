/**
 * binch.js: Big Number Layered Chooser
 *
 * Depends on:
 * - https://github.com/peterolson/BigInteger.js
 * - JQuery
 * - Lo-dash
 */
(function (binch, $, undefined) {

    var BIG_ONE = bigInt("1");

    var MIN_BIG_NUMBER = bigInt(0);
    var MAX_BIG_NUMBER = bigInt("115792089237316195423570985008687907852837564279074904382605163141518161494337");

    var barLengthPx = 1000;

    var chooserBarsNumber = 26; // TODO compute
    var chooserBarsOffsets = new Array(chooserBarsNumber); // TODO compute

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
    };

    binch.decrementChosenValue = function () {
        binch.chosenValue = binch.chosenValue.subtract(BIG_ONE);
    };

    binch.setChooserBarsOffsets = function (barsOffsets) {
        chooserBarsOffsets = barsOffsets;
        binch.chosenValue = getSelectedLuckyValue(chooserBarsOffsets);
    };

    binch.setProvidedChosenStringValue = function (providedValue) {
        var bigValue = bigInt(providedValue);

        console.info("In: " + providedValue + " cast: " + bigValue.toString());

        var rv = new Array(26);
        var scale = bigInt("115792089237316195423570985008687907852837564279074904382605163141518161494337");
        for (var i = 0; i < 26; i++) {
            rv[i] = (bigValue.divmod(scale)).quotient;

            bigValue = bigValue.subtract(scale.multiply((bigValue.divmod(scale)).quotient));
            scale = scale.divide(1000);
        }

        return rv;
    };

    binch.generateMinValue = function () {
        _.forEach(binch.binchBars, function (bar, i) {
            bar.binchBarOffsetPx = 0;
        });
    };

    binch.generateMaxValue = function () {
        _.forEach(binch.binchBars, function (bar, i) {
            bar.binchBarOffsetPx = 1000;// TODO fixme
        });
    };


    binch.generateRandomBarOffsets = function () {
        _.forEach(binch.binchBars, function (bar, i) {
            bar.binchBarOffsetPx = Math.floor(Math.random() * 1000);
        });
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

        chooserBarsOffsets.fill(barLengthPx / 2); // Set to middle


        logInfo("initialized: " + chooserBarsOffsets);
    }

    function logInfo(msg) {
        console.info("binch.js: " + msg);
    }

    function getSelectedLuckyValue(barOffsetValues) {
        var rv = bigInt(0);

        _.forEach(barOffsetValues, function (offsetVal, i) {
            var luckyBarNet = getLuckyBarNetValue(offsetVal, i, bigInt(barLengthPx));
            rv = rv.add(luckyBarNet);
        });

        return rv;
    }

    function getLuckyBarNetValue(offsetVal, barIndex, slotsPerBar) {
        var rangeValue = getSnippetRangeByIndex(barIndex, slotsPerBar);
        return rangeValue.multiply(offsetVal);
    }

    function getSnippetRangeByIndex(barIndex, slotsPerBar) {
        return MAX_BIG_NUMBER.divide(slotsPerBar.pow(barIndex));
    }

    function generateBinchBar(idx) {
        return {
            binchBarIndex: idx,
            binchBarLengthPx: 1000,
            binchBarOffsetPx: 500,
            binchBarSnippetRange: getSnippetRangeByIndex(idx, bigInt(barLengthPx)).toString(10)
        }
    }

    init();

}(window.binch = window.binch || {}, jQuery));

