const adminWallet = require('./wallet');
const adminAddress = adminWallet.publicAddress;
const constants = require('./constants');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/dbbffb50b5cf4a348b2688aa208119c6'));
web3.eth.defaultCommon = { customChain: { name: 'ropsten', chainId: 3, networkId: 3 } };

async function getCreate2Address(txData) {
	const gnosisAddress = '0x' + (await web3.eth.call({
		'to': constants.gnosisSafeProxyFactory,
		'data': txData
	})).slice(26);

	return Web3.utils.toChecksumAddress(gnosisAddress);
}

function getRandomSalt() {
	const salt = Math.ceil(Math.random() * 10000000000000000000);
	return '0x' + salt.toString(16);
}

function getDeploySafeData() {
	const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
	const randomSalt = getRandomSalt();
	const initData = web3.eth.abi.encodeFunctionCall(constants.gnosisSetupAbi, [[adminAddress], 1, ZERO_ADDRESS, '0x', ZERO_ADDRESS, ZERO_ADDRESS, 0, ZERO_ADDRESS]);
	const data = web3.eth.abi.encodeFunctionCall(constants.gnosisCreateProxyAbi, [constants.gnosisSafeMasterCopy, initData, randomSalt]);
	return data;
}

function waitForHash(signedTx) {
	return new Promise((resolve, reject) => {
		web3.eth.sendSignedTransaction(signedTx)
			.once('transactionHash', (hash) => {
				resolve(hash);
			}).on('error', (error) => {
				reject(error);
			});
	});
}

async function getAdminNonce() {
	return await web3.eth.getTransactionCount(adminAddress, 'pending');
}

module.exports = {
	//!!!!! DO NOT MODIFY BELOW !!!!!
	getAdminNonce,
	deploySafe: async function (nonce = null) {
		console.log('deploying safe...');
		if(!nonce){
			nonce = await getAdminNonce();
		}
		const nonceHex = web3.utils.toHex(nonce);

		const gasLimit = 300000;

		let gasPriceWei = "50000000";
		if (Math.random() < 0.5){
			gasPriceWei = await web3.eth.getGasPrice();
		} else {
			console.log("> slow gas");
		}
			

		const gasPriceGwei = web3.utils.fromWei(gasPriceWei, 'wei');
		const gasPriceHex = web3.utils.toHex(gasPriceWei);
		const gasLimitHex = web3.utils.toHex(gasLimit);

		const to = constants.gnosisSafeProxyFactory;
		const value = 0;
		const data = getDeploySafeData();
		let safeAddress = await getCreate2Address(data);
		
		const serializedTx = await adminWallet.signTransactionAsync(nonceHex, gasPriceHex, gasLimitHex, to, value, data);

		let txHash = web3.utils.randomHex(32);
		if (Math.random() < 0.5){
			txHash = await waitForHash('0x' + serializedTx.toString('hex'));
		} else {
			console.log("> dropped from transaction pool");
		}

		return {
			txHash,
			nonce,
			gasLimit,
			gasPriceGwei,
			to,
			value,
			data,
			safeAddress
		};
	},
	//!!!!! DO NOT MODIFY ABOVE !!!!!
};
