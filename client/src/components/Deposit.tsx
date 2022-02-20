import React, { useState, useEffect} from "react";
import { useWeb3React } from "@web3-react/core";
import { Decimal } from "decimal.js";
import { ethers } from "ethers";
import ethLogo from '../assets/eth.png';
import { TimeLockWalletUtil } from "../ethereum/TimeLockWalletUtil";
import { ERC20Util } from "../ethereum/ERC20Util";
import { TimeLockDepositType } from "../types/interfaces";

const style = {
  wrapper: `flex items-center justify-center mt-10`,
  content: `bg-gray-900 w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-gray-800 my-3 rounded-2xl p-6 text-3xl  border border-gray-800 hover:border-gray-600  flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-gray-200 outline-none mb-6 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-gray-700 hover:bg-gray-600 rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-blue-700 my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
}

export default function Deposit(): JSX.Element {
  const { library, account } = useWeb3React();
  const signer: ethers.Signer = library.getSigner(account);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [unlockDate, setUnlockDate] = useState<Date>(new Date());
  const [depositType, setDepositType] = useState<TimeLockDepositType>(
    TimeLockDepositType.ETH
  );
  const [amount, setAmount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [balance, setBalance] = useState<Decimal>(new Decimal(0));

  const isValidEthAddress = (address: string): boolean =>
    /^0x[a-fA-F0-9]{40}$/.test(address);

  const toIsoString = (date: Date): string => {
    var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? "+" : "-",
      pad = function (num: number) {
        var norm = Math.floor(Math.abs(num));
        return (norm < 10 ? "0" : "") + norm;
      };

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds()) +
      dif +
      pad(tzo / 60) +
      ":" +
      pad(tzo % 60)
    );
  };


  const createEthDeposit = async () => {
    try {
      const actualTokenAmount = ethers.BigNumber.from(
        new Decimal(amount).mul(new Decimal(10).pow(18)).toFixed()
      );
      const timeLockWallet = new TimeLockWalletUtil(signer);

      setStatusMessage("Creating Deposit...");
      await timeLockWallet.createEthTimeLockDeposit(
        recipientAddress as string,
        Math.floor((unlockDate?.getTime() as number) / 1000),
        actualTokenAmount
      );
      setStatusMessage("");
      window.location.reload();
    } catch (e) {
      console.error("Error Creating ERC20 Deposit: ", e);
    }
  };

  const createErc20Deposit = async () => {
    try {
      const erc20token = new ERC20Util(signer, tokenAddress as string);
      const decimals = await erc20token.decimals();
      const actualTokenAmount = ethers.BigNumber.from(
        new Decimal(amount).mul(new Decimal(10).pow(decimals)).toFixed()
      );
      const timeLockWallet = new TimeLockWalletUtil(signer);
      setStatusMessage("Processing Token Approval...");
      await erc20token.approve(
        process.env.REACT_APP_CONTRACT_ADDRESS as string,
        actualTokenAmount
      );

      setStatusMessage("Creating Deposit...");
      await timeLockWallet.createErc20TimeLockDeposit(
        recipientAddress as string,
        Math.floor((unlockDate?.getTime() as number) / 1000),
        tokenAddress as string,
        actualTokenAmount
      );
      setStatusMessage("");
      window.location.reload();
    } catch (e) {
      console.error("Error Creating ERC20 Deposit: ", e);
    }
  };

  useEffect(() => {
    (async () => {
      if (depositType === TimeLockDepositType.ERC20) {
        if (isValidEthAddress(tokenAddress)) {
          try {
            const erc20token = new ERC20Util(signer, tokenAddress as string);
            const tokenBalance = await erc20token.balanceOf(account as string);
            const decimals = await erc20token.decimals();
            const actualBalance = new Decimal(tokenBalance.toString()).div(
              new Decimal(10).pow(decimals)
            );
            setBalance(actualBalance);
            setStatusMessage(`Token Balance: ${actualBalance.toFixed(5)}`);
          } catch (e) {
            setStatusMessage("Not a valid ERC20 token");
          }
        }
      } else if (depositType === TimeLockDepositType.ETH) {
        const ethBalance: ethers.BigNumber = await library.getBalance(account);

        const actualBalance = new Decimal(ethBalance.toString()).div(
          new Decimal(10).pow(18)
        );
        setBalance(actualBalance);
        setStatusMessage(`ETH Balance: ${actualBalance.toFixed(5)}`);
      }
    })();
  }, [depositType, tokenAddress]);

  return (
    <div>
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Deposit</div>
          <div>
         {statusMessage}
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type='number'
            className={style.transferPropInput}
            placeholder='Amount'
            onChange={(event) => setAmount(parseFloat(event.target.value))}
            required  
          />
              <div className="flex items-center p-2">
                <img src={ethLogo} alt='eth logo' height={50} width={50} />
              </div>
                <select value={
                {
                  [TimeLockDepositType.ETH]: "ETH",
                  [TimeLockDepositType.ERC20]: "ERC20",
                }[depositType]
              }
              onChange={(event) =>
                setDepositType(
                  {
                    ETH: TimeLockDepositType.ETH,
                    ERC20: TimeLockDepositType.ERC20,
                  }[event.target.value] as TimeLockDepositType
                )
              } className="w-min h-min flex justify-between items-center bg-gray-800 hover:bg-gray-800 rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]">
                <option value="ETH" label="ETH" className={style.currencySelectorTicker}>
                  ETH
               </option>
                <option value="ERC20" label="ERC20">
                  ERC20
                </option>
              </select>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type='text'
            className={style.transferPropInput}
            placeholder='Address (0x...)'
            onChange={(event) => setRecipientAddress(event.target.value)}
            required />
          
          <div className={style.currencySelector}></div>
        </div>
        {depositType === TimeLockDepositType.ERC20 && (       
        <div className={style.transferPropContainer}>
          <input
            type='text'
            className={style.transferPropInput}
            placeholder='Token Contract'
            onChange={(event) => setTokenAddress(event.target.value)}
            required />
          
          <div className={style.currencySelector}></div>
        </div>
        )}


        <div className={style.transferPropContainer}>
          <input
           type="datetime-local"
           placeholder='Set Time Interval'
           defaultValue={toIsoString(new Date()).slice(0, 19)}
           onChange={(event) => setUnlockDate(new Date(event.target.value))}
           required
            className={style.transferPropInput}
            
           />
          
          <div className={style.currencySelector}></div>
        </div>

        <div onClick={async () => {
              await {
                [TimeLockDepositType.ETH]: createEthDeposit,
                [TimeLockDepositType.ERC20]: createErc20Deposit,
              }[depositType]();
            }} className={style.confirmButton}>
          Confirm
        </div>
      </div> 
    </div>
    </div>
  );
}