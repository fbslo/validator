exports.makeUsersDatabase = ({ makeDatabase }) => {
  return Object.freeze({
    findAll,
    findByUsername,
    updateByUsername,
    updateStakeByUsername,
    insert,
    removeByUsername
  })

  async function findAll(){
    const db = await makeDatabase();
    const result = await db.collection("users").find();
    return result.toArray();
  }

  async function findByUsername(username){
    const db = await makeDatabase();
    const result = await db.collection("users").findOne({ username: username });
    return result.toArray();
  }

  async function updateByUsername(username, data){
    const db = await makeDatabase();
    const result = await db.collection("users").updateOne({ username: username }, { $set: { data } });
    return result.modifiedCount > 0 ? true : false
  }

  async function updateStakeByUsername(username, stake){
    const db = await makeDatabase();
    const result = await db.collection("users").updateOne({ username: username }, { $set: { stake: stake } });
    return result.modifiedCount > 0 ? true : false
  }

  async function insert(data){
    const db = await makeDatabase();
    const result = await db.collection("users").insert({ data });
    return result.toArray();
  }

  async function removeByUsername(username){
    const db = await makeDatabase();
    const result = await db.collection("users").deleteOne({ username: username });
    return result.modifiedCount > 0 ? true : false
  }
}
