import { contractInvoke } from '@soroban-react/contracts';
import { SorobanContextType } from '@soroban-react/core';
import BigNumber from 'bignumber.js';
import { scValToJs } from 'helpers/convert';
import { xdr } from 'soroban-client';

export async function getTotalLpShares(pairAddress: string, sorobanContext: SorobanContextType) {
  try {
    const response = await contractInvoke({
      contractAddress: pairAddress,
      method: 'total_shares',
      sorobanContext,
    });

    return scValToJs(response as xdr.ScVal) as BigNumber.Value;
  } catch (error) {
    return BigNumber('0');
  }
}
