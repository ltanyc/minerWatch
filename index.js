#!/usr/local/bin/node

'use strict';

const APIURI = 'http://hobbyistpool.ddns.net:6001/api/';
const request = require('requestretry').defaults({
	maxAttempts: 3,
	retryDelay: 5000,
	fullResponse: false,
});
const BLOCKREWARD = 10000;
var lookback = parseInt(process.argv[2]);
if (process.argv[2] == null || lookback < 1 || lookback > 1440) {
	lookback = 10;
	console.error('Lookback set to ' + lookback + ' min');
}

var addr2name = new Object();
addr2name['RMNdYUXmTr1LhBT9qKvg48ic73QKAwFY11'] = addr2name['RXDXVzfB7sEThmtLqpzS8QnKzc6MT4rDQa']  = 'prohashing.com';
addr2name['RXV1EtSArmdA4L6UV1d2Gz6uX4h67S5wwx']  = 'https://hobbyistpool.ddns.net/nyc Developer Pool';
addr2name['RBbZPTntFix1cHxm7PxtgeKaKyqZbN5KvJ'] = addr2name['RMR7DfZEBPDyXd1rCbARAK7YQMMSPByz79']  = 'nyc.mypool.club';
addr2name['RQrGu6KtsYMbH6cRNiQdnLcy4meofzAWHS']  = 'mastermining.net';
addr2name['RB8trkrKbXQ8AaRhnUxcdBNnc4swCynRDF']  = 'mining-dutch.nl';
addr2name['RGZ2JZEFsRgEqngQn4vUYi2mPydMWygPdX']  = 'zpool.ca';
addr2name['RMkqWYHQuN9a4XsrP3CgHnmpnaUvcSp95p']  = 'gigarho.com';
addr2name['RMR7DfZEBPDyXd1rCbARAK7YQMMSPByz79']  = 'nyc.mypool.club';
addr2name['RVcmwoMpMrNppQeCrKWnZkzwX8ubdpGZYo']  = 'newyorkcoinpool.com';
addr2name['RGoDKEHbCHHzHo6ufXa9iuDKyGGfMt1q1k']  = 'mcpny.com';

function apiReq(endpoint, arg) {
	if (arg == null)
		arg = '';
	var options = {
		uri: APIURI + endpoint + arg,
		headers: {
			'Accept': 'application/json',
			'User-Agent': 'lta',
		},
		json: true,
	};
	return request(options);
}

apiReq('getnetworkhashps').then(function(hps) {
  var ghps = hps / 1000000000;
  apiReq('getblockcount').then(function(out) {
	var height = parseInt(out);
	var addrMap = new Object();
	var lastTxs = new Array();
	for (var i = height; i > height - 2 * lookback; i--) {
		lastTxs.push(apiReq('getblockhash?index=', i).then(function(out) {
			return apiReq('getblock?hash=', out).then(function(out) {
				return apiReq('getrawtransaction?txid=', out.tx[0] + '&decrypt=1').then(function(out) {
					if (out.vin[0].coinbase == null) {
						console.error('ERROR: coinbase assumption wrong');
						return [0, new Date(), 0];
					}
					return [out.vout[0].scriptPubKey.addresses[0], addr2name[out.vout[0].scriptPubKey.addresses[0]], new Date(1000 * out.time), out.confirmations];
				}).catch(function(err) { console.error(err) });
			}).catch(function(err) { console.error(err) });
		}).catch(function(err) { console.error(err) }));
	}
	Promise.all(lastTxs).then(function(out) {
		for (var i = 0; i < out.length; i++) {
			if (addrMap[out[i][0]] == null)
				addrMap[out[i][0]] = BLOCKREWARD;
			else 
				addrMap[out[i][0]] += BLOCKREWARD;
		}
		var sorted = Object.keys(addrMap)
    			.sort(function(a, b) { return +addrMap[b] - +addrMap[a] })
			.map(function(k) { return { addr: k, name: addr2name[k], minedNYC: addrMap[k], percent: parseFloat(100 * (addrMap[k] / 10000) / lastTxs.length).toFixed(2), GHps: (ghps * (addrMap[k] / BLOCKREWARD) / lastTxs.length).toFixed(2) } });
		var output = { version: "0.0.2", lookbackMin: lookback, miners: sorted, curBlock: height, curNetworkGHps: ghps.toFixed(2), }
		console.log(JSON.stringify(output, null, 2));
	}).catch(function(err) { console.error(err) });
  }).catch(function(err) { console.error(err) });
}).catch(function(err) { console.error(err) });
