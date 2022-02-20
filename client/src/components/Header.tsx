import React, { useEffect } from "react";
import { FiArrowUpRight } from 'react-icons/fi';
import { AiOutlineDown } from 'react-icons/ai';
import { useWeb3React } from "@web3-react/core";
import { Injected } from "../connectors/connectors";
import BiconomyLogo from "../assets/biconomy.png";
import ethLogo from "../assets/eth.png";

export default function Header(): JSX.Element {
  const connectWallet = async () => {
    await (active ? deactivate() : activate(Injected));
    await (biconomyActive
      ? biconomyDeactivate()
      : biconomyActivate(Injected));
  }

  const { activate, deactivate, active, account } = useWeb3React();

  const {
    activate: biconomyActivate,
    deactivate: biconomyDeactivate,
    active: biconomyActive,
  } = useWeb3React("biconomy");

  useEffect(() => {
    (async () => {
      const isAuthorized: boolean = await Injected.isAuthorized();
      if (isAuthorized) {
        await activate(Injected, undefined, true);
        await biconomyActivate(Injected, undefined, true);
      }
    })();
  }, []);

  return (
    <div className="p-4 w-screen flex justify-between items-center">
      <div className="flex w-1/4 items-center justify-start">
        <img src={BiconomyLogo} alt='biconomy' height={70} width={140} />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="flex bg-gray-900 rounded-3xl">
          <div className=
            "px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl" >
            TimeLock Wallet
          </div>
          <a
            href='https://kovan.etherscan.io/address/0x12ebe9d836cc184d37e7d58be8c801fe202607e3'
            target='_blank'
            rel='noreferrer'>
            <div className="px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl">
              Contract <FiArrowUpRight />
            </div>
          </a>
        </div>
      </div>
      <div className="flex w-1/4 justify-end items-center">
        <div className="flex items-center bg-gray-900 rounded-2xl mx-2 text-[0.9rem] font-semibold cursor-pointer p-2">
          <div className="flex items-center justify-center w-8 h-8">
            <img src={ethLogo} alt='eth logo' height={20} width={20} />
          </div>
          <p>Kovan</p>
          <div className="flex items-center justify-center w-8 h-8">
            <AiOutlineDown />
          </div>
        </div>     
      </div>    
        {active ? (
          <div className="flex items-center bg-gray-900 rounded-2xl mx-2 text-[0.9rem] font-semibold cursor-pointer p-2">
            <div onClick={async() => connectWallet()} className="h-8 flex items-center">{account?.slice(0,7)}...{account?.slice(35)}</div>
          </div>
        ) : (
          <div
            onClick={async() => connectWallet()}
            className="flex items-center rounded-2xl mx-2 text-[0.9rem] font-semibold cursor-pointer p-2"
          >
            <div className="bg-blue-900 border border-blue-900 hover:border-blue-900 rounded-2xl flex items-center justify-center text-gray-100 p-2">
              {active ? "Disconnect" : "Connect Wallet"}
            </div>
          </div>
        )}
             
            
    </div>
  );
}
