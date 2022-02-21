const gnosis = require('./gnosis');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/dbbffb50b5cf4a348b2688aa208119c6'));
web3.eth.defaultCommon = { customChain: { name: 'ropsten', chainId: 3, networkId: 3 } };

const MAX_REBROADCAST_ATTEMPS = 10;


async function droppedFromTxPool(tx) {
	await new Promise(r => setTimeout(r, 2000));

	// getTransaction will return null if the txHash does not exist in the tx pool
	// (i.e. if the txHash happens to be a random hexidecimal 32 character string, it probably wont exist in the tx pool!)
	const transaction = await web3.eth.getTransaction(tx.txHash);
	if (!transaction) {
		return true;
	}

	return false;
}

function slowGas(tx) {
	if (tx.gasPriceGwei <= 50000000) {
		return true;
	}

	return false;
}

async function rebroadcast(tx, num_rebroadcast_attemps) {
    num_rebroadcast_attemps = num_rebroadcast_attemps || 1;

	// Uncomment to stop rebroadcasting after 10 failed attempts
    // if (num_rebroadcast_attemps > MAX_REBROADCAST_ATTEMPS){
    //     throw new Error(`Exceeded Maximum number of Rebroadcast Attempts: ${MAX_REBROADCAST_ATTEMPS}  (Staker App Rocks!) `);
    // }

	try {
        console.log(`\n********** Rebroadcasting Transaction (attempt number ${num_rebroadcast_attemps}) **********`)
		tx = await gnosis.deploySafe(tx.nonce);
	} catch (error) {
		//console.log(error);
	}

    if (await droppedFromTxPool(tx) || slowGas(tx)){
        return rebroadcast(tx, num_rebroadcast_attemps + 1);
    }

    return tx;
}

function waitForTxReceipts(txHash, interval) {
	const transactionReceiptAsync = function (resolve, reject) {
		web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
			if (error) {
				reject(error);
				return;
			}

			if (receipt == null) {
				console.log(`Waiting for Transaction(s) to be mined`);
				setTimeout(
					() => transactionReceiptAsync(resolve, reject),
					interval || 1000
				);
				return;
			}

			resolve(receipt);
		});
	};

	if (Array.isArray(txHash)) {
		return Promise.all(
			txHash.map(oneTxHash => waitForTxReceipts(oneTxHash, interval))
		);
	}

	if (typeof txHash === "string") {
		return new Promise(transactionReceiptAsync);
	}

	throw new Error("Invalid Type: " + txHash);
}

module.exports = {
	droppedFromTxPool,
	slowGas,
	rebroadcast,
	waitForTxReceipts,
};
