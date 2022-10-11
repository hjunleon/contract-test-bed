const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");

/**
 * SIG COMP
0x8153085921768b8a7399183a7db22f20de3314519bc19a75d20db818d7b6ffec
SIG COMP
0xb00668de3dfd703b3c247f92c7c9ae8a4cf96e4a916098b3e327b6f98d3f5c36
SIG COMP
0x0a9442658a4d51a8ea4c67c3a478c0f35c04f31d30e44958af171b26e6b42a37
SIG COMP
0x9be6a48f856ee036365fc38006366858731d0f36b306e1b7bab213ccb1082df4
SIG COMP
0xa02dacb7dfd67e1867ecd86b259513981bde013426d9b5bef48019ff02c895cc
 */

const addr_sig = [
    {
      pub: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      priv: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
      signature: '0x0e8a3719f8feec70c6fd0a6b9e39b335918d35be091439789cecafa34817a99a251ea30cdc6a6513001041a11f04ff0e404cd5696f698df1fede26795c589fb91c'
    },
    {
      pub: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
      priv: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
      signature: '0x559ec919bfec1cbca235531b63c2319cab8397d86675ac44d7319482fff63dcd21675961c5a9243398e64d109b244b60c7447f3d208ba76853f72df090bc843a1b'
    },
    {
      pub: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
      priv: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
      signature: '0xab74f4feb2a3a7a3b00d130ae703a308c866426b250d3def24dcc01e2d5d0fc542e84d45c0af4d4d6ccee0df6012423541edf3673b41c140461441f4c85f54aa1b'
    },
    {
      pub: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
      priv: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
      signature: '0x42bd1ee6451bfd8611b41dcd1a2be464678ab2d204b01689b338959a45ff3c23237d6a866419fb74cee90a4d19fbd6735ac243841fca5ced5844034348cc63871b'
    },
    {
      pub: '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
      priv: '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba',
      signature: '0x1ef3d3f2156d288d74bc2934825e0ff137b23acf7c5d3022378292b081c71dac75cd85cb07e68dcdb3090cabd88bb6e6c02ad32d9bf68cefb73e95976d2dbc7a1b'
    }
  ]


const delayMS = 3000;



function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


const main = async () => {
    const { deployer } = await getNamedAccounts();
//https://ethereum.stackexchange.com/questions/103439/whats-the-difference-between-ethers-provider-and-ethers-network-provider-in-eth

    let digiDaigaku = await ethers.getContract("DigiDaigaku", deployer);

    console.log(`deployer: ${deployer}`)
    
    digiDaigaku.on("SigComp",(e)=>{
        console.log(`SIG COMP: ${e}`)
    })

    
    digiDaigaku.on("SignerSet",(e)=>{
        console.log(`SignerSet: ${e}`)
    })
    digiDaigaku.on("ERecovered",(e)=>{
        console.log(`ERecovered: ${e}`)
    })
    // ethers.provider.on({
    //     address: digiDaigaku.getContract.address
    // },(e)=>{
    //     console.log("*")
    //     console.log(e)
    // })

    // ethers.provider.on("block", () => console.log("new block"));

    await sleep(1000)

    await digiDaigaku.setSigner(deployer)

    for (let x of addr_sig) {
        console.log(`Verifying ${x['pub']} with sig ${x['signature']}`)
        const privateKey = x['priv'];

        const signer = new ethers.Wallet(privateKey);
        console.log(`Signing address ${signer.address}`)

        

        const digiDaigaku = await ethers.getContract("DigiDaigaku", signer.address);
        try {
            let res = await digiDaigaku.mintPublic(x['signature'])  
            // let res = await digiDaigaku.verifySignature(x['signature'])
            // let res = await digiDaigaku.genSignature()
            console.log(res)
        }
        catch (e) {
            console.log(e);
        }
        await sleep(500)
    }
    //   console.log(signatures)
    await sleep(delayMS)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
