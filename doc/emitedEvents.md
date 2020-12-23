`hiveDeposit`

{
  from: data.from,
  to: data.to,
  amount: data.amount.split(" ")[0],
  currency: data.amount.split(" ")[1],
  memo: data.memo
}

---

`ethereumConversion`

 [
  {
    returnValues: {
        myIndexedParam: 20,
        myOtherIndexedParam: '0x123456789...',
        myNonIndexParam: 'My String'
    },
    raw: {
        data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
        topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
    },
    event: 'MyEvent',
    signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
    logIndex: 0,
    transactionIndex: 0,
    transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
    blockNumber: 1234,
    address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
  },
  ...
 ]

---

`validatorVote`

{
  validator: json.validator,
  approve: json.approve == true || 'true' ? true : false
}

---

`validator_update`

---

`validator_creation`

---

`modifiedStake`

{
  username: data.from_account,
  stakeChange: -data.withdrawn.split(" ")[0]
}

---

`switchHeadValidator`

{
  headBlock: head_num
}

---

JSON type:

{
  id: 'wrapped_hive',
  json: {
    type: validator_vote,
    validator: 'fbslo',
    approve: true
  }
}


---

P2P events:

`requestHiveToWrappedConversionSiganture`

{
  referenceTransaction: ref_tx,
  transaction: tx,
  timestamp: timestamp
}

`requestWrappedToHiveConversionSiganture`

{
  referenceTransaction: ref_tx,
  transaction: tx,
  timestamp: timestamp
}

`sharePeerList`

No incoming data

`heartbeat`

No incoming data

`requestPeerSiganture`

{
  referenceTransaction: ref_tx,
  peerUsername: 'fbslo'
}

`shareSignature`

{
  referenceTransaction: ref_tx,
  siganture: signature
}

`heartbeat`

{
  headBlock: head_num
}
