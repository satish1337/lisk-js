'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('../../crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _getTransactionBytes = require('./getTransactionBytes');

var _getTransactionBytes2 = _interopRequireDefault(_getTransactionBytes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
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
var getTransactionHash = function getTransactionHash(transaction) {
  var bytes = (0, _getTransactionBytes2.default)(transaction);
  return _crypto2.default.hash(bytes);
};

exports.default = getTransactionHash;