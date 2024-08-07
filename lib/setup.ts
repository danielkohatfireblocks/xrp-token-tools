import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Client as RippleClient } from "xrpl";
import { FireblocksSDK } from "fireblocks-sdk";
import { XrpSigner } from "./signer";

dotenv.config();

export const getRequiredVariable = (key: string) => {
  const variable = process.env[key];

  if (typeof variable === "undefined") {
    throw new Error(`${key} environment variable is not defined`);
  }

  return variable;
};

/**
 * Setup API clients and get environment-dependent values
 *
 * @returns environment-dependent values (constants and API clients)
 */
export const setup = async (initSigner: boolean = true, inputAddress: string = "") => {
  const assetId = process.env.ASSET_ID || "XRP";
  const rippleRpcUrl = process.env.RIPPLE_RPC_URL || "wss://xrplcluster.com";

  const fireblocksApiKey = getRequiredVariable("FIREBLOCKS_API_KEY");
  const fireblocksPathToApiSecretKey = getRequiredVariable(
    "FIREBLOCKS_PATH_TO_API_SECRET_KEY"
  );
  const fireblocksVaultAccountIdString = getRequiredVariable(
    "FIREBLOCKS_VAULT_ACCOUNT_ID"
  );

  const fullApiSecretPath = path.resolve(
    __dirname,
    fireblocksPathToApiSecretKey
  );

  if (!fs.existsSync(fullApiSecretPath)) {
    throw new Error(
      `Fireblocks API secret key file does not exist at ${fireblocksPathToApiSecretKey}`
    );
  }

  const fireblocksApiSecret = await fs.promises.readFile(
    fullApiSecretPath,
    "utf8"
  );

  const fireblocks = new FireblocksSDK(fireblocksApiSecret, fireblocksApiKey);

  let address = "", vaultAccountId = 0;
  if (inputAddress == "") {
    [{ address }] = await fireblocks.getDepositAddresses(
      fireblocksVaultAccountIdString,
      assetId
    );

    vaultAccountId = parseInt(fireblocksVaultAccountIdString);
    console.info(
      `Using Vault Account ${vaultAccountId} and ${assetId} address ${address}`
    );
  } else {
    address = inputAddress; vaultAccountId = 0;

    console.info(
      `NOT using Fireblocks vaults, only address ${address}`
    );  
  }


  const ripple = new RippleClient(rippleRpcUrl);

  await ripple.connect();

  const signer = initSigner ? new XrpSigner(ripple, fireblocks, assetId, vaultAccountId) : null;

  return {
    ripple,
    signer,
    address,
  };
};
