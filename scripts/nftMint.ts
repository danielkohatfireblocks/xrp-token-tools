import { NFTokenMint, AccountNFTsRequest, convertStringToHex } from "xrpl";
import { setup } from "../lib/setup";

// Enter the URL of the NFT
const URI = "https://<your_url_here>";

async function main() {
  const { ripple, signer, address } = await setup();

  const tx: NFTokenMint = {
    TransactionType: "NFTokenMint",
    Account: address,
    Fee: "1000",
    URI: URI ? convertStringToHex(URI) : undefined,
    Flags: {
      tfBurnable: true,
      tfOnlyXRP: true,
      tfTrustLine: true,
      tfTransferable: true,
    },
    TransferFee: 0,
    NFTokenTaxon: 0,
  };

  await signer.submitTransaction(tx, `Minting NFT with URI ${URI}`);

  const accountNftsRequest: AccountNFTsRequest = {
    command: "account_nfts",
    account: address,
  };

  const { result } = await ripple.request(accountNftsRequest);

  console.info("Account NFTs:", result.account_nfts);

  await ripple.disconnect();
}

void main();
