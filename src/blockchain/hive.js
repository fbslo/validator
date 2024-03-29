exports.buildMakeHiveInterface = ({ hive, eventEmitter, dhive }) => {
  return Object.freeze({
    streamBlockchain,
    validateTransfer,
    validateCustomJson,
    getTransactionByID,
    getBlockHash,
    getAccount,
    getAuthoritiesInfo,
    sign,
    broadcast,
    sendCustomJson,
    prepareTransferTransaction,
    signMessage,
    verifySignature
  })

  async function streamBlockchain(){
    hive.stream({
      on_block: routeStream,
      irreversible: process.env.ENVIRONMENT == "production" ? true : false,
    })
  }

  function routeStream(block_num, block){
    eventEmitter.emit('new_block', block_num, block); //for p2p listener
    checkBlock(block_num, block);
  }

  async function checkBlock(block_num, block){
    if (block_num % 5000 == 0) eventEmitter.emit(`switchHeadValidator`, { headBlock: block_num });
    if (block_num % 1000 == 0 && block_num % 5000 != 0) eventEmitter.emit(`heartbeat`, { headBlock: block_num })

    for (const transaction of block.transactions) {
      for (const op of transaction.operations){
        let type = op[0]
        let data = op[1]
        routeTransaction(type, data, transaction)
      }
    }
  }

  async function routeTransaction(type, data, transaction){
    try {
      switch (type){
        case 'transfer':
          validateTransfer(data, transaction);
          break;
        case 'custom_json':
          validateCustomJson(data);
          break;
      }
    } catch (e) {
      console.log(`Error while processing HIVE transaction: ${e.toString()}`)
    }
  }

  function validateTransfer(data, transaction){
    if (data.to == process.env.HIVE_DEPOSIT_ACCOUNT){
      if (!data.from || !data.to || !data.amount){
        throw new Error("Transfer data is required")
      }
      let transferDetails = {
        from: data.from,
        to: data.to,
        amount: Number(data.amount.split(" ")[0]),
        currency: data.amount.split(" ")[1],
        memo: data.memo,
        transaction_id: transaction.transaction_id
      }
      eventEmitter.emit('hiveConversion', transferDetails)
    }
  }

  async function validateCustomJson(data){
    if (data.id == 'wrapped_hive' && data.required_auths[0]){
      let json = JSON.parse(data.json)
      if (!json.type){
        throw new Error("JSON type is required")
      }
      switch (json.type){
        case 'validator_vote':
          if (!json.validator || !json.approve){
            throw new Error("JSON validator and approve are required")
          }
          eventEmitter.emit('validatorVote', {
            validator: json.validator,
            approve: json.approve == true || 'true' ? true : false
          })
          break;
        case 'validator_update':
          if (!json.validator || !json.approve){
            throw new Error("JSON validator and approve are required")
          }
          eventEmitter.emit('validatorUpdate', json)
          break;
        case 'validator_creation':
          eventEmitter.emit('validatorCreation', json)
          break;
      }
    }
  }

  async function getTransactionByID(id){
    let call = await hive.api('get_transaction', [id]);
    if (!call.operations || !call.transaction_id || !call.block_num) return false;
    let transaction = {
      operations: call.operations,
      transaction_id: call.transaction_id,
      block_num: call.block_num
    }
    return transaction;
  }

  async function getBlockHash(number){
    let block = await hive.api('get_block', [number]);
    return block.block_id;
  }

  async function getAccount(account){
    let accountDetails = await hive.api('get_accounts', [[account]]);
    return accountDetails[0];
  }

  async function getAuthoritiesInfo(){
    let accountDetails = await hive.api('get_accounts', [[process.env.HIVE_DEPOSIT_ACCOUNT]]);
    let weightPerAuth = accountDetails[0].active.account_auths.length > 0 ? accountDetails[0].active.account_auths[0][1] : accountDetails[0].active.key_auths[0][1]
    return {
      threshold: accountDetails[0].active.weight_threshold,
      weightPerAuth: weightPerAuth,
      requiredSignatures: accountDetails[0].active.weight_threshold / weightPerAuth,
      auths: accountDetails[0].active.account_auths
    }
  }

  async function sign(rawTransaction){
    let dhiveClient = new dhive.Client(process.env.HIVE_NODES.split(','), {
      chainId: process.env.HIVE_CHAIN_ID,
    })
    let signedTransaction = await dhiveClient.broadcast.sign(rawTransaction, dhive.PrivateKey.from(process.env.ACTIVE_HIVE_KEY));
    return signedTransaction;
  }

  async function broadcast(signedTransaction){
    let dhiveClient = new dhive.Client(process.env.HIVE_NODES.split(','), {
      chainId: process.env.HIVE_CHAIN_ID,
    })
    let sendSignedTransaction = await dhiveClient.broadcast.send(signedTransaction);
    return sendSignedTransaction;
  }

  async function sendCustomJson(name, json){
    return new Promise((resolve, reject) => {
      let dhiveClient = new dhive.Client(process.env.HIVE_NODES.split(','), {
        chainId: process.env.HIVE_CHAIN_ID,
      })
      let key = dhive.PrivateKey.fromString(process.env.ACTIVE_HIVE_KEY)
      dhiveClient.broadcast.json({
          required_auths: [process.env.VALIDATOR],
          required_posting_auths: [],
          id: "wrapped_hive_p2p",
          json: JSON.stringify({
            name: name,
            data: json
          }, null, ''),
      }, key).then(
          result => { console.log(result) },
          error => { console.log(error) }
      )
    })
  }

  async function prepareTransferTransaction({ from, to, amount, currency, memo, headValidator, referenceTransaction }){
    let dhiveClient = new dhive.Client(process.env.HIVE_NODES.split(','), {
      chainId: process.env.HIVE_CHAIN_ID,
    })
    currency == 'HDB' ? 'HBD' : "HIVE"
    let expireTime = 1000 * 3590;
    let props = await dhiveClient.database.getDynamicGlobalProperties();
    let ref_block_num = props.head_block_number & 0xFFFF;
    let ref_block_prefix = Buffer.from(props.head_block_id, 'hex').readUInt32LE(4);
    let expiration = new Date(Date.now() + expireTime).toISOString().slice(0, -5);
    let extensions = [];
    let operations = [['transfer',
     {'amount': `${parseFloat(amount * 0.995).toFixed(3)} ${currency}`,
      'from': from,
      'memo': memo,
      'to': to}],
      ['transfer',
       {'amount': `${parseFloat(amount * 0.005).toFixed(3)} ${currency}`,
        'from': from,
        'memo': `0.5% headValidator fee for ${referenceTransaction}`,
        'to': headValidator}
      ]];
    let tx = {
      expiration,
      extensions,
      operations,
      ref_block_num,
      ref_block_prefix
    }
    return tx;
  }

  async function signMessage(message){
    let signedMessage = await dhive.PrivateKey.sign(message);
    return signedMessage;
  }

  async function verifySignature(signature, proposalTransactionId){
    let dhiveClient = new dhive.Client(process.env.HIVE_NODES.split(','), {
      chainId: process.env.HIVE_CHAIN_ID,
    })
    let { cryptoUtils, Signature } = dhive
    try {
      let proposalTransaction = await getTransactionByID(proposalTransactionId)
      let transaction = JSON.parse(JSON.parse(JSON.parse(proposalTransaction.operations[0][1].json).data).transaction)
      let msg = {
        expiration: transaction.expiration,
        extensions: transaction.extensions,
        operations: transaction.operations,
        ref_block_num: transaction.ref_block_num,
        ref_block_prefix: transaction.ref_block_prefix
      };
      let sig = Signature.fromString(signature);
      let digest = cryptoUtils.transactionDigest(msg);
      // Finding public key of the private that was used to sign
      let key = (new Signature(sig.data, sig.recovery)).recover(digest);
      if (key.toString() == 'STM5NdUbR15D1CRW5DNChpnFz7T2rdrvZpv1W5SWZXB8CPWvWoFnH') return ['posh-bot'] //get_key_references will return [[]] for posh-bot???
      let [owner] = await dhiveClient.database.call('get_key_references', [[key]]);
      if (owner) return owner;
      else return false;
    } catch (e) {
      console.log(e)
      return false;
    }
  }
}
