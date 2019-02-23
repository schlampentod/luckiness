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
        MAX_BTC_KEY: bigInt("115792089237316195423570985008687907852837564279074904382605163141518161494337")
    }
});