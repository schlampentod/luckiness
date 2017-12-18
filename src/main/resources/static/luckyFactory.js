/**
 * secp256k1
 * 1.158 * 10^77 (slightly less than 2^225)
 * BTC private key is a number between between 0x1 and 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141
 * For Javascript the largest number that can be handled is 2^53, which is 9007199254740992
 */
app.factory('luckyFactory', function () {
    return {

        SLOTS_PER_BAR: bigInt("1000"),
        MIN_BTC_KEY: bigInt("1"),
        MAX_BTC_KEY: bigInt("115792089237316195423570985008687907852837564279074904382605163141518161494337"),
        getKeyRangeByIndex: function (barIndex, slotsPerBar) {
            var snippetRange = this.MAX_BTC_KEY.divide(this.SLOTS_PER_BAR.pow(barIndex));

            return {
                keyRangeFrom: snippetRange,
                keyRangeIsNonFull: snippetRange.lesser(1000),
                keyRangeTill: ""
            };
        },
        generateAddress: function () {
            /*var keyPair = bitcoin.ECPair.makeRandom();
            var address = keyPair.getAddress();
            return address;*/
        }
    }
});