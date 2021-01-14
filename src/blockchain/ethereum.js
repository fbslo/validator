exports.buildMakeEthereumInterface = ({ web3, eventEmitter, tokenABI, multisigABI, inputDataDecoder }) => {
  return Object.freeze({
    streamEthereumEvents,
    getTransaction,
    decode,
    prepareAndSignMessage
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
    let pastEvents = await contract.getPastEvents("convertTokenEvent", {}, { fromBlock: 0, toBlock: headBlock - 12 })
    return pastEvents;
  }

  async function getTransaction(transactionHash){
    let transaction = await web3.eth.getTransaction(transactionHash)
    // TODO: prepare definde structure of response
    return transaction;
  }

  async function decode(input){
    let decodedInput = inputDataDecoder.decodeData(input);
    // TODO: standarize output
    return decodedInput;
  }

  async function prepareAndSignMessage(to, amount, referenceTransaction){
    let contractInstance = new web3.eth.Contract(multisigABI, process.env.MULTISIG_CONTRACT_ADDRESS);
    let messageHash = await contractInstance.methods.getMessageHash(to, amount, referenceTransaction).call();
    console.log(messageHash)
    let signature = await web3.eth.accounts.sign(messageHash, process.env.ETHEREUM_PRIVATE_KEY);
    console.log(signature)
  }
}
