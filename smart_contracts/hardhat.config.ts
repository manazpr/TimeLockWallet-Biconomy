import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();

import type { HardhatUserConfig } from "hardhat/config";

const Config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    kovan: {
      url: "https://kovan.infura.io/v3/36cb60954ef64fb699aa96913c935ddd",
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default Config;
