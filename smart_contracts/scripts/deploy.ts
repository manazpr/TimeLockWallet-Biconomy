import { ethers } from "hardhat";

const deploy = async () => {
  const factory = await ethers.getContractFactory("TimeLockContract");
  const contract = await factory.deploy(
    "0x3D3Df1784e8891030b0326655f52e3b110BDd67c"
  );
  console.log(`Contract deployed at ${contract.address}`);
};

deploy();
