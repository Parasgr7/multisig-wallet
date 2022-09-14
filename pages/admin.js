export default function Admin() {

  // const addWalletOwner = async (token, value) => {
  //   let NETWORK_ID = await web3.eth.net.getId();
  //   const tokenInst = new web3.eth.Contract(ERC20.abi, token.tokenAddress);
  //   const larToken = new web3.eth.Contract(
  //     ERC20.abi,
  //     LARToken.networks[NETWORK_ID].address
  //   );
  //
  //   try {
  //     await trackPromise(
  //       tokenInst.methods
  //         .approve(contract.options.address, toWei(value))
  //         .send({ from: account.data })
  //     );
  //
  //     const supplyResult = await trackPromise(
  //       contract.methods
  //         .lend(tokenInst.options.address, toWei(value))
  //         .send({ from: account.data })
  //     );
  //
  //     const larTokenBalance = await larToken.methods
  //       .balanceOf(account.data)
  //       .call();
  //
  //     await trackPromise(
  //       larToken.methods
  //         .approve(contract.options.address, toWei(larTokenBalance))
  //         .send({ from: account.data })
  //     );
  //
  //     setSupplyResult(supplyResult);
  //   } catch (err) {
  //     setSupplyError(err);
  //   }
  // };
  return (
    <h1>First Post</h1>
  )
}
