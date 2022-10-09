/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const ipfsAPI = require("ipfs-http-client");


/*
const ipfs = ipfsAPI({
  host: "ipfs.nifty.ink",
  port: "3001",
  protocol: "https",
});
*/

const ipfs = ipfsAPI({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const delayMS = 1000; // sometimes xDAI needs a 6000ms break lol 😅

const main = async () => {
  // ADDRESS TO MINT TO:
//   const toAddress = "YOUR_FRONTEND_ADDRESS";

  console.log("\n\n 🎫 Launching goblin ...\n");

  const { deployer } = await getNamedAccounts();
  console.log(`Owner of contract: ${deployer}`)
  const yourCollectible = await ethers.getContract("goblintownNFT", deployer);

  
  let res = await yourCollectible.makegoblinnnfly(deployer, 5);
  console.log(res)

  res = await yourCollectible.mintingPrice();
  console.log(res)



//makingobblin

  res = await yourCollectible.spredgobblins(3); // perhaps each person can mint 3
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
