import { AccountInfoRequest, AccountInfoResponse, AccountSetTfFlags, TrustSet } from "xrpl";
import inquirer from 'inquirer';
import { setup } from "../lib/setup";
import { getAnswer, requestConfirmation } from "../lib/userInput";

const WALLET_ADDRESS = "tid";

async function main() {
  const { ripple, signer, address } = process.argv[2] == undefined ? await setup(false) : await setup(false, process.argv[2]);

  const accountData = (await ripple.request({
    command: 'account_info',
    account: address,
    ledger_index: 'current',
  } as AccountInfoRequest)) as AccountInfoResponse;

  if (!accountData) {
    console.warn("Couldn't check if the issuer has auth required for trustline enabled");
  } else {
    console.log(accountData);
  }

  await ripple.disconnect();
}

void main();
