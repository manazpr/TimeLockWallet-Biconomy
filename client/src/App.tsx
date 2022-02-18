import React, { useState, useEffect } from "react";
import "./index.css";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { ProviderContext } from "./context/providercontext";
import { BiconomyProvider } from "./context/biconomyProviderContext";
import Main from "./components/Main";

const { Biconomy } = require("@biconomy/mexa");
require("dotenv").config();

function App() {
  const [websocketProvider, setWebsocketProvider] = useState(
    new ethers.providers.WebSocketProvider(
      process.env.REACT_APP_INFURA_WS_URL as string
    )
  );
  const [biconomy, setBiconomy] = useState<typeof Biconomy | null>(null);
  const [biconomyInitialized, setBiconomyIntialized] = useState(false);

  useEffect(() => {
    if (biconomy !== null && !biconomyInitialized) {
      biconomy
        .onEvent(biconomy.READY, () => {
          console.log("Biconomy Initialized");
          setBiconomyIntialized(true);
        })
        .onEvent(biconomy.ERROR, (error: any, message: string) => {
          console.error("Error Initalizing Biconomy: ", message);
          setBiconomyIntialized(false);
        });
    }
  }, [biconomy]);

  return (
    <div className="h-screen max-h-screen h-min-screen w-screen bg-[#2D242F] text-white select-none flex flex-col justify-between">
    <ProviderContext.Provider
      value={{
        websocketProvider,
        setWebsocketProvider,
        biconomyInitialized,
      }}
    >
      <Web3ReactProvider
        getLibrary={(provider, connector) =>
          new ethers.providers.Web3Provider(provider)
        }
      >
        <BiconomyProvider
          getLibrary={(provider, connector) => {
            if (biconomy === null) {
              const ethersProvider = new ethers.providers.Web3Provider(
                provider
              );
              const newBiconomy = new Biconomy(ethersProvider, {
                apiKey: process.env.REACT_APP_BICONOMY_API_KEY,
                debug: true,
              });
              setBiconomy(newBiconomy);
              return new ethers.providers.Web3Provider(newBiconomy);
            } else {
              return new ethers.providers.Web3Provider(biconomy);
            }
          }}
        >
          <Main />
        </BiconomyProvider>
      </Web3ReactProvider>
    </ProviderContext.Provider>

    </div>
  );
}

export default App;
