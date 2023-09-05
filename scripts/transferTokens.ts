import { AccountLinesRequest, Payment } from "xrpl";
import { setup } from "../lib/setup";

const TOKEN_ID = "534F4C4F00000000000000000000000000000000";

const TOKEN_ISSUER = "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz";

const TOKEN_NAME = "SOLO";

// Enter the destination address that has the token's Trust Line in place
const DESTINATION = "<destination_address>";

/**
 * Enter the amount to transfer as a string or null to send the entire balance.
 * NOTE: There may be a small leftover balance after the transaction.
 */
const AMOUNT: string | null = null;

async function main() {
  const { ripple, signer, address } = await setup();

  const request: AccountLinesRequest = {
    command: "account_lines",
    account: address,
  };

  const {
    result: { lines },
  } = await ripple.request(request);

  const trustline = lines.find(({ currency }) => currency === TOKEN_ID);

  if (!trustline) {
    throw new Error(
      `There is no ${TOKEN_NAME} trustline set on the provided account`
    );
  }

  const { balance } = trustline;

  if (!balance || !parseFloat(balance)) {
    throw new Error(
      `There is no ${TOKEN_NAME} balance on the provided account`
    );
  }

  const adjustedBalance = parseFloat(balance) - 0.001;

  const amount = AMOUNT ? parseFloat(AMOUNT) : 0;

  if (adjustedBalance < amount) {
    throw new Error(
      `Insufficient ${TOKEN_NAME} balance to transfer ${amount}. Available balance: ${Math.max(
        0,
        adjustedBalance
      )}`
    );
  }

  console.info(`${TOKEN_NAME} balance:`, adjustedBalance);

  let amountToTransfer = AMOUNT;

  if (!AMOUNT || amount === adjustedBalance) {
    amountToTransfer = adjustedBalance.toFixed(15);
  }

  const tx: Payment = {
    TransactionType: "Payment",
    Account: address,
    Destination: DESTINATION,
    Fee: "1000",
    SendMax: {
      currency: TOKEN_ID,
      issuer: TOKEN_ISSUER,
      value: balance,
    },
    Amount: {
      currency: TOKEN_ID,
      issuer: TOKEN_ISSUER,
      value: amountToTransfer as string,
    },
  };

  await signer.submitTransaction(
    tx,
    `Transferring ${amountToTransfer} ${TOKEN_NAME} tokens to address ${DESTINATION}`
  );

  await ripple.disconnect();
}

void main();
