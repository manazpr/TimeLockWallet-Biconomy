import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useWeb3React } from "@web3-react/core";
import DepositCard from "./DepositCard";
import { TimeLockWalletUtil } from "../ethereum/TimeLockWalletUtil";
import { ITimeLockDeposit } from "../types/interfaces";

export default function DepositsList(): JSX.Element {
  const { account, library, chainId } = useWeb3React();
  const [inboundDeposits, setInboundDeposits] = useState<ITimeLockDeposit[]>(
    []
  );

  useEffect(() => {
    try {
      (async () => {
        const timeLockUtil = new TimeLockWalletUtil(library.getSigner(account));
        const deposits = await timeLockUtil.getDepositsByReceiver(
          account as string
        );
        deposits.sort(
          (a, b) =>
            b.minimumReleaseTimestamp.toNumber() -
            a.minimumReleaseTimestamp.toNumber()
        );
        setInboundDeposits(deposits);
      })();
    } catch (e) {
      console.error("Failed to fetch inbound deposits: ", e);
    }
  }, [account, chainId]);

  return (
    <div className="pt-14 justify-center pb-8 flex-1 flex-wrap mx-20">
     <div className="px-2 flex items-center justify-center font-semibold text-xl py-2"><div>Incoming Transactions</div></div>
      {inboundDeposits.map((deposit) => (
        <div className="bg-black rounded-lg py-2 my-1.5 flex items-center justify-center px-6 mx-20" key={deposit.depositId.toNumber()}>
          <DepositCard deposit={deposit} />
        </div>
      ))}
      </div>
);
}
