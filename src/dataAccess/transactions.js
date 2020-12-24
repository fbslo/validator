exports.makeTransactionsDatabase = ({ makeDatabase }) => {
  return Object.freeze({
    findAll,
    findByReferenceID,
    updateByReferenceID,
    insert,
    removeByReferenceID
  })

  async function findAll(){
    const db = await makeDatabase();
    const result = await db.collection("transactions").find();
    return result.toArray();
  }

  async function findByReferenceID(id){
    const db = await makeDatabase();
    const result = await db.collection("transactions").findOne({ referenceTransaction: id });
    return result ? result.toArray() : false;
  }

  async function updateByReferenceID(id, data){
    const db = await makeDatabase();
    const result = await db.collection("transactions").updateOne({ referenceTransaction: id }, { $set: { data: data } });
    return result.modifiedCount > 0 ? true : false
  }

  async function insert(data){
    const db = await makeDatabase();
    const result = await db.collection("transactions").insertOne( data );
    return result.modifiedCount > 0 ? true : false
  }

  async function removeByReferenceID(username){
    const db = await makeDatabase();
    const result = await db.collection("transactions").deleteOne({ username: username });
    return result.modifiedCount > 0 ? true : false
  }
}
