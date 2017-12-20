/**
 * binch.js: Big Number Layered Chooser
 */
(function (binch, $, undefined) {

    var MIN_BIG_NUMBER = 0;
    var MAN_BIG_NUMBER = 10000;

    var barLength = 1000;

    binch.choserBarsNumber = 26; // TODO compute
    binch.choserBarOffsets = new Array(binch.choserBarsNumber); // TODO compute
    binch.choserBarOffsets.fill(0);

    init();

    //
    //
    //

    function init() {
        logInfo("initialized: " + binch.choserBarOffsets);
    }

    function logInfo(msg) {
        console.info("binch.js: " + msg);
    }

}(window.binch = window.binch || {}, jQuery));

