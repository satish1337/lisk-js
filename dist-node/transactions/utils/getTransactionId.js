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
var getTransactionId = function getTransactionId(transaction) {
  var transactionBytes = (0, _getTransactionBytes2.default)(transaction);
  var transactionHash = _crypto2.default.hash(transactionBytes);
  var bufferFromFirstEntriesReversed = _crypto2.default.getFirstEightBytesReversed(transactionHash);
  var firstEntriesToNumber = _crypto2.default.bufferToBigNumberString(bufferFromFirstEntriesReversed);

  return firstEntriesToNumber;
};

exports.default = getTransactionId;