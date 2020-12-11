exports.makeHiveInterface = ({ hive, eventEmitter }) => {
  return Object.freeze({
    onDeposit,
    onTransfer
  })

  async function onDeposit(callback){
    hive.stream({
      on_block: checkBlock
    })
  }

  async function checkBlock(block_num, block){
    for (const transaction of block.transactions) {
       for (const op of transaction.operations){
         let type = op[0]
         let data = op[1]
         doesTransactionMatch(type, data)
       }
     }
  }

  async function doesTransactionMatch(type, data){
    if (type == 'transfer' && data.to == process.env.HIVE_DEPOSIT_ACCOUNT) {

    }
  }
}
