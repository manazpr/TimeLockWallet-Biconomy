import React, { useState } from "react";
import { Tab } from '@headlessui/react'
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
     <div className="w-full max-w-md px-2 py-16 sm:px-0">
        <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
        <Tab
             className={({ selected }) =>
             
             selected ? 'bg-white shadow'
             : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
             }
         >
                
              Deposit
              
              </Tab>
          <Tab 
             className={({ selected }) =>
             selected ? 'bg-white shadow'
             : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
           }
           
           >
             Claim
           </Tab>
       </Tab.List>
      <Tab.Panels className="mt-2">
        <Tab.Panel>
                 <Deposit/>
        </Tab.Panel>
        <Tab.Panel>
          <DepositsList />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
    </div>
    
    </>
    )}
      
 
      </div>
  );
};

export default Main;
