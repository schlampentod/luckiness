'use strict';

const assert = require('assert');

const apiReqRespUtil = require('./ApiReqRespUtil');
//
//
//

describe("CheckTest", function () {

    it("should submit", async function () {
        assert.ok(!await checkKey(123));
        assert.ok(!await checkKey(0));
    });

    async function checkKey(key) {
        let response = await apiReqRespUtil.abstractValidGetRequest("/rest/v1/checky/check/batch/" + key);
        return response.checkedKeyFound;
    }

});
