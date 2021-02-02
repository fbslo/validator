Blockchain events are any transaction that happen on blockchain (and are not part of `p2p`).

This include Hive deposits and Ethereum Token deposits.

---

Event: `hiveConversion`

Note: Emitted every time there is new HIVE deposit. Emited in `blockchain/hive.js/validateTransfer()`

Data:

```
{
  from: data.from,
  to: data.to,
  amount: Number(data.amount.split(" ")[0]),
  currency: data.amount.split(" ")[1],
  memo: data.memo,
  transaction_id: transaction.transaction_id
}
```

---

Event: `ethereumConversion`

Note: Emitted every minute and includes all token contract conversion events.

Data:

```
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
```
