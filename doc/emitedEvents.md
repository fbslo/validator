hiveDeposit

{
  from: data.from,
  to: data.to,
  amount: data.amount.split(" ")[0],
  currency: data.amount.split(" ")[1],
  memo: data.memo
}

---

validatorVote

{
  validator: json.validator,
  approve: json.approve == true || 'true' ? true : false
}

---

validator_update

---

validator_creation

---

modifiedStake

{
  username: data.from_account,
  stakeChange: -data.withdrawn.split(" ")[0]
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
