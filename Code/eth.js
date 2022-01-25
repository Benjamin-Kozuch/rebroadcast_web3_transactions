const gnosis = require('./gnosis');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/dbbffb50b5cf4a348b2688aa208119c6'));
web3.eth.defaultCommon = { customChain: { name: 'ropsten', chainId: 3, networkId: 3 } };

async function isDropped(tx) {
    await new Promise(r => setTimeout(r, 2000));
    let transaction = await web3.eth.getTransaction(tx.txHash); 
    if (!transaction) {
        return true;
    } else {
        return false;
    }
};

function isLowGas(tx) {
    if (tx.gasPriceGwei <= 50000000){
        return true;
    } else {
        return false;
    }
};

async function rebroadcast(tx) {
    console.log("********** Rebroadcasting Transaction **********")

    try { tx = await gnosis.deploySafe(tx.nonce) } catch (error) {}

    if (await isDropped(tx) || isLowGas(tx)){
        return rebroadcast(tx);
    }

    return tx;
};

function waitForTxReceipt(txHash, interval) {
    const transactionReceiptAsync = function(resolve, reject) {
        web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
            if (error) {
                reject(error);
            } else if (receipt == null) {
                console.log("Waiting for Tx to be mined to get receipt")
                setTimeout(
                    () => transactionReceiptAsync(resolve, reject),
                    interval ? interval : 1000);
            } else {
                resolve(receipt);
            }
        });
    };

    if (Array.isArray(txHash)) {
        return Promise.all(txHash.map(
            oneTxHash => waitForTxReceipt(oneTxHash, interval)));
    } else if (typeof txHash === "string") {
        return new Promise(transactionReceiptAsync);
    } else {
        throw new Error("Invalid Type: " + txHash);
    }
};

module.exports = {
    isDropped:isDropped,
    isLowGas:isLowGas,
    rebroadcast:rebroadcast,
    waitForTxReceipt:waitForTxReceipt,
}
