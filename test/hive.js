const assert = require('assert');
require('dotenv').config();
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const { buildMakeHiveInterface } = require("../src/blockchain/hive.js");

describe("Hive Blockchain", function() {
  var testTransferObject = {
    from: "fbslo",
    to: "fbslo.pay",
    amount: "1.000 HIVE",
    memo: "Hello There"
  }

  it("should SUCCESS validating hive transfer from block stream", function() {
    let hiveInterface = buildMakeHiveInterface({ eventEmitter });
    var response = '';
    let expectedTransferObject = {
      from: 'fbslo',
      to: process.env.HIVE_DEPOSIT_ACCOUNT,
      amount: 1.000,
      currency: 'HIVE',
      memo: 'Hello There'
    }
    hiveInterface.validateTransfer(testTransferObject);
    eventEmitter.on("hiveDeposit", (data) => {
      response = data
    })
    setTimeout(() => {
      assert.equal(JSON.stringify(expectedTransferObject), JSON.stringify(response));
    }, 1500)
  });

  it("should FAIL validating hive transfer from block stream", function() {
    let hiveInterface = buildMakeHiveInterface({ eventEmitter });
    var response = '';
    hiveInterface.validateTransfer(testTransferObject);
    eventEmitter.on("hiveDeposit", (data) => {
      response = data
    })
    setTimeout(() => {
      assert.equal('""', JSON.stringify(response));
    }, 1500)
  });
});
