/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const ipfsAPI = require("ipfs-http-client");



const ipfs = ipfsAPI({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const delayMS = 1000; // sometimes xDAI needs a 6000ms break lol 😅

const main = async () => {
  // ADDRESS TO MINT TO:
//   const toAddress = "YOUR_FRONTEND_ADDRESS";

  console.log("\n\n 🎫 Launching digidaigaku ...\n");
  const { deployer } = await getNamedAccounts();
  console.log(`Owner of contract: ${deployer}`)
  const digiDaigaku = await ethers.getContract("DigiDaigaku", deployer);

  
  let res = await digiDaigaku.setSigner(deployer)
  console.log(res)

  // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  let addr1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  res = await digiDaigaku.setRoyaltyInfo(addr1,10000); // 10000 basis points = 1%
  console.log(res)

  // owner mint
  // res = await digiDaigaku.mintFromOwner(10,deployer)
  // res = await digiDaigaku.mintFromOwner(5,addr1)

  console.log(res)


  await sleep(delayMS);
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
