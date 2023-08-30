import React, { useCallback, useState } from "react";
import { SorobanContextType } from "@soroban-react/core";
import Button from "@mui/material/Button";

import * as SorobanClient from "soroban-client";
import BigNumber from "bignumber.js";
import {
  contractTransaction
} from "@soroban-react/contracts";
import { useKeys } from "../../hooks";
import { bigNumberToI128 } from "../../helpers/utils";
import { contractInvoke } from "@soroban-react/contracts";

interface MintButtonProps {
  sorobanContext: SorobanContextType;
  tokenId: string;
  amountToMint: BigNumber;
}

export function MintButton({
  sorobanContext,
  tokenId,
  amountToMint,
}: MintButtonProps) {
  const [isSubmitting, setSubmitting] = useState(false);
  const networkPassphrase = sorobanContext.activeChain?.networkPassphrase ?? "";
  const server = sorobanContext.server;
  const account = sorobanContext.address;
  // const { admin_public, admin_secret } = useKeys();
  // const { admin_public, admin_secret } = useKeys(sorobanContext);
  const { admin_public, admin_secret } = { admin_public: "", admin_secret: "" }

  const mintTokens = useCallback(() => {
    async function mintTokensAsync() {

      // const mintTokens = async () => {
      setSubmitting(true);

      //Parse amount to mint to BigNumber and then to i128 scVal
      const amountScVal = bigNumberToI128(amountToMint.shiftedBy(7));

      let adminSource;

      try {
        adminSource = await server?.getAccount(admin_public);
      } catch (error) {
        alert("Your wallet or the token admin wallet might not be funded");
        setSubmitting(false);
        return;
      }

      if (!account) {
        console.log("Error on account:", account)
        return
      }
      if (!adminSource) {
        console.log("Error on adminSource:", adminSource)
        return
      }
      console.log("🚀 ~ file: MintButton.tsx:70 ~ mintTokens ~ networkPassphrase:", networkPassphrase)
      console.log("🚀 ~ file: MintButton.tsx:68 ~ mintTokens ~ adminSource:", adminSource)
      console.log("🚀 ~ file: MintButton.tsx:72 ~ mintTokens ~ tokenId:", tokenId)
      console.log("🚀 ~ file: MintButton.tsx:75 ~ mintTokens ~ account:", account)


      try {

        let result = await contractInvoke({
          contractAddress: tokenId,
          method: "mint",
          args: [new SorobanClient.Address(account).toScVal(), amountScVal],
          sorobanContext,
          signAndSend: true,
          secretKey: admin_secret
        })


        if (result) {
          alert("Success!");
        }


        //This will connect again the wallet to fetch its data
        sorobanContext.connect();
      } catch (error) {
        console.log("🚀 « error: sendTransaction: ", error);
      }
      console.log("minting tokens")
      setSubmitting(false);
      // };
    }
    mintTokensAsync()
  }, [account, admin_public, admin_secret, amountToMint, networkPassphrase, server, sorobanContext, tokenId])

  return (
    <Button variant="contained" onClick={mintTokens} disabled={isSubmitting}>
      Mint!
    </Button>
  );
}
