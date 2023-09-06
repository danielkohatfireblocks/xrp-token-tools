# Fireblocks XRPL Tools

Fireblocks XRPL Raw Signing scripts for the following scenarios:

1. Set "Require tag" and "Domain" configurations on your XRP wallet

2. Set TrustLine in XRP

3. Set Authorization required for trustline

4. Approve trustline request (only relevant after setting authorization)

5. Move IOU tokens out of your Fireblocks vault

6. Mint a new Non-fungible Token (NFToken)

## Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/fireblocks/xrp-tools/
   cd xrp_tools
   ```

2. Install Node dependencies:

   ```sh
   yarn install
   ```

   Or

   ```sh
   npm i
   ```

3. Rename [`.env.example`](.env.example) to `.env` and set environment variables used across each tool:

   ```sh
   FIREBLOCKS_API_KEY=                  # Fireblocks API key
   FIREBLOCKS_PATH_TO_API_SECRET_KEY=   # Path to Fireblocks API secret key (RSA)
   FIREBLOCKS_VAULT_ACCOUNT_ID=         # Fireblocks Vault Account ID for the XRP source address
   ASSET_ID=XRP                         # Fireblocks XRPL asset ID
   RIPPLE_RPC_URL=wss://xrplcluster.com # XRPL RPC URL. See https://xrpl.org/public-servers.html
   ```

4. Modify variables in code depending on the script you want to run.

## Scripts

After running a script, sign the raw signing operation in your Fireblocks Mobile app or an API Co-signer. Make sure the console output includes:

```sh
Explorer: https://livenet.xrpl.org/transactions/<some_hash>
Result: {
   resultCode: 'tesSUCCESS',
   resultMessage: 'The transaction was applied. Only final in a validated ledger.',
   tx_json: {
      hash: '<some_hash>'
   }
}
```

Check the transaction's hash in the [XRP block explorer](https://livenet.xrpl.org), and make sure that the transaction was executed successfully.

### Set "Require Tag" Configuration

Edit [`scripts/setDestTag.ts`](scripts/setDestTag.ts):

```
DOMAIN: The domain name that owns this account
```

Run:

```sh
yarn setDestTag
```

### Set TrustLine

Run:

```
yarn trustline
```

Or 

```
npm run trustline
```

### Set Authorize Required for Trustline
Run:

```
yarn setAuthTrustline
```

Or 

```
npm run setAuthTrustline
```

### Approve trustline request
Run:

```
yarn approveTrustLine
```

Or 

```
npm run approveTrustLine
```

### Transfer Tokens

Edit [`scripts/transferTokens.ts`](scripts/transferTokens.ts):

```
DESTINATION: Destination address. Make sure that the Trust Line is set on the destination address
AMOUNT: Amount you wish to move (string) OR null for the entire balance
```

**Note: When moving the entire balance of the token, there might be a chance of an insignificant token leftover in the wallet.**

Run:

```
yarn transferTokens
```

Or

```
npm run transferTokens
```

### Mint a new NFT

Edit [`scripts/nftMint.ts`](scripts/nftMint.ts):

```
URI: The URI of the NFT
```

Run:

```
yarn nftMint
```

Or

```
npm run nftMint
```

## Note: submit transactions quickly

Since XRP transactions require [`LastLedgerSequence`](https://xrpl.org/reliable-transaction-submission.html#lastledgersequence) as a part of the transaction's body, when using Raw Signing it is limited for a quite short period of time (up to 2 mins), which means that the transaction should be submitted immediately after signing. Waiting for longer signing time will result in unsuccessful transaction broadcasting.
