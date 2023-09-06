import { AccountSet } from "xrpl";
import { setup } from "../lib/setup";

async function main() {

    const { ripple, signer, address } = await setup();

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