const Datastore = require("nedb");
const util = require("util");
//const fetch = require("node-fetch"); // Agregar fetch en Node.js
const fetch = global.fetch; 

// 📂 Inicializar la BD en un archivo local
const db = new Datastore({ filename: "./data/retroSummary.db", autoload: true });

db.findAsync = util.promisify(db.find.bind(db));
db.insertAsync = util.promisify(db.insert.bind(db));
db.updateAsync = util.promisify(db.update.bind(db));
db.removeAsync = util.promisify(db.remove.bind(db));

async function getData() {
  return await db.findAsync({});
}

async function updateData(id, update) {
  console.log("📝 Intentando actualizar en la BD:", id, update);

  return new Promise((resolve, reject) => {
    db.update(
      { _id: id },
      { $set: update },
      { upsert: true, multi: false },
      (err, numReplaced) => {
        if (err) {
          console.error("❌ Error al actualizar en NeDB:", err);
          reject(err);
        } else {
          console.log(`✅ ${numReplaced} documento(s) actualizado(s) en la BD.`);

          // 🔹 Forzar escritura en disco
          db.persistence.compactDatafile();

          // 🔹 Verificar si los cambios realmente están en la BD
          db.find({ _id: id }, (err, docs) => {
            if (err) {
              console.error("❌ Error al leer de la BD:", err);
              reject(err);
            } else {
              console.log("📂 Contenido actual de la BD después de actualizar:", docs);
              resolve(docs);
            }
          });
        }
      }
    );
  });
}

async function deleteData(id) {
  return await db.removeAsync({ _id: id });
}

async function getCategories() {
  const data = await getData();
  return [...new Set(data.map((entry) => entry.category))]; // Extraer categorías únicas
}

// 🔹 `saveCategory` para actualizar categorías en la API desde el backend
async function saveCategory(categoryName, items) {
  const formattedCategory = categoryName.replace(/\s+/g, ""); // Eliminar espacios
  const payload = { [formattedCategory]: items };

  console.log("🔹 Enviando datos a la API:", payload);

  const response = await fetch(`http://localhost:5000/api/retro-data/retroSummary_001`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("❌ Error en la solicitud:", response.status, response.statusText);
    throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

module.exports = { getData, updateData, deleteData, getCategories, saveCategory };
