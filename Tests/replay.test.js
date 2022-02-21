const assert = require('assert');
const eth = require('../Code/eth');
const gnosis = require('../Code/gnosis');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/dbbffb50b5cf4a348b2688aa208119c6'));
web3.eth.defaultCommon = { customChain: { name: 'ropsten', chainId: 3, networkId: 3 } };


describe('eth', function () {
    this.timeout(300000);

    it('replays transactions successfully', async function () {
        let txHashes = [];
        let nonce = await gnosis.getAdminNonce();
        const num_deployments = 5;

        for(var i = 0; i < num_deployments; i++){
            console.log(`============================ Deployment #${i+1} ===================================`);

            let tx = await gnosis.deploySafe(nonce + i);

            if (await eth.droppedFromTxPool(tx) || eth.slowGas(tx)){
                tx = await eth.rebroadcast(tx);
            }

            txHashes.push(tx.txHash)

            console.log(`\nhttps://ropsten.etherscan.io/tx/${tx.txHash}`);
            console.log("============================ Deployment Completed ============================\n\n\n\n");
        }

        let txReceipts = await eth.waitForTxReceipts(txHashes);
        console.log(`\n\n\n${num_deployments} Transaction Receipts: `, txReceipts);

        for (const txReceipt of txReceipts){
            assert.equal(txReceipt.status, true);
        }

    });

});
