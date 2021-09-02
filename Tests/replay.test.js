const gnosis = require('../Code/gnosis');
const eth = require('../Code/eth');
const assert = require('assert');

describe('eth', function () {
    this.timeout(300000);

    it('replays transactions successfully', async function () {
        for(var i = 1; i <= 5; i++){
            console.log(`======= Deployment #${i} =======`);
            // Submits transaction to the network
            // Returns while transaction is still pending
            let tx = await gnosis.deploySafe();
            
            /*
            *
            *   YOUR CODE HERE
            * 
            */

            // Create methods in eth.js
            // Ensure the transaction gets replayed if needed

            console.log(`https://ropsten.etherscan.io/tx/${tx.txHash}`);
            console.log("======= Deployment Completed =======\n");
        }
    });
});