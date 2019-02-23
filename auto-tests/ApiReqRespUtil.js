'use strict';

const _ = require('lodash');
const chakram = require('chakram');

const path = require('path');
require('dotenv').config({path: path.resolve(path.join(__dirname, '.env'))});


let config = {
    apiPath: process.env.luckyApiPathPrefix
};

module.exports = new class {

    constructor(props) {
        this.API_PATH = config.apiPath;
    }

    addPathVariableIfValue(uri, variableValue) {
        if (variableValue) {
            uri = this.addPathVariable(uri, variableValue);
        }

        return uri;
    }

    addPathVariable(uri, variableValue) {
        return uri + (/\/$/.test(uri) ? "" : "/") + encodeURIComponent(variableValue);
    }

    addRequestParamIfValue(uri, paramName, paramValue) {
        if (paramValue) {
            uri = this.addRequestParam(uri, paramName, paramValue);
        }

        return uri;
    }

    addRequestParam(uri, paramName, paramValue) {
        return uri + (uri.indexOf('?') > -1 ? "&" : "?") + paramName + "=" + encodeURIComponent(paramValue);
    }

    addRequestParamListIfValue(uri, paramName, values) {
        if (values && values.length) {
            uri = this.addRequestParamList(uri, paramName, values);
        }
        return uri;
    }

    addRequestParamList(uri, paramName, values) {
        let obj = this;
        _.forEach(values, function (value, i) {
            uri = obj.addRequestParam(uri, paramName, value);
        });

        return uri;
    }

    async abstractValidGetRequest(uri) {
        let httpResponse = await chakram.get(this.constructApiUrl(uri), {
            headers: {}
        });
        return this.abstractProcessResponse(httpResponse);
    }

    async abstractValidPostRequest(uri, data) {
        let httpResponse = await chakram.post(this.constructApiUrl(uri), data, {
            headers: {}
        });
        return this.abstractProcessResponse(httpResponse);
    }

    async abstractProcessResponse(httpResponse) {
        let responseBody = httpResponse.body;

        return responseBody;
    }

    constructApiUrl(uri) {
        return this.API_PATH + uri;
    }

};
