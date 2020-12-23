exports.buildMakeEthereumInterface = ({ web3, eventEmitter, tokenABI, inputDataDecoder }) => {
  return Object.freeze({
    streamEthereumEvents,
    getTransaction,
    decode
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

  async function getTransaction(transactionHash){
    let transaction = web3.eth.getTransaction(transactionHash)
    // TODO: prepare definde structure of response
    return transaction;
  }

  async function decode(input){
    let decodedInput = inputDataDecoder.decodeData(input);
    // TODO: standarize output
    return decodedInput;
  }
}
