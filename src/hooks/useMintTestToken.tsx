import { contractInvoke } from '@soroban-react/contracts';
import { useSorobanReact } from '@soroban-react/core';
import BigNumber from 'bignumber.js';
import { AppContext, SnackbarIconType } from 'contexts';
import { sendNotification } from 'functions/sendNotification';
import { bigNumberToI128 } from 'helpers/utils';
import { useKeys, useTokens } from 'hooks';
import { TokenType } from 'interfaces';
import { useCallback, useContext } from 'react';
import * as SorobanClient from 'soroban-client';

interface MintTestTokenProps {
  onTokenMintedStart?: (token: TokenType) => void;
  onTokenMintedSuccess?: (token: TokenType) => void;
  onTokenMintedError?: (token: TokenType) => void;
}

export function useMintTestToken() {
  const sorobanContext = useSorobanReact();
  const { admin_public, admin_secret } = useKeys(sorobanContext);
  const { tokens } = useTokens();
  const { SnackbarContext } = useContext(AppContext);

  return useCallback(
    async ({
      onTokenMintedStart,
      onTokenMintedSuccess,
      onTokenMintedError,
    }: MintTestTokenProps) => {
      const server = sorobanContext.server;
      const account = sorobanContext.address;

      const amountScVal = bigNumberToI128(BigNumber(2500000).shiftedBy(7));
      let adminSource;

      try {
        adminSource = await server?.getAccount(admin_public);
      } catch (error) {
        alert('Your wallet or the token admin wallet might not be funded');
        return;
      }

      if (!account) {
        return;
      }
      if (!adminSource) {
        return;
      }

      let result;
      let totalMinted = 0;

      for (const token of tokens) {
        try {
          onTokenMintedStart?.(token);
          result = (await contractInvoke({
            contractAddress: token.address,
            method: 'mint',
            args: [new SorobanClient.Address(account).toScVal(), amountScVal],
            sorobanContext,
            signAndSend: true,
            secretKey: admin_secret,
          })) as SorobanClient.SorobanRpc.GetTransactionResponse;

          if (result.status !== SorobanClient.SorobanRpc.GetTransactionStatus.SUCCESS) throw result;

          totalMinted++;
          onTokenMintedSuccess?.(token);
        } catch (error) {
          onTokenMintedError?.(token);
        }
      }

      sendNotification(
        `Minted ${totalMinted} test tokens successfully`,
        'Minted',
        SnackbarIconType.MINT,
        SnackbarContext,
      );

      sorobanContext.connect();
    },
    [SnackbarContext, admin_public, admin_secret, sorobanContext, tokens],
  );
}
