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
      signature: '0x98918857764067338419281279cb44261ecc9effaad57ee284725c73f0bdf8730e8b585b4e483b95b773a784c7d17cc862d46cf8f778ca70f73965e3de2364961b'
    },
    {
      pub: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
      priv: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
      signature: '0x124721aba60323724c6599d5d1e5da9fb6a552c06538311a2d1b8e1dcc6df6a3183e50c3a45faec82994f1b40d77b3b124bae793661bf9b27b30ded18282b8c91b'
    },
    {
      pub: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
      priv: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
      signature: '0xd6caf78afca40fe914654e2f01ac7c29f7ef42a630d9112533c0239d4f63b83552f09ca7e3c8e11c5392027653f4aad38e58e1a25f656e78731e39acad9f70eb1c'
    },
    {
      pub: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
      priv: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
      signature: '0xe7a7508d7b105a83ad2205e55c42b351b417b0e9a3b3587ff7b814fb602d703e4c3521f1758f643446bbbbe8625fd64814ef8e11b0006bd5fc2547a4fc570d171b'
    },
    {
      pub: '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
      priv: '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba',
      signature: '0xe93f7b2d9964ebeb5892eea2714138c5c360a1696b7fc6313472a676bf7138802bdcc7604f0126f9e94db8cc978fc661e37006170eed0a15557becaf9e0fd69e1b'
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
        console.log("SIG COMP")
        console.log(e)
    })

    
    digiDaigaku.on("SignerSet",(e)=>{
        console.log("SignerSet")
        console.log(e)
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
