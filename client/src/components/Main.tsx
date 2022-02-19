import React, { useState } from "react";
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
   <>
      <Header />
      {account && (
          <> 
     <Deposit /><DepositsList/>
     
    
    </>
    )}
      
 
    </>
  );
};

export default Main;
