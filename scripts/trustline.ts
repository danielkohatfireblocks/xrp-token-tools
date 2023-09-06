import { AccountInfoRequest, AccountInfoResponse, AccountSetTfFlags, TrustSet } from "xrpl";
import inquirer from 'inquirer';
import { setup } from "../lib/setup";
import { getAnswer, requestConfirmation } from "../lib/userInput";

const TOKEN_ID = "tid";
const TOKEN_ISSUER = "tis";
const TOKEN_NAME = "tn";
const ISSUE_VALUE = "iv";

const getArgs = async () => {

  const tokenId: any = await getAnswer(TOKEN_ID, "Please provide the token ID \\ Symbol");
  const tokenIssuer: any = await getAnswer(TOKEN_ISSUER, "Please provide the token issuer");
  const tokenName: any = await getAnswer(TOKEN_NAME, "Please provide the token name");
  const issueAmount: any = await getAnswer(ISSUE_VALUE, "Please provide the issue value limit");

  return {
    tokenId: tokenId,
    tokenIssuer: tokenIssuer,
    tokenName: tokenName,
    issueAmount: issueAmount
  }

}

async function main() {
  const { ripple, signer, address } = await setup();

  const { tokenId, tokenIssuer, tokenName, issueAmount } = await getArgs();

  const accountData = (await ripple.request({
    command: 'account_info',
    account: tokenIssuer,
    ledger_index: 'current',
  } as AccountInfoRequest)) as AccountInfoResponse;

  if (!accountData) {
    console.warn("Couldn't check if the issuer has auth required for trustline enabled");
  } else {
    await requestConfirmation(
      "Issuer has enabled Auth required for trustline - once you perform the trustline, make sure that the issuer approves you.",
      () => (accountData.result.account_data.Flags & AccountSetTfFlags.tfRequireAuth) !== 0
    );
  }


  console.log(`Trying to create trustline with ${tokenIssuer} for token ${tokenId}.`);
  const tx: TrustSet = {
    TransactionType: "TrustSet",
    Account: address,
    Fee: "15000",
    Flags: 262144,
    LimitAmount: {
      currency: tokenId,
      issuer: tokenIssuer,
      value: issueAmount,
    },
  };

  await signer.submitTransaction(
    tx,
    `Setting TrustLine for ${tokenName} token`
  );

  await ripple.disconnect();
}

void main();
