import { TrustSet } from "xrpl";
import { setup } from "../lib/setup";
import inquirer from "inquirer";

const getArgs = async (): Promise<{ authorizedAddress: string, tokenId: string }> => {

    const answers = await inquirer.prompt([
        {
            name: "authorizedAddress",
            message: "Please provide the address to which you want to authorized the trustline",
            type: "input",
            validate(input, answers) {
                return input && input !== "" ? true : "Invalid address"
            },
        },
        {
            name: "confirmAuthAddress",
            message(answers) {
                return `Please confirm you want to authorize trustline creation by ${answers['authorizedAddress']}`;
            },
            type: 'confirm'
        },
        {
            name: "tid",
            message: "Please provide the token Id",
            type: "input",
            validate(input, answers) {
                return input && input !== "" ? true : "Invalid address"
            },
        },
        {
            name: "confirmTid",
            message(answers) {
                return `Please confirm you want to authorize trustline creation for token ${answers['tid']}`;
            },
            type: 'confirm'
        },

    ]);

    if (!answers['confirmAuthAddress'] || !answers['confirmTid']) {
        return await getArgs();
    }

    return { authorizedAddress: answers['authorizedAddress'], tokenId: answers['tid'] };

}

async function main() {

    const { ripple, signer, address } = await setup();

    const { authorizedAddress, tokenId } = await getArgs();

    const tx: TrustSet = {
        TransactionType: "TrustSet",
        Account: address,
        Fee: "15000",
        LimitAmount: {
            currency: tokenId,
            issuer: authorizedAddress,
            value: "0",
        },

        Flags: {
            tfSetfAuth: true
        },
    };

    await signer.submitTransaction(
        tx,
        `Approving trustline creation for ${authorizedAddress} for token ${tokenId}`
    );

    await ripple.disconnect();

}

void main();