exports.buildMakeEthereumInterface = ({ web3, eventEmitter, tokenABI }) => {
  return Object.freeze({
    streamEthereumEvents
  })

  async function streamEthereumEvents(){
    setInterval(() => {
      let events = await getEvents();
      eventEmitter.emit("ethereumConversion", events)
    }, 1000 * )
  }

  async function get_ERC20_transactions_by_event(){
    let head_block_number = await web3.eth.getBlockNumber();
    let last_processed_block = await Globals.query().select("value").where("name", "last_eth_block")
    let to_block = head_block_number - 12 //wait 12 confirmations
    let contract = new web3.eth.Contract(tokenABI.abi, process.env.CONTRACT_ADDRESS);
    let past_events = await contract.getPastEvents("convertToken", {}, { fromBlock: last_processed_block[0].value, toBlock: to_block })
    return past_events;
  }
}
