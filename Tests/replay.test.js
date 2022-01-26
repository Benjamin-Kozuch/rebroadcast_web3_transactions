const assert = require('assert');
const eth = require('../Code/eth');
const gnosis = require('../Code/gnosis');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/dbbffb50b5cf4a348b2688aa208119c6'));
web3.eth.defaultCommon = { customChain: { name: 'ropsten', chainId: 3, networkId: 3 } };


describe('eth', function () {
    this.timeout(300000);

    it('replays transactions successfully', async function () {
        let txs = [];
        const num_deployments = 5;
        for(var i = 1; i <= num_deployments; i++){
            console.log(`============================ Deployment #${i} ===================================`);

            let tx = await gnosis.deploySafe();

            if (await eth.isDropped(tx) || eth.isLowGas(tx)){
                tx = await eth.rebroadcast(tx);
            }

            txs.push(tx.txHash)

            console.log(`https://ropsten.etherscan.io/tx/${tx.txHash}`);
            console.log("============================ Deployment Completed ============================\n");
        }

        let txReceipts = await eth.waitForTxReceipt(txs);
        console.log(`\n\n\n${num_deployments} Transaction Receipts: `, txReceipts);

        for (const txReceipt of txReceipts){
            assert.equal(txReceipt.status, true);
        }

    });


    // The following version of the test is similar to the above, but asserts each transaction syncronously
    // before deploying the next one.

    // it('replays transactions successfully', async function () {
    //     for(var i = 1; i <= 5; i++){
    //         console.log(`============================ Deployment #${i} ============================`);

    //         let tx = await gnosis.deploySafe();

    //         if (await eth.isDropped(tx) || eth.isLowGas(tx)){
    //             tx = await eth.rebroadcast(tx);
    //         }

    //         let txReceipt = await eth.waitForTxReceipt(tx.txHash);
    //         console.log("txReceipt: ", txReceipt);

    //         assert.equal(txReceipt.status, true);

    //         console.log(`https://ropsten.etherscan.io/tx/${tx.txHash}`);
    //         console.log("============================ Deployment Completed ============================\n");
    //     }
    // });

});
