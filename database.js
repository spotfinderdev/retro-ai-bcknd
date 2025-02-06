const Datastore = require("nedb");
const util = require("util");

// 📂 Inicializar la BD en un archivo local
const db = new Datastore({ filename: "./data/retroSummary.db", autoload: true });

// 🔄 Convertir métodos de callback en promesas
db.findAsync = util.promisify(db.find.bind(db));
db.insertAsync = util.promisify(db.insert.bind(db));
db.updateAsync = util.promisify(db.update.bind(db));
db.removeAsync = util.promisify(db.remove.bind(db));

// 🔹 Métodos CRUD usando Promesas
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

module.exports = { getData, insertData, updateData, deleteData };
