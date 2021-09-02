# NodeJS-Technical-Assessment
## Required Tools
- https://code.visualstudio.com/
- https://nodejs.org/en/blog/release/v12.18.0/
```
npm install mocha -g
```

## Instructions
Populate the `Tests/replay.test.js` file to do the following
1. Execute 5 deploy safe transactions
2. Check the transaction status
3. Rebroadcast if necessary
4. Assert that all gnosis safes are deployed successfully

## Running The Test
```
mocha Tests/replay.test.js
```

## Details
- **The deploy safe code is intentionally written with random failures built in to simulate real network conditions**
- Public address: `0xF4eCb7C9625c0f56068aFbB229F2ba248D1ee9e8` 
- Etherscan link: https://ropsten.etherscan.io/address/0xF4eCb7C9625c0f56068aFbB229F2ba248D1ee9e8