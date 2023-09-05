import { TrustSet } from "xrpl";
import { setup } from "../lib/setup";

const TOKEN_ID = "534F4C4F00000000000000000000000000000000";

const TOKEN_ISSUER = "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz";

const TOKEN_NAME = "SOLO";

async function main() {
  const { ripple, signer, address } = await setup();

  const tx: TrustSet = {
    TransactionType: "TrustSet",
    Account: address,
    Fee: "15000",
    Flags: 262144,
    LimitAmount: {
      currency: TOKEN_ID,
      issuer: TOKEN_ISSUER,
      value: "200000000",
    },
  };

  await signer.submitTransaction(
    tx,
    `Setting TrustLine for ${TOKEN_NAME} token`
  );

  await ripple.disconnect();
}

void main();
