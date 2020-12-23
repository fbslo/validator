exports.makeStatusDatabase = ({ makeDatabase }) => {
  return Object.freeze({
    findAll,
    findByName,
    updateByName,
    insert,
    removeByName
  })

  async function findAll(){
    const db = await makeDatabase();
    const result = await db.collection("status").find();
    return result.toArray();
  }

  async function findByName(username){
    const db = await makeDatabase();
    const result = await db.collection("status").find({ name: name });
    return result.toArray();
  }

  async function updateByName(username, data){
    const db = await makeDatabase();
    const result = await db.collection("status").updateOne({ name: username }, { $set: { data: data } });
    return result.modifiedCount > 0 ? true : false
  }

  async function insert(data){
    const db = await makeDatabase();
    const result = await db.collection("status").insert({ data });
    return result.toArray();
  }

  async function removeByName(username){
    const db = await makeDatabase();
    const result = await db.collection("status").deleteOne({ name: username });
    return result.modifiedCount > 0 ? true : false
  }
}
