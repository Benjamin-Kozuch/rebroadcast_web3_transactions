const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;

const publicAddress = '0xF4eCb7C9625c0f56068aFbB229F2ba248D1ee9e8';
const privateKey = '0xb3fc3b689396e7069cb831bbce245a9029d421fce8680ad9e7bca9159482b9be';

module.exports = {
	publicAddress: publicAddress,

	signTransactionAsync: async function (nonce, gasPrice, gasLimit, to, value, data) {
		var rawTx = {
			nonce: nonce,
			gasPrice: gasPrice,
			gasLimit: gasLimit,
			to: to,
			value: value,
			data: data
		};

		const privateKeyBuffer = Buffer.from(privateKey.substring(2), 'hex');

		var tx = new Tx(rawTx, {
			common: Common.forCustomChain(
				'ropsten',
				{
					name: 'ropsten',
					networkId: 3,
					chainId: 3,
				},
				'petersburg'
			)
		});
		tx.sign(privateKeyBuffer);

		var serializedTx = tx.serialize();

		return serializedTx;
	}
};