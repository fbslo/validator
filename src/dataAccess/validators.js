exports.makeValidatorsDatabase = ({ makeDatabase }) => {
  return Object.freeze({
    findAll,
    findByUsername,
    updateByUsername,
    insert,
    removeByUsername,
    findAllAddresses
  })

  async function findAll(){
    const db = await makeDatabase();
    const result = await db.collection("validators").find();
    return result.toArray();
  }

  async function findByUsername(username){
    const db = await makeDatabase();
    const result = await db.collection("validators").findOne({ username: username });
    return result.toArray();
  }

  async function updateByUsername(username, data){
    const db = await makeDatabase();
    const result = await db.collection("validators").updateOne({ username: username }, { $set: { data: data } });
    return result.modifiedCount > 0 ? true : false
  }

  async function insert(data){
    const db = await makeDatabase();
    const result = await db.collection("validators").insertOne({ data });
    return result.modifiedCount > 0 ? true : false
  }

  async function removeByUsername(username){
    const db = await makeDatabase();
    const result = await db.collection("validators").deleteOne({ username: username });
    return result.modifiedCount > 0 ? true : false
  }

  async function findAllAddresses(){
    let allValidators = await findAll();
    let addresses = allValidators.map(validator => { return validator["address"] })
    return addresses;
  }
}
