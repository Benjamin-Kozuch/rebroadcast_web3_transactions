# Getting some practice with web3

## Sources
https://info.etherscan.com/how-to-cancel-ethereum-pending-transactions/
https://www.web3.university/article/how-to-debug-pending-ethereum-transactions
https://medium.com/blockchannel/life-cycle-of-an-ethereum-transaction-e5c66bae0f6e
https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#getpendingtransactions
https://ethereum.stackexchange.com/a/67234
https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html?highlight=sendTransaction#gettransaction
https://raw.githubusercontent.com/Kaisle/await-transaction-mined/master/index.js
https://ethereum.stackexchange.com/questions/27256/error-replacement-transaction-underpriced/44875
https://ethereum.stackexchange.com/a/71310


## Instructions
Populate the `Tests/replay.test.js` file to do the following
1. Execute 5 deploy safe transactions
2. Check the transaction status
3. Rebroadcast if necessary
4. Assert that all gnosis safes are deployed successfully

## Running The Test
```
npm install mocha -g
```
```
mocha Tests/replay.test.js
```

## Details
- **The deploy safe code is intentionally written with random failures built in to simulate real network conditions**
- Public address: `0xF4eCb7C9625c0f56068aFbB229F2ba248D1ee9e8` 
- Etherscan link: https://ropsten.etherscan.io/address/0xF4eCb7C9625c0f56068aFbB229F2ba248D1ee9e8
