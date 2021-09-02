module.exports = {
	safeVersion: '1.1.1',
	gnosisSafeProxyFactory: '0x76E2cFc1F5Fa8F6a5b3fC4c8F4788F0116861F9B',
	gnosisSafeMasterCopy: '0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F',
	gnosisSetupAbi: {
		name: 'setup',
		type: 'function',
		inputs: [{
			type: 'address[]',
			name: '_owners'
		}, {
			type: 'uint256',
			name: '_threshold'
		}, {
			type: 'address',
			name: 'to'
		}, {
			type: 'bytes',
			name: 'data'
		}, {
			type: 'address',
			name: 'fallbackHandler'
		}, {
			type: 'address',
			name: 'paymentToken'
		}, {
			type: 'uint256',
			name: 'payment'
		}, {
			type: 'address',
			name: 'paymentReceiver'
		}]
	},
	gnosisCreateProxyAbi: {
		name: 'createProxyWithNonce',
		type: 'function',
		inputs: [{
			type: 'address',
			name: '_mastercopy'
		}, {
			type: 'bytes',
			name: 'initializer'
		}, {
			type: 'uint256',
			name: 'saltNonce'
		}]
	}
};