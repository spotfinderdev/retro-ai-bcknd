const Datastore = require("nedb");
const util = require("util");

// 📂 Inicializar la BD en un archivo local
const db = new Datastore({ filename: "./data/retroSummary.db", autoload: true });

db.findAsync = util.promisify(db.find.bind(db));
db.insertAsync = util.promisify(db.insert.bind(db));
db.updateAsync = util.promisify(db.update.bind(db));
db.removeAsync = util.promisify(db.remove.bind(db));

async function getData() {
  return await db.findAsync({});
}

async function insertData(newData) {
  return await db.insertAsync(newData);
}

async function updateData(id, update) {
  return await db.updateAsync({ _id: id }, { $set: update }, { returnUpdatedDocs: true });
}

async function deleteData(id) {
  return await db.removeAsync({ _id: id });
}

async function getCategories() {
  const data = await getData();
  return [...new Set(data.map((entry) => entry.category))]; // Extraer categorías únicas
}

module.exports = { getData, insertData, updateData, deleteData, getCategories };
