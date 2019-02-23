'use strict';

const assert = require('assert');

const bigInt = require("big-integer");
const apiReqRespUtil = require('./ApiReqRespUtil');
//
//
//

describe("CheckTest", function () {

    it("should submit", async function () {
        assert.ok(!await checkKey(123));
        assert.ok(!await checkKey(0));
    });

    it("should submit big int", async function () {
        let key = bigInt("75643564363473453456342378564387956906736546456235345");
        key = key.add(1);
        assert.ok(!await checkKey(key.toString(10)));
    });

    it("should submit 100", async function () {
        for (let i = 0; i < 100; i++) {
        //while (true) {
            let key = bigInt.randBetween("1157920892373161954235709850086879078528375642790749043826051631415181614", "115792089237316195423570985008687907852837564279074904382605163141518161494337")
            assert.ok(!await checkKey(key.toString(10)));
        }
    });

    async function checkKey(key) {
        let response = await apiReqRespUtil.abstractValidGetRequest("/rest/v1/checky/check/batch/" + key);
        return response.checkedKeyFound;
    }

});
