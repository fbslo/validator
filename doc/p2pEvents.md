P2P events are all events that originate from other peers on the network. Way of transmission can be wither blockchain `custom_json`, websocket, REST API or other.
Current implementation is using `custom_json` on Hive blockchain.

---

Event: `proposed_transaction`

Note: Emitted every time there is new transaction proposed by head validator.

Data:

```
{
  chain: 'ethereum/hive',
  referenceTransaction: data.transaction_id,
  transaction: JSON.stringify(preparedTransaction) //only if chain is hive
}
```

---

Event: `signature`

Note: Emitted when new signature is received from peer.

Data:

```
{
  chain: 'hive/ethereum',
  referenceTransaction: data.referenceTransaction,
  proposalTransaction: proposalTransaction,
  signature: signedTransaction.signatures[0]
}
```
