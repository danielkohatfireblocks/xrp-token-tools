import { AccountSet } from "xrpl";
import { setup } from "../lib/setup";
import { requestConfirmation } from "../lib/userInput";


async function main() {

    const { ripple, signer, address } = await setup();

    await requestConfirmation("Set auth for trustline must happen before any tokens are issued - please confirm no tokens where issued from the account");

    const tx: AccountSet = {
        TransactionType: "AccountSet",
        Account: address,
        Fee: "15000",
        Flags: {
            tfRequireAuth: true
        },
    };

    await signer.submitTransaction(
        tx,
        `Setting Auth required for TrustLine`
    );

    await ripple.disconnect();

}

void main();