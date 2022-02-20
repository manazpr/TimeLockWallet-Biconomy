import React from "react";
import Header from "./Header";
import DepositsList from "./DepositsList";
import Deposit from "./Deposit";
import { useWeb3React } from "@web3-react/core";

const Main = (): JSX.Element => {
  const { account, chainId } = useWeb3React();
  if (account && chainId !== 42) {
    return <div>Switch to Kovan Test Network</div>;
  }
  return (
   <div className="h-screen max-h-screen h-min-screen w-screen bg-[#2D242F] text-white select-none flex flex-col justify-between">
      <Header />
         {account && (
          <> 
         <Deposit />
         <DepositsList />
         
      </>
         )}
   </div>
  );
};

export default Main;
