const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/df34aeb4a6ba4faf803ee8fddfc76aac');

const { multisigABI } = require("../src/utils/multisigABI.js")
const multisigContractAddress = '0x8cf4d6d58539ca3c87f8e46e76f5074c5ca8e74b'

//Ropsten multisisg  contract: https://ropsten.etherscan.io/address/0x8cf4d6d58539ca3c87f8e46e76f5074c5ca8e74b

async function prepareAndSignMessage(to, amount, referenceTransaction, privateKey){
  let contractInstance = new web3.eth.Contract(multisigABI, multisigContractAddress);
  let messageHash = await contractInstance.methods.getMessageHash(to, amount, referenceTransaction).call();
  let signature = await web3.eth.accounts.signUntrustedHash(messageHash, privateKey);
  return signature;
}

function getAccounts(length){
  let accounts = []
  for (let i = 0; i < length; i++){
    let account = web3.eth.accounts.create([123]);
    accounts.push({
      address: account.address,
      privateKey: account.privateKey
    })
  }
  return accounts;
}

async function getSignatures(accounts){
  let signatures = []
  for (i in accounts){
    let sig = await prepareAndSignMessage(
      '0x1F979d06B999D058A6A950452260beaCf2F9d903',
      '1000',
      '032e5bc12fce8b3120dbfb5dee6b40f75ca36a4d',
      accounts[i].privateKey
    )
    signatures.push(sig)
  }
  prepareStr(signatures, accounts)
}

function prepareStr(sigs, accs){
  let sigStr = ''
  let accsStr = ''
  let v = ''
  let r = ''
  let s = ''
  for (i in sigs){
    sigStr += `"${sigs[i].signature}",`
    v += `"${sigs[i].v}",`
    r += `"${sigs[i].r}",`
    s += `"${sigs[i].s}",`
  }
  for (i in accs){
    accsStr += `"${accs[i].address}",`
  }
  // console.log(sigStr)
  // console.log()
  // console.log(accsStr)
  // console.log()
  console.log(v)
  console.log()
  console.log(r)
  console.log()
  console.log(s)
  console.log()
  console.log(accsStr)
}

getSignatures(getAccounts(10))
