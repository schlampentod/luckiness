/**
 * BTC private key is a number between between 0x1 and 0xFFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFE BAAEDCE6 AF48A03B BFD25E8C D0364140
 * For Javascript the largest number that can be handled is 2^53, which is 9007199254740992
 */
app.factory('luckyFactory', function () {
    return {

        SLOTS_PER_BAR: bigInt("1000"),
        MIN_BTC_KEY: bigInt("1"),
        MAX_BTC_KEY: bigInt("115792089237316195423570985008687907852837564279074904382605163141518161494336"),
        getKeyRangeByIndex: function (barIndex, slotsPerBar) {
            var min = this.SLOTS_PER_BAR.pow(barIndex);

            return {
                keyRangeFrom: min,
                keyRangeTill: min.add(this.SLOTS_PER_BAR)
            };
        },
        generateAddress: function () {
            /*var keyPair = bitcoin.ECPair.makeRandom();
            var address = keyPair.getAddress();
            return address;*/
        }
    }
});