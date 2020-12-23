`hiveDeposit`

{
  from: data.from,
  to: data.to,
  amount: data.amount.split(" ")[0],
  currency: data.amount.split(" ")[1],
  memo: data.memo
}

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

`heartbeat`

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
