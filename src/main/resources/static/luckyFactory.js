/**
 *
 */
app.factory('luckyFactory', function () {
    return {

        SLOTS_PER_BAR: 1000,
        MIN_BTC_KEY: "1", // a number between between 0x1 and 0xFFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFE BAAEDCE6 AF48A03B BFD25E8C D0364140
        MAX_BTC_KEY: "115792089237316195423570985008687907852837564279074904382605163141518161494336",
        getKeyRangeByIndex: function (barIndex, slotsPerBar) {
            // TODO fixme
            return {
                keyRangeFrom: 100,
                keyRangeTill: 100000
            };
        }
    }
});