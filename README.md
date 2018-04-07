# minerWatch
To infer a pool's proportion of the network, we consume iquidus explorer api and keep track of New York Coin mining rewards per wallet over a timeframe.

# Installing
git clone https://github.com/ltanyc/minerWatch.git && cd minerWatch && npm install

# Running with 60 min lookback
node ./index.js 60

# Sample output
```
{
  "version": "0.0.2",
  "lookbackMin": "60",
  "miners": [
    {
      "addr": "RXDXVzfB7sEThmtLqpzS8QnKzc6MT4rDQa",
      "name": "https://prohashing.com/",
      "minedNYC": 1040000,
      "percent": "86.67",
      "GHps": "144.89"
    },
    {
      "addr": "RVGy8B4EySBsiQWe2s8Wzu3tpxH2E1EadA",
      "minedNYC": 40000,
      "percent": "3.33",
      "GHps": "5.57"
    },
    {
      "addr": "RQrGu6KtsYMbH6cRNiQdnLcy4meofzAWHS",
      "name": "https://newyorkcoin.mastermining.net",
      "minedNYC": 40000,
      "percent": "3.33",
      "GHps": "5.57"
    },
    {
      "addr": "RNra5LWEinBh7uikkSZxRuRg114PUbeqSL",
      "name": "https://hobbyistpool.ddns.net/nyc",
      "minedNYC": 40000,
      "percent": "3.33",
      "GHps": "5.57"
    },
    {
      "addr": "RB8trkrKbXQ8AaRhnUxcdBNnc4swCynRDF",
      "name": "https://www.mining-dutch.nl/pools/newyorkcoin.php",
      "minedNYC": 30000,
      "percent": "2.50",
      "GHps": "4.18"
    },
    {
      "addr": "RMR7DfZEBPDyXd1rCbARAK7YQMMSPByz79",
      "name": "http://nyc.mypool.club/",
      "minedNYC": 10000,
      "percent": "0.83",
      "GHps": "1.39"
    }
  ],
  "curBlock": 4070926,
  "curNetworkGHps": "167.18"
}
```
