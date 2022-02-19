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
   
    <Grid container spacing={1}>
      
      {inboundDeposits.map((deposit) => (
        <Grid item xs={12} key={deposit.depositId.toNumber()}>
          <DepositCard deposit={deposit} />
        </Grid>
      ))}
    </Grid>
 
);
}
