import MultiSigWallet from '../abis/MultiSigWallet.json'
import MultiSigFactory from '../abis/MultiSigFactory.json'
import Link from '../abis/Link.json'
import Dai from '../abis/Dai.json'


export const loadContract = async (contractName, web3) => {
 const NETWORK_ID = await web3.eth.net.getId();
 let Artifact = null;

 if(contractName === "MultiSigWallet"){
   Artifact = MultiSigWallet;

 }else if (contractName === "MultiSigFactory"){
   Artifact = MultiSigFactory;
 }
 else if (contractName === "LINK"){
   Artifact = Link;
 }
 else{
   Artifact = Dai;
 }

  const multisig = Artifact.networks[NETWORK_ID]
  let contract = null;

  try {

    contract = new web3.eth.Contract(
     Artifact.abi,
     multisig.address
    );

  }
  catch (err) {
   console.log("This is the error")
    console.error(err);
  }

  return contract;
};
