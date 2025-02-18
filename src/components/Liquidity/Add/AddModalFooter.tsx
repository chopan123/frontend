import { styled, useTheme } from '@mui/material';
import BigNumber from 'bignumber.js';
import { ButtonError } from 'components/Buttons/Button';
import Column from 'components/Column';
import Row, { AutoRow } from 'components/Row';
import { SwapCallbackError } from 'components/Swap/styleds';
import { BodySmall, HeadlineSmall } from 'components/Text';
import { MouseoverTooltip } from 'components/Tooltip';
import { TokenType } from 'interfaces';
import { useMemo, useState } from 'react';
import { AlertTriangle } from 'react-feather';
import { Field } from 'state/mint/actions';
import { Label } from './AddModalHeader';
import { useUserSlippageToleranceWithDefault } from 'state/user/hooks';
import { DEFAULT_SLIPPAGE_INPUT_VALUE } from 'components/Settings/MaxSlippageSettings';
import CurrencyLogo from 'components/Logo/CurrencyLogo';

const DetailsContainer = styled(Column)`
  padding: 0 8px;
`;

const StyledAlertTriangle = styled(AlertTriangle)`
  margin-right: 8px;
  min-width: 24px;
`;

const ConfirmButton = styled(ButtonError)`
  height: 56px;
  margin-top: 10px;
`;

const DetailRowValue = styled(
  ({
    component = 'div',
    children,
    ...props
  }: {
    component?: string;
    children: React.ReactNode;
    [x: string]: any;
  }) => (
    <BodySmall component={component} {...props}>
      {children}
    </BodySmall>
  ),
)`
  text-align: right;
  overflow-wrap: break-word;
`;

type TokensType = [string, string];

export default function AddModalFooter({
  currencies,
  formattedAmounts,
  totalShares,
  onConfirm,
  shareOfPool,
}: {
  currencies: { [field in Field]?: TokenType };
  formattedAmounts: { [field in Field]?: string };
  totalShares: string;
  onConfirm: () => void;
  shareOfPool?: string;
}) {
  const theme = useTheme();

  const [disabledConfirm, setDisabledConfirm] = useState<boolean>(false);
  // const [shareOfPool, setShareOfPool] = useState<string>("")

  const currencyA = useMemo(() => {
    return currencies.CURRENCY_A;
  }, [currencies]);

  const currencyB = useMemo(() => {
    return currencies.CURRENCY_B;
  }, [currencies]);

  const swapErrorMessage = useMemo(() => {
    return '';
  }, []);

  const userSlippage = useUserSlippageToleranceWithDefault(DEFAULT_SLIPPAGE_INPUT_VALUE);

  const rate = useMemo(() => {
    if (!formattedAmounts.CURRENCY_A || !formattedAmounts.CURRENCY_B) return;
    const amountA = new BigNumber(formattedAmounts.CURRENCY_A);
    const amountB = new BigNumber(formattedAmounts.CURRENCY_B);

    return `1 ${currencyA?.symbol} = ${amountB.dividedBy(amountA).toFixed(6)} ${currencyB?.symbol}`;
  }, [currencyA, currencyB, formattedAmounts]);

  return (
    <>
      <BodySmall component="div">
        {' '}
        If prices change more than {userSlippage}%, the transaction will revert
      </BodySmall>
      <DetailsContainer gap="md">
        <BodySmall component="div">
          <Row align="flex-start" justify="space-between" gap="sm">
            <Label>{currencyA?.name} to deposit</Label>
            <DetailRowValue style={{ display: 'flex', alignItems: 'center' }}>
              {`${formattedAmounts.CURRENCY_A} ${currencyA?.symbol}`}{' '}
              <CurrencyLogo currency={currencyA} size="16px" style={{ marginLeft: '6px' }} />
            </DetailRowValue>
          </Row>
        </BodySmall>
        <BodySmall component="div">
          <Row align="flex-start" justify="space-between" gap="sm">
            <Label>{currencyB?.name} to deposit</Label>
            <DetailRowValue style={{ display: 'flex', alignItems: 'center' }}>
              {`${formattedAmounts.CURRENCY_B} ${currencyB?.symbol}`}{' '}
              <CurrencyLogo currency={currencyB} size="16px" style={{ marginLeft: '6px' }} />
            </DetailRowValue>
          </Row>
        </BodySmall>

        <BodySmall component="div">
          <Row align="flex-start" justify="space-between" gap="sm">
            <MouseoverTooltip title={'The current rate for this pool'}>
              <Label cursor="help">Rate</Label>
            </MouseoverTooltip>
            <DetailRowValue>{rate}</DetailRowValue>
          </Row>
        </BodySmall>

        <BodySmall component="div">
          <Row align="flex-start" justify="space-between" gap="sm">
            <MouseoverTooltip
              title={
                'If prices change more than the allowed slippage percentage, the transaction will revert'
              }
            >
              <Label cursor="help">Maximum slippage</Label>
            </MouseoverTooltip>
            <DetailRowValue>{userSlippage}%</DetailRowValue>
          </Row>
        </BodySmall>

        <BodySmall component="div">
          <Row align="flex-start" justify="space-between" gap="sm">
            <MouseoverTooltip title={<div>The percentage of shares you will have.</div>}>
              <Label cursor="help">Share of Pool</Label>
            </MouseoverTooltip>
            <DetailRowValue>{shareOfPool}</DetailRowValue>
          </Row>
        </BodySmall>
      </DetailsContainer>
      <AutoRow>
        <ConfirmButton
          data-testid="confirm-swap-button"
          onClick={onConfirm}
          disabled={disabledConfirm}
          $borderRadius="20px"
          id={'CONFIRM_SWAP_BUTTON'}
        >
          <HeadlineSmall color={theme.palette.custom.accentTextLightPrimary}>
            Add liquidity
          </HeadlineSmall>
        </ConfirmButton>
        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  );
}
