import { SorobanContextType } from '@soroban-react/core';
import BigNumber from 'bignumber.js';

export default function fromExactInputGetExpectedOutput(
  amountIn: BigNumber | undefined,
  reserve0: BigNumber | undefined,
  reserve1: BigNumber | undefined,
  decimals: number = 7,
): BigNumber {
  if (!amountIn || !reserve0 || !reserve1) return BigNumber(0);

  return getExpectedAmountFromReserves(amountIn, reserve0, reserve1).dp(decimals); //TODO: dp is like toFixed(2) to force it to give 2 decimals, should it be the decimals of the token?
}

function getExpectedAmountFromReserves(
  amountIn: BigNumber,
  reserveIn: BigNumber,
  reserveOut: BigNumber,
): BigNumber {
  if (amountIn.isEqualTo(0)) return amountIn;
  if (reserveIn.isEqualTo(0) || reserveOut.isEqualTo(0)) return BigNumber(0);
  let amountInWithFee = amountIn.multipliedBy(997);
  let numerator = amountInWithFee.multipliedBy(reserveOut);
  let denominator = reserveIn.multipliedBy(1000).plus(amountInWithFee);
  const result1 =  numerator.dividedBy(denominator);

  const fee1000 = 3 // 0.3%, 
  const gamma1000 = BigNumber(1000).minus(fee1000)

  const result2 =  reserveOut
  .multipliedBy(amountIn)
  .multipliedBy(gamma1000)
  .dividedBy(reserveIn.plus(
    amountIn.multipliedBy(gamma1000).dividedBy(BigNumber(1000))
  )).dividedBy(BigNumber(1000))

  console.log("amountIn:", amountIn.toString())
  console.log("reserveIn:", reserveIn.toString())
  console.log("reserveOut:", reserveOut.toString())
  console.log("getExpectedAmountFromReserves: result1", result1.toString() )
  console.log("getExpectedAmountFromReserves: result2", result2.toString() )

  return result1
}
