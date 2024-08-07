import { AccountLinesRequest, AccountLinesResponse, AccountSetTfFlags, TrustSet } from "xrpl";
import inquirer from 'inquirer';
import { setup } from "../lib/setup";
import { getAnswer, requestConfirmation } from "../lib/userInput";

const WALLET_ADDRESS = "tid";

async function main() {
  const { ripple, signer, address } = process.argv[2] == undefined ? await setup(false) : await setup(false, process.argv[2]);

  const accountData = (await ripple.request({
    command: 'account_lines',
    account: address,
    ledger_index: 'current',
  } as AccountLinesRequest)) as AccountLinesResponse;

  if (!accountData) {
    console.warn("Couldn't check if the issuer has auth required for trustline enabled");
  } else {
    console.log(accountData);
    console.log(accountData.result.lines);
  }

  await ripple.disconnect();
}

void main();
