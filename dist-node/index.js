'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsNacl = require('js-nacl');

var _jsNacl2 = _interopRequireDefault(_jsNacl);

var _bip = require('bip39');

var _bip2 = _interopRequireDefault(_bip);

var _liskApi = require('./api/liskApi');

var _liskApi2 = _interopRequireDefault(_liskApi);

var _crypto = require('./crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _time = require('./transactions/utils/time');

var time = _interopRequireWildcard(_time);

var _transactions = require('./transactions');

var _transactions2 = _interopRequireDefault(_transactions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
global.naclFactory = _jsNacl2.default;

global.naclInstance = null;
_jsNacl2.default.instantiate(function (nacl) {
  naclInstance = nacl;
});

exports.default = { crypto: _crypto2.default, transaction: _transactions2.default, api: _liskApi2.default, time: time, Mnemonic: _bip2.default };