import React, { useState, useEffect, useContext } from "react";
import Countdown from "react-countdown";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Decimal } from "decimal.js";
import { useWeb3React } from "@web3-react/core";
import { ERC20Util } from "../ethereum/ERC20Util";
import { TimeLockWalletUtil } from "../ethereum/TimeLockWalletUtil";
import { IInboundDepositProps, TimeLockDepositType } from "../types/interfaces";
import { ProviderContext } from "../context/providercontext";
import ethLogo from "../assets/ethCurrency.png";

export default function DepositCard(props: IInboundDepositProps) {
  const { library, chainId, account } = useWeb3React();
  const { library: biconomyLibrary, account: biconomyAccount } =
    useWeb3React("biconomy");
  const { biconomyInitialized } = useContext(ProviderContext);

  const [decimals, setDecimals] = useState<number | null>(null);
  const [displayAmount, setDisplayAmount] = useState<Decimal | null>(null);
  const [loading, setLoading] = useState(false);

  const style = {
    wrapper: `h-full text-white select-none h-full flex-1 pt-14 flex items-end justify-end pb-12 px-8`,
    txHistoryItem: `bg-gray-900 rounded-lg mx-3 px-4 py-2 my-2 flex items-center justify-end`,
    txDetails: `flex items-center mx-1`,
    toAddress: `text-green-500 mx-4`,
    txTimestamp: `mx-6 text-red-700`,
    claimButton: `flex items-center`,
    Button: `bg-blue-600 my-3 rounded-3xl py-1.5 px-6 text-white font-color-white font-semibold flex items-center justify-center cursor-pointer border border-blue-600 hover:border-blue-400`
  }

  useEffect(() => {
    (async () => {
      try {
        if (props.deposit.depositType === TimeLockDepositType.ETH) {
          setDecimals(18);
        } else {
          const erc20util = new ERC20Util(
            library.getSigner(account),
            props.deposit.erc20Token as string
          );
          setDecimals(await erc20util.decimals());
        }
      } catch (e) {
        console.log("Error retrieving decimals: ", e);
        setDecimals(null);
      }
    })();
  }, [props.deposit, account, chainId]);

  useEffect(() => {
    if (decimals != null) {
      setDisplayAmount(
        new Decimal(props.deposit.amount.toString()).div(
          new Decimal(10).pow(decimals)
        )
      );
    } else {
      setDisplayAmount(null);
    }
  }, [decimals]);

  const claim = async () => {
    if (biconomyInitialized) {
      const timeLockUtil = new TimeLockWalletUtil(
        biconomyLibrary.getSigner(biconomyAccount)
      );
      setLoading(true);
      await timeLockUtil.claimDeposit(props.deposit.depositId);
      setLoading(false);
      window.location.reload(false);
    } else {
      console.log("Biconomy Not Initialized");
    }
  };

  return (
<>
      <div className={style.txDetails}>
        <img src={ethLogo} height={20} width={15} alt='eth' />
           {displayAmount != null && <>{displayAmount.toString()}</>}{" "}
           {props.deposit.depositType === TimeLockDepositType.ETH
            ? "Ξ"
            : "Tokens"} received from{' '}
                <span className={style.toAddress}>
                  {props.deposit.depositor.substring(0, 6)}... {props.deposit.depositor.substring(36)}
                </span>
              </div>{' '}
              Status{' '}
              <div className={style.txTimestamp}>
               {props.deposit.claimed ? (
               "Claimed"
            ) : (
            <>
              {`${new Date(
                props.deposit.minimumReleaseTimestamp.toNumber() * 1000
              ).toLocaleString()}`}
              <br />
              {" "}
              <Countdown
                date={
                  new Date(
                    props.deposit.minimumReleaseTimestamp.toNumber() * 1000 )
                }/>
            </>
             )}
            </div>
            <div className={style.claimButton}>
              {props.deposit.claimed || (
                   <div
                     onClick={claim} className={style.Button}
                    >
                   Claim
                   </div>
              )}
              {loading && <LinearProgress />}
             </div> 
   </>
  );
}
