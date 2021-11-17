exports.buildMakeEthereumInterface = ({ web3, eventEmitter, tokenABI, multisigABI, inputDataDecoder }) => {
  return Object.freeze({
    streamEthereumEvents,
    getTransaction,
    decode,
    prepareAndSignMessage,
    isAddress
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
    let pastEvents = await contract.getPastEvents("TokenBurnToBC", {}, { fromBlock: 0, toBlock: headBlock - 12 })
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
    let msgHash = await web3.utils.soliditySha3(to, amount, referenceTransaction, process.env.MULTISIG_CONTRACT_ADDRESS);
    let msgParams = {
      data: msgHash
    }

    if (!process.env.ETHEREUM_PRIVATE_KEY.startsWith('0x')) process.env.ETHEREUM_PRIVATE_KEY = '0x' + process.env.ETHEREUM_PRIVATE_KEY

    let signature = await sigUtil.personalSign(ethers.utils.arrayify(process.env.ETHEREUM_PRIVATE_KEY), msgParams)
    return signature;
  }

  async function isAddress(address){
    let isAddress = await web3.utils.isAddress(address);
    return isAddress;
  }
}
