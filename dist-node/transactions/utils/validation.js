'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.validateKeysgroup = exports.validatePublicKeys = exports.checkPublicKeysForDuplicates = exports.validatePublicKey = undefined;

var _convert = require('../../crypto/convert');

var validatePublicKey = exports.validatePublicKey = function validatePublicKey(publicKey) {
	var publicKeyBuffer = (0, _convert.hexToBuffer)(publicKey);
	if ((0, _convert.bufferToHex)(publicKeyBuffer) !== publicKey) {
		throw new Error('Public key must be a valid hex string.');
	}
	if (publicKeyBuffer.length !== 32) {
		throw new Error('Public key ' + publicKey + ' length differs from the expected 32 bytes for a public key.');
	}

	return true;
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
var checkPublicKeysForDuplicates = exports.checkPublicKeysForDuplicates = function checkPublicKeysForDuplicates(publicKeys) {
	return publicKeys.every(function (element, index) {
		var elementFound = publicKeys.slice(index + 1).indexOf(element);
		if (elementFound > -1) {
			throw new Error('Duplicated public key: ' + publicKeys[index] + '.');
		}
		return true;
	});
};

var validatePublicKeys = exports.validatePublicKeys = function validatePublicKeys(publicKeys) {
	return publicKeys.every(validatePublicKey) && checkPublicKeysForDuplicates(publicKeys);
};

var validateKeysgroup = exports.validateKeysgroup = function validateKeysgroup(keysgroup) {
	if (keysgroup.length === 0 || keysgroup.length > 16) {
		throw new Error('Expected between 1 and 16 public keys in the keysgroup.');
	}
	return validatePublicKeys(keysgroup);
};