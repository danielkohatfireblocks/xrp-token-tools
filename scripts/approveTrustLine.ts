import { TrustSet } from "xrpl";
import { setup } from "../lib/setup";
import { getAnswer } from "../lib/userInput";

const getArgs = async (): Promise<{ authorizedAddress: string, tokenId: string }> => {

    const authAddr = await getAnswer('authAddr', "Please provide the address to which you want to authorized the trustline");
    const tokenId = await getAnswer('tid', "Please provide the token Id");

    return { authorizedAddress: authAddr, tokenId: tokenId };

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