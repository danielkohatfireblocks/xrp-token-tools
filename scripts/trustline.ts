import { TrustSet } from "xrpl";
import inquirer from 'inquirer';
import { setup } from "../lib/setup";

const TOKEN_ID = "tid";
const TOKEN_ISSUER = "tis";
const TOKEN_NAME = "tn";

const getArgs = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      message: "Please provide the token ID \\ Symbol",
      name: TOKEN_ID,
      validate(input, answers) {
        return input && input !== "" ? true : "Bad"
      },
    },
    {
      type: "confirm",
      name: "ConfirmID",
      message(answers) {
        return `Please confirm token ID \\ Symbol: ${answers[TOKEN_ID]}`
      },
    },
    {
      type: "input",
      message: "Please provide the token issuer",
      name: TOKEN_ISSUER,
      validate(input, answers) {
        return input && input !== ""
      },
    },
    {
      type: "confirm",
      name: "ConfirmIssuer",
      message(answers) {
        return `Please confirm token issuer: ${answers[TOKEN_ISSUER]}`
      },
    },
    {
      type: "input",
      message: "Please provide the token name",
      name: TOKEN_NAME,
      validate(input, answers) {
        return input && input !== ""
      },
    },
    {
      type: "confirm",
      name: "ConfirmName",
      message(answers) {
        return `Please confirm token name: ${answers[TOKEN_NAME]}`
      },
    }
  ]);

  return {
    tokenId: answers[TOKEN_ID],
    tokenIssuer: answers[TOKEN_ISSUER],
    tokenName: answers[TOKEN_NAME]
  }

}

async function main() {
  const { ripple, signer, address } = await setup();

  const { tokenId, tokenIssuer, tokenName } = await getArgs();

  const tx: TrustSet = {
    TransactionType: "TrustSet",
    Account: address,
    Fee: "15000",
    Flags: 262144,
    LimitAmount: {
      currency: tokenId,
      issuer: tokenIssuer,
      value: "200000000",
    },
  };

  await signer.submitTransaction(
    tx,
    `Setting TrustLine for ${tokenName} token`
  );

  await ripple.disconnect();
}

void main();
