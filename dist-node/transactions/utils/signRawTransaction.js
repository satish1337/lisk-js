'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = signRawTransaction;

var _crypto = require('../../crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _time = require('./time');

var _prepareTransaction = require('./prepareTransaction');

var _prepareTransaction2 = _interopRequireDefault(_prepareTransaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function signRawTransaction(_ref) {
	var transaction = _ref.transaction,
	    passphrase = _ref.passphrase,
	    secondPassphrase = _ref.secondPassphrase,
	    timeOffset = _ref.timeOffset;

	var _crypto$getAddressAnd = _crypto2.default.getAddressAndPublicKeyFromPassphrase(passphrase),
	    publicKey = _crypto$getAddressAnd.publicKey,
	    address = _crypto$getAddressAnd.address;

	var senderSecondPublicKey = secondPassphrase ? _crypto2.default.getPrivateAndPublicKeyFromPassphrase(secondPassphrase).publicKey : null;

	var propertiesToAdd = {
		senderPublicKey: publicKey,
		senderSecondPublicKey: senderSecondPublicKey,
		senderId: address,
		timestamp: (0, _time.getTimeWithOffset)(timeOffset)
	};

	var transactionWithProperties = (0, _assign2.default)({}, transaction, propertiesToAdd);

	return (0, _prepareTransaction2.default)(transactionWithProperties, passphrase, secondPassphrase);
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