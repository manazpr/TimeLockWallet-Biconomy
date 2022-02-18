import React, { useEffect , useState } from "react";
import { FiArrowUpRight } from 'react-icons/fi';
import { AiOutlineDown } from 'react-icons/ai';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import Button from "@material-ui/core/Button";
import { useWeb3React } from "@web3-react/core";
import { Injected } from "../connectors/connectors";
import BiconomyLogo from "../assets/biconomy.png";
import ethLogo from "../assets/eth.png";

export default function Header(): JSX.Element {
  const [selectedNav, setSelectedNav] = useState('Deposit');

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
        <div className="flex bg-[#191B1F] rounded-3xl">
          <div
            onClick={() => setSelectedNav('Deposit')}
            className={`$"px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl" ${
              selectedNav === 'Deposit' && "bg-[#20242A]"
            }`}
          >
            Deposit
          </div>
          <div
            onClick={() => setSelectedNav('Claim')}
            className={`$px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl ${
              selectedNav === 'Claim' && "bg-[#20242A]"
            }`}
          >
            Claim
          </div>
  
          <a
            href='https://kovan.etherscan.io/address/0x12ebe9d836cc184d37e7d58be8c801fe202607e3'
            target='_blank'
            rel='noreferrer'
          >
            <div className="px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl">
              Contract <FiArrowUpRight />
            </div>
          </a>
        </div>
      </div>
      <div className="flex w-1/4 justify-end items-center">
        <div className={`$"flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] font-semibold cursor-pointer" $"p-2"`}>
          <div className="flex items-center justify-center w-8 h-8">
            <img src={ethLogo} alt='eth logo' height={20} width={20} />
          </div>
          <p>Kovan</p>
          <div className="flex items-center justify-center w-8 h-8">
            <AiOutlineDown />
          </div>
        </div>     
      </div>
      <div className={`$"flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] font-semibold cursor-pointer" $"p-2"`}>
          <div className={`$"flex items-center justify-center w-8 h-8" mx-2`}>
            <HiOutlineDotsVertical />
          </div>
        </div>
             
             
             
             
             
             
              {active && (<h3>{account}</h3>)}
                <Button
                  color="inherit"
                  onClick={async () => {
                    await (active ? deactivate() : activate(Injected));
                    await (biconomyActive
                      ? biconomyDeactivate()
                      : biconomyActivate(Injected));
                  }}
                >
                  {active ? "Disconnect" : "Connect with Metamask"}
                </Button>

    </div>
  );
}
