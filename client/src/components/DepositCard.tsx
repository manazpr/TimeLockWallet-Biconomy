import React, { useState, useEffect, useContext } from "react";
import Countdown from "react-countdown";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Decimal } from "decimal.js";
import { useWeb3React } from "@web3-react/core";
import { ERC20Util } from "../ethereum/ERC20Util";
import { TimeLockWalletUtil } from "../ethereum/TimeLockWalletUtil";
import { IInboundDepositProps, TimeLockDepositType } from "../types/interfaces";
import { ProviderContext } from "../context/providercontext";
import ethLogo from "../assets/eth.png";

export default function DepositCard(props: IInboundDepositProps) {
  const { library, chainId, account } = useWeb3React();
  const { library: biconomyLibrary, account: biconomyAccount } =
    useWeb3React("biconomy");
  const { biconomyInitialized } = useContext(ProviderContext);

  const [decimals, setDecimals] = useState<number | null>(null);
  const [displayAmount, setDisplayAmount] = useState<Decimal | null>(null);
  const [loading, setLoading] = useState(false);

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
      const timeLockWalletUtil = new TimeLockWalletUtil(
        biconomyLibrary.getSigner(biconomyAccount)
      );
      setLoading(true);
      await timeLockWalletUtil.claimDeposit(props.deposit.depositId);
      setLoading(false);
      window.location.reload(false);
    } else {
      console.log("Biconomy Not Initialized");
    }
  };

  return (
  <div className="bg-white rounded-3xl border shadow-xl p-8 w-3/6 align-center justify-end ">
    <div className="flex justify-between items-center mb-4">
    <img src={ethLogo} alt='eth logo' height={80} width={80}/>
    <h1 className="font-bold text-xl text-gray-700">{displayAmount != null && <>{displayAmount.toString()}</>}{" "}
          {props.deposit.depositType === TimeLockDepositType.ETH
            ? "ETH"
            : "Tokens"}</h1>
        
      <div>
      <span className="font-medium text-xs text-gray-500 flex justify-end">Received From</span>
      <span className="font-bold text-green-500 flex justify-end">{props.deposit.depositor}</span><br /><br />
      <span className="font-medium text-xs text-gray-500 flex justify-end">Status</span>
        <span className="flex justify-end font-bold text-red-500 ">
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
                    props.deposit.minimumReleaseTimestamp.toNumber() * 1000
                  )
                }
              />
            </>
          )}
      </span>
      </div>
    </div>
    <div>
           {props.deposit.claimed || (
          <div
            onClick={claim} className="bg-blue-700 my-1 rounded-2xl py-3 px-1 text-white font-color-white font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]"
          >
            Claim
          </div>
     
      )}
      {loading && <LinearProgress />}
    </div>
  </div>

  );
}
