'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.toQueryString = exports.checkOptions = exports.wrapSendRequest = exports.constructRequestData = exports.optionallyCallCallback = exports.getFullURL = exports.getURLPrefix = exports.netHashOptions = exports.getDefaultPort = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _isNan = require('babel-runtime/core-js/number/is-nan');

var _isNan2 = _interopRequireDefault(_isNan);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDefaultPort = exports.getDefaultPort = function getDefaultPort(options) {
	if (options.testnet) return _constants.TEST_PORT;
	if (options.ssl) return _constants.SSL_PORT;
	return _constants.LIVE_PORT;
}; /*
    * Copyright © 2017 Lisk Foundation
    *
    * See the LICENSE file at the top-level directory of this distribution
    * for licensing information.
    *
    * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
    * no part of this software, including this file, may be copied, modified,
    * propagated, or distributed except according to the terms contained in the
    * LICENSE file.
    *
    * Removal or modification of this copyright notice is prohibited.
    *
    */
var netHashOptions = exports.netHashOptions = function netHashOptions(_ref) {
	var port = _ref.port;

	var testnetNethash = 'da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba';
	var mainnetNethash = 'ed14889723f24ecc54871d058d98ce91ff2f973192075c0155ba2b7b70ad2511';

	var commonNethash = {
		'Content-Type': 'application/json',
		os: 'lisk-js-api',
		version: '1.0.0',
		minVersion: '>=0.5.0',
		port: port
	};

	return {
		testnet: (0, _assign2.default)({}, commonNethash, {
			nethash: testnetNethash,
			broadhash: testnetNethash
		}),
		mainnet: (0, _assign2.default)({}, commonNethash, {
			nethash: mainnetNethash,
			broadhash: mainnetNethash
		})
	};
};

var getURLPrefix = exports.getURLPrefix = function getURLPrefix(_ref2) {
	var ssl = _ref2.ssl;
	return ssl ? 'https' : 'http';
};

var getFullURL = exports.getFullURL = function getFullURL(_ref3) {
	var node = _ref3.node,
	    port = _ref3.port,
	    ssl = _ref3.ssl;

	var nodeUrl = port ? node + ':' + port : node;
	return getURLPrefix({ ssl: ssl }) + '://' + nodeUrl;
};

var optionallyCallCallback = exports.optionallyCallCallback = function optionallyCallCallback(callback, result) {
	if (typeof callback === 'function') {
		callback(result);
	}
	return result;
};

var constructRequestData = exports.constructRequestData = function constructRequestData(providedObject, optionsOrCallback) {
	var providedOptions = typeof optionsOrCallback !== 'function' && typeof optionsOrCallback !== 'undefined' ? optionsOrCallback : {};
	return (0, _assign2.default)({}, providedOptions, providedObject);
};

var wrapSendRequest = exports.wrapSendRequest = function wrapSendRequest(method, endpoint, getDataFn) {
	return function wrappedSendRequest(value, optionsOrCallback, callbackIfOptions) {
		var callback = callbackIfOptions || optionsOrCallback;
		var data = constructRequestData(getDataFn(value, optionsOrCallback), optionsOrCallback);
		return this.sendRequest(method, endpoint, data, callback);
	};
};

var checkOptions = exports.checkOptions = function checkOptions(options) {
	(0, _entries2.default)(options).forEach(function (_ref4) {
		var _ref5 = (0, _slicedToArray3.default)(_ref4, 2),
		    key = _ref5[0],
		    value = _ref5[1];

		if (value === undefined || (0, _isNan2.default)(value)) {
			throw new Error('"' + key + '" option should not be ' + value);
		}
	});

	return options;
};

var toQueryString = exports.toQueryString = function toQueryString(obj) {
	var parts = (0, _entries2.default)(obj).reduce(function (accumulator, _ref6) {
		var _ref7 = (0, _slicedToArray3.default)(_ref6, 2),
		    key = _ref7[0],
		    value = _ref7[1];

		return [].concat((0, _toConsumableArray3.default)(accumulator), [encodeURIComponent(key) + '=' + encodeURIComponent(value)]);
	}, []);

	return parts.join('&');
};