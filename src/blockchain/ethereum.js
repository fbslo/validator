exports.buildMakeEthereumInterface = ({ web3, eventEmitter, tokenABI }) => {
  return Object.freeze({
    streamEthereumEvents
  })

  async function streamEthereumEvents(){
    setInterval(async () => {
      let events = await getERC20TransactionsByEvent();
      eventEmitter.emit("ethereumConversion", events)
    }, 1000 * 60)
  }

  async function getERC20TransactionsByEvent(){
    let headBlock = await web3.eth.getBlockNumber();
    let contract = new web3.eth.Contract(tokenABI, process.env.CONTRACT_ADDRESS);
    let pastEvents = await contract.getPastEvents("convertToken", {}, { fromBlock: 0, toBlock: headBlock - 12 })
    return pastEvents;
  }
}
