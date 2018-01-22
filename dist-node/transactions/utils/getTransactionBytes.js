'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.checkTransaction = exports.getAssetBytes = exports.getAssetDataForTransferOutOfDappTransaction = exports.getAssetDataForTransferIntoDappTransaction = exports.getAssetDataForCreateDappTransaction = exports.getAssetDataForRegisterMultisignatureAccountTransaction = exports.getAssetDataForCastVotesTransaction = exports.getAssetDataForRegisterDelegateTransaction = exports.getAssetDataForRegisterSecondSignatureTransaction = exports.getAssetDataForTransferTransaction = exports.checkRequiredFields = exports.BYTESIZES = exports.isValidValue = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _crypto = require('../../crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isValidValue = exports.isValidValue = function isValidValue(value) {
	return ![undefined, false, NaN].includes(value);
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
var BYTESIZES = exports.BYTESIZES = {
	TYPE: 1,
	TIMESTAMP: 4,
	MULTISIGNATURE_PUBLICKEY: 32,
	RECIPIENT_ID: 8,
	AMOUNT: 8,
	SIGNATURE_TRANSACTION: 64,
	SECOND_SIGNATURE_TRANSACTION: 64,
	DATA: 64
};

var checkRequiredFields = exports.checkRequiredFields = function checkRequiredFields(requiredFields, data) {
	var dataFields = (0, _keys2.default)(data);
	requiredFields.forEach(function (parameter) {
		if (!dataFields.includes(parameter.toString()) || !isValidValue(data[parameter])) {
			throw new Error(parameter + ' is a required parameter.');
		}
	});
	return true;
};

var getAssetDataForTransferTransaction = exports.getAssetDataForTransferTransaction = function getAssetDataForTransferTransaction(_ref) {
	var data = _ref.data;
	return data ? Buffer.from(data, 'utf8') : Buffer.alloc(0);
};

var getAssetDataForRegisterSecondSignatureTransaction = exports.getAssetDataForRegisterSecondSignatureTransaction = function getAssetDataForRegisterSecondSignatureTransaction(_ref2) {
	var signature = _ref2.signature;

	checkRequiredFields(['publicKey'], signature);
	var publicKey = signature.publicKey;

	return Buffer.from(publicKey, 'hex');
};

var getAssetDataForRegisterDelegateTransaction = exports.getAssetDataForRegisterDelegateTransaction = function getAssetDataForRegisterDelegateTransaction(_ref3) {
	var delegate = _ref3.delegate;

	checkRequiredFields(['username'], delegate);
	var username = delegate.username;

	return Buffer.from(username, 'utf8');
};

var getAssetDataForCastVotesTransaction = exports.getAssetDataForCastVotesTransaction = function getAssetDataForCastVotesTransaction(_ref4) {
	var votes = _ref4.votes;

	if (!Array.isArray(votes)) {
		throw new Error('votes parameter must be an Array.');
	}
	return Buffer.from(votes.join(''), 'utf8');
};

var getAssetDataForRegisterMultisignatureAccountTransaction = exports.getAssetDataForRegisterMultisignatureAccountTransaction = function getAssetDataForRegisterMultisignatureAccountTransaction(_ref5) {
	var multisignature = _ref5.multisignature;

	checkRequiredFields(['min', 'lifetime', 'keysgroup'], multisignature);
	var min = multisignature.min,
	    lifetime = multisignature.lifetime,
	    keysgroup = multisignature.keysgroup;

	var minBuffer = Buffer.alloc(1, min);
	var lifetimeBuffer = Buffer.alloc(1, lifetime);
	var keysgroupBuffer = Buffer.from(keysgroup.join(''), 'utf8');

	return Buffer.concat([minBuffer, lifetimeBuffer, keysgroupBuffer]);
};

var getAssetDataForCreateDappTransaction = exports.getAssetDataForCreateDappTransaction = function getAssetDataForCreateDappTransaction(_ref6) {
	var dapp = _ref6.dapp;

	checkRequiredFields(['name', 'link', 'type', 'category'], dapp);
	var name = dapp.name,
	    description = dapp.description,
	    tags = dapp.tags,
	    link = dapp.link,
	    icon = dapp.icon,
	    type = dapp.type,
	    category = dapp.category;

	var nameBuffer = Buffer.from(name, 'utf8');
	var linkBuffer = Buffer.from(link, 'utf8');
	var typeBuffer = Buffer.alloc(4, type);
	var categoryBuffer = Buffer.alloc(4, category);

	var descriptionBuffer = description ? Buffer.from(description, 'utf8') : Buffer.alloc(0);
	var tagsBuffer = tags ? Buffer.from(tags, 'utf8') : Buffer.alloc(0);
	var iconBuffer = icon ? Buffer.from(icon, 'utf8') : Buffer.alloc(0);

	return Buffer.concat([nameBuffer, descriptionBuffer, tagsBuffer, linkBuffer, iconBuffer, typeBuffer, categoryBuffer]);
};

var getAssetDataForTransferIntoDappTransaction = exports.getAssetDataForTransferIntoDappTransaction = function getAssetDataForTransferIntoDappTransaction(_ref7) {
	var inTransfer = _ref7.inTransfer;

	checkRequiredFields(['dappId'], inTransfer);
	var dappId = inTransfer.dappId;

	return Buffer.from(dappId, 'utf8');
};

var getAssetDataForTransferOutOfDappTransaction = exports.getAssetDataForTransferOutOfDappTransaction = function getAssetDataForTransferOutOfDappTransaction(_ref8) {
	var outTransfer = _ref8.outTransfer;

	checkRequiredFields(['dappId', 'transactionId'], outTransfer);
	var dappId = outTransfer.dappId,
	    transactionId = outTransfer.transactionId;

	var outAppIdBuffer = Buffer.from(dappId, 'utf8');
	var outTransactionIdBuffer = Buffer.from(transactionId, 'utf8');

	return Buffer.concat([outAppIdBuffer, outTransactionIdBuffer]);
};

var getAssetBytes = exports.getAssetBytes = function getAssetBytes(transaction) {
	return {
		0: getAssetDataForTransferTransaction,
		1: getAssetDataForRegisterSecondSignatureTransaction,
		2: getAssetDataForRegisterDelegateTransaction,
		3: getAssetDataForCastVotesTransaction,
		4: getAssetDataForRegisterMultisignatureAccountTransaction,
		5: getAssetDataForCreateDappTransaction,
		6: getAssetDataForTransferIntoDappTransaction,
		7: getAssetDataForTransferOutOfDappTransaction
	}[transaction.type](transaction.asset);
};

var REQUIRED_TRANSACTION_PARAMETERS = ['type', 'timestamp', 'senderPublicKey', 'amount'];

var checkTransaction = exports.checkTransaction = function checkTransaction(transaction) {
	checkRequiredFields(REQUIRED_TRANSACTION_PARAMETERS, transaction);
	var data = transaction.asset.data;

	if (data && data.length > BYTESIZES.DATA) {
		throw new Error('Transaction asset data exceeds size of ' + BYTESIZES.DATA + '.');
	}
	return true;
};

var getTransactionBytes = function getTransactionBytes(transaction) {
	checkTransaction(transaction);
	var transactionType = Buffer.alloc(BYTESIZES.TYPE, transaction.type);
	var transactionTimestamp = Buffer.alloc(BYTESIZES.TIMESTAMP);
	transactionTimestamp.writeIntLE(transaction.timestamp, 0, BYTESIZES.TIMESTAMP);

	var transactionSenderPublicKey = Buffer.from(transaction.senderPublicKey, 'hex');
	var transactionRequesterPublicKey = transaction.requesterPublicKey ? Buffer.from(transaction.requesterPublicKey, 'hex') : Buffer.alloc(0);

	var transactionRecipientID = transaction.recipientId ? _crypto2.default.bigNumberToBuffer(transaction.recipientId.slice(0, -1), BYTESIZES.RECIPIENT_ID) : Buffer.alloc(BYTESIZES.RECIPIENT_ID);

	var transactionAmount = Buffer.alloc(BYTESIZES.AMOUNT);
	transactionAmount.writeInt32LE(transaction.amount, 0, BYTESIZES.AMOUNT);

	var transactionAssetData = getAssetBytes(transaction);

	var transactionSignature = transaction.signature ? Buffer.from(transaction.signature, 'hex') : Buffer.alloc(0);

	var transactionSecondSignature = transaction.signSignature ? Buffer.from(transaction.signSignature, 'hex') : Buffer.alloc(0);

	return Buffer.concat([transactionType, transactionTimestamp, transactionSenderPublicKey, transactionRequesterPublicKey, transactionRecipientID, transactionAmount, transactionAssetData, transactionSignature, transactionSecondSignature]);
};

exports.default = getTransactionBytes;