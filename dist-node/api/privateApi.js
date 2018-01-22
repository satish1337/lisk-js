'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.getNodes = getNodes;
exports.isBanned = isBanned;
exports.getRandomNode = getRandomNode;
exports.selectNewNode = selectNewNode;
exports.banActiveNode = banActiveNode;
exports.hasAvailableNodes = hasAvailableNodes;
exports.createRequestObject = createRequestObject;
exports.sendRequestPromise = sendRequestPromise;
exports.handleTimestampIsInFutureFailures = handleTimestampIsInFutureFailures;
exports.handleSendRequestFailures = handleSendRequestFailures;

var _popsicle = require('popsicle');

var popsicle = _interopRequireWildcard(_popsicle);

var _constants = require('../constants');

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getNodes() {
	if (this.testnet) return this.defaultTestnetNodes;
	if (this.ssl) return this.defaultSSLNodes;
	return this.defaultNodes;
} /*
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
function isBanned(node) {
	return this.bannedNodes.includes(node);
}

function getRandomNode() {
	var _this = this;

	var nodes = getNodes.call(this).filter(function (node) {
		return !isBanned.call(_this, node);
	});

	if (!nodes.length) {
		throw new Error('Cannot get random node: all relevant nodes have been banned.');
	}

	var randomIndex = Math.floor(Math.random() * nodes.length);
	return nodes[randomIndex];
}

function selectNewNode() {
	var providedNode = this.options.node;

	if (this.randomNode) {
		return getRandomNode.call(this);
	} else if (providedNode) {
		if (isBanned.call(this, providedNode)) {
			throw new Error('Cannot select node: provided node has been banned and randomNode is not set to true.');
		}
		return providedNode;
	}

	throw new Error('Cannot select node: no node provided and randomNode is not set to true.');
}

function banActiveNode() {
	if (!isBanned.call(this, this.node)) {
		this.bannedNodes.push(this.node);
		return true;
	}
	return false;
}

function hasAvailableNodes() {
	var _this2 = this;

	var nodes = getNodes.call(this);

	return this.randomNode ? nodes.some(function (node) {
		return !isBanned.call(_this2, node);
	}) : false;
}

function createRequestObject(method, requestType, providedOptions) {
	var options = providedOptions || {};
	var baseURL = utils.getFullURL(this);
	var url = method === _constants.GET ? baseURL + '/api/' + requestType + '?' + utils.toQueryString(options) : baseURL + '/api/' + requestType;

	return {
		method: method,
		url: url,
		headers: this.nethash,
		body: method === _constants.GET ? {} : options
	};
}

function sendRequestPromise(requestMethod, requestType, options) {
	var requestObject = createRequestObject.call(this, requestMethod, requestType, options);

	return popsicle.request(requestObject).use(popsicle.plugins.parse(['json', 'urlencoded']));
}

function handleTimestampIsInFutureFailures(requestMethod, requestType, options, result) {
	if (!result.success && result.message && result.message.match(/Timestamp is in the future/) && !(options.timeOffset > 40)) {
		var newOptions = (0, _assign2.default)({}, options, {
			timeOffset: (options.timeOffset || 0) + 10
		});

		return this.sendRequest(requestMethod, requestType, newOptions);
	}
	return _promise2.default.resolve(result);
}

function handleSendRequestFailures(requestMethod, requestType, options, error) {
	var that = this;
	if (hasAvailableNodes.call(that)) {
		return new _promise2.default(function (resolve, reject) {
			setTimeout(function () {
				if (that.randomNode) {
					banActiveNode.call(that);
				}
				that.setNode();
				that.sendRequest(requestMethod, requestType, options).then(resolve, reject);
			}, 1000);
		});
	}
	return _promise2.default.resolve({
		success: false,
		error: error,
		message: 'Could not create an HTTP request to any known nodes.'
	});
}