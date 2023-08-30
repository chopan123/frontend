import { SorobanContextType, useSorobanReact } from "@soroban-react/core";
import { contractInvoke, useContractValue } from "@soroban-react/contracts";
import {
  scvalToBigNumber,
  accountToScVal,
} from "../helpers/utils";
import { formatAmount } from "../helpers/utils";
import { TokenMapType, TokenType } from "../interfaces";
import { scValStrToJs } from "helpers/convert";
import BigNumber from "bignumber.js";
import { useEffect, useMemo, useState } from "react";
//TODO: create Liquidity Pool Balances

export function useTokenScVal(tokenAddress: string, userAddress: string) {
  const sorobanContext = useSorobanReact();

  const address = useMemo(() => userAddress, [userAddress]);

  const user = accountToScVal(address);

  const tokenBalance = useContractValue({
    contractAddress: tokenAddress,
    method: "balance",
    args: [user],
    sorobanContext: sorobanContext,
  });

  return tokenBalance
}

export function useTokenDecimals(tokenAddress: string) {
  const sorobanContext = useSorobanReact();

  const decimals = useContractValue({
    contractAddress: tokenAddress,
    method: "decimals",
    sorobanContext: sorobanContext,
  });

  // tokenDecimals
  return useMemo(() => {
    return decimals?.result?.u32() ?? 7;
  }, [decimals])
}

export function useFormattedTokenBalance(
  tokenAddress: string,
  userAddress: string,
) {
  console.log("useFormattedTokenBalance rerendered")
  const tokenBalance = useTokenScVal(tokenAddress, userAddress);
  const tokenDecimals = useTokenDecimals(tokenAddress);

  const formattedBalance = useMemo(() => {
    return formatAmount(
      scvalToBigNumber(tokenBalance?.result),
      tokenDecimals,
    );
  }, [tokenBalance?.result, tokenDecimals])

  return formattedBalance;
}

export function useTokenBalances(userAddress: string, tokens: TokenType[] | TokenMapType) {
  const sorobanContext = useSorobanReact();
  const initBalances = Object.values(tokens).map((token) => {
    return {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      balance: "",
      usdValue: 0,//TODO: should get usd value
      symbol: token.symbol,
      address: token.address,
    };
  })
  const [balances, setBalances] = useState<{ balances: { balance: string; usdValue: number; symbol: string; address: string; }[]; loading: boolean; } | undefined>
    ({
      balances: initBalances,
      loading: true
    })

  useEffect(() => {
    tokenBalances(userAddress, tokens, sorobanContext)
      .then((bal) => {
        console.log("useBalances then")
        setBalances(bal)
      })
  }, [sorobanContext, tokens, userAddress])


  return balances

}

export function useTokenBalance(userAddress: string, token: TokenType) {
  const address = userAddress;
  const formattedTokenBalance = useFormattedTokenBalance(token.address, address)

  const balance = useMemo(() => {
    return {
      balance: formattedTokenBalance,
      usdValue: 0,//should get usd value
      symbol: token.symbol,
      address: token.address,
    };

  }, [formattedTokenBalance, token.address, token.symbol])

  // Calculate the loading state
  const loading = false;

  return useMemo(() => {
    return {
      balance: balance,
      loading: loading,
    };
  }, [balance, loading])
}

export async function tokenBalance(tokenAddress: string, userAddress: string, sorobanContext: SorobanContextType) {
  const user = accountToScVal(userAddress);

  try {
    const tokenBalance = await contractInvoke({
      contractAddress: tokenAddress,
      method: "balance",
      args: [user],
      sorobanContext,
    });

    return scValStrToJs(tokenBalance?.xdr ?? "") as BigNumber.Value;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return 0; // or throw error;
  }
}

export async function tokenDecimals(tokenAddress: string, userAddress: string, sorobanContext: SorobanContextType) {
  try {
    const decimals = await contractInvoke({
      contractAddress: tokenAddress,
      method: "decimals",
      sorobanContext,
    });
    const tokenDecimals = scValStrToJs(decimals?.xdr ?? "") as number ?? 7;

    return tokenDecimals;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return 7; // or throw error;
  }
}


export async function tokenBalances(userAddress: string, tokens: TokenType[] | TokenMapType | undefined, sorobanContext: SorobanContextType) {
  if (!tokens || !sorobanContext) return;

  const balances = await Promise.all(
    Object.values(tokens).map(async (token) => {
      const balanceResponse = await tokenBalance(token.address, userAddress, sorobanContext);
      const decimalsResponse = await tokenDecimals(token.address, userAddress, sorobanContext);

      const formattedBalance = formatAmount(
        BigNumber(balanceResponse),
        decimalsResponse,
      );

      return {
        balance: formattedBalance,
        usdValue: 0, //TODO: should get usd value
        symbol: token.symbol,
        address: token.address,
      };
    })
  );


  // Calculate the loading state
  const loading = balances.some((balance) => balance.balance === null);

  return {
    balances: balances,
    loading: loading,
  };
}
