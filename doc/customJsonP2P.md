Propose transaction (head validator only)

```
{
  name: proposed_transaction,
  data: {
    chain: hive/ethereum,
    referenceTransaction: ref_tx
    transaction: tx
  }
}
```

---

Share signature with peers.

```
{
  name: signature,
  data: {
    chain: hive/ethereum,
    referenceTransaction: ref_tx,
    signature: tx_signature,
    proposalTransaction: proposalTransaction
  }
}
```

---

Share network state with peers (not implemented yet).

```
{
  name: network_state
  data: {
    headBlockHive: 1000,
    headBlockEthereum: 1000,
    validatorsHash: SHA 256 hash of stringified array of active validators by alphabetic order
  }
}
```

---

Propose new validator to the network (not implemented yet).

```
{
  name: propose_new_validator,
  data: {
    username: valdiator username,
    url: hive post url,
    metedata: some other info
  }
}
```

---

Propose validator removal to the network (not implemented yet).

```
{
  name: propose_validator_removal,
  data: {
    removeValidator: username of rouge validator,
    reson: inactive (not signing txs)/fake signatures (not signing transactions that were approved)
  }
}
```

---

Whitelist new validator, so it can be added after proposal (not implemented yet).

```
{
  name: whitelist_validator,
  data: {
    username: whitelisted validator username
  }
}
```

---

Propose kick of malicious validator. (catch not implemented yet)

```
{
  name: kick_validator,
  data: {
    username: toBeRemoved[i].username,
    strikes: toBeRemoved[i].strikes
  }
}
```
