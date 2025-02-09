const Datastore = require("nedb");
const util = require("util");
const fetch = global.fetch;

// 📂 Inicializar la BD en un archivo local
const db = new Datastore({ filename: "./data/retroSummary.db", autoload: true });

db.findAsync = util.promisify(db.find.bind(db));
db.insertAsync = util.promisify(db.insert.bind(db));
db.updateAsync = util.promisify(db.update.bind(db));
db.removeAsync = util.promisify(db.remove.bind(db));

// 🔹 Obtener datos
async function getData() {
  return new Promise((resolve, reject) => {
    db.find({}, (err, docs) => {
      if (err) {
        console.error("❌ Error al obtener datos desde NeDB:", err);
        reject(err);
        return;
      }

      // 🔹 Reformatear los datos agrupándolos correctamente
      const formattedData = {};
      docs.forEach(doc => {
        formattedData[doc._id] = doc.values || [];
      });

      console.log("📂 Datos formateados desde la BD:", formattedData);
      resolve(formattedData);
    });
  });
}


// 🔹 Actualizar datos 
async function updateData(id, update) {
  console.log("📝 Actualizando en la BD:", id, update);

  return new Promise((resolve, reject) => {
    db.update(
      { _id: id },
      { $set: { values: update } },
      { upsert: true },
      (err, numReplaced) => {
        if (err) {
          console.error("❌ Error al actualizar en NeDB:", err);
          reject(err);
        } else {
          console.log(`✅ ${numReplaced} documentos actualizados en NeDB para "${id}".`);
          db.persistence.compactDatafile();
          resolve(numReplaced);
        }
      }
    );
  });
}

// 🔹 Eliminar una categoría
async function deleteData(id) {
  return await db.removeAsync({ _id: id });
}

// 🔹 Obtener categorías 
async function getCategories() {
  const data = await getData();
  return Object.keys(data);
}

// 🔹 Guardar datos de una categoría sin afectar otras
async function saveCategory(categoryName, items) {
  const formattedCategory = categoryName.replace(/\s+/g, "");
  const payload = { [formattedCategory]: items };

  console.log("🔹 Enviando datos a la API:", payload);

  const response = await fetch(`http://localhost:5000/api/retro-data/${formattedCategory}`, {
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

// 🔹 Insertar datos desde CSV sin afectar otras categorías
async function insertCsvData(category, data) {
  console.log("💾 Insertando en la BD:", { category, data });

  return new Promise((resolve, reject) => {
    if (data.length < 2) {
      console.error("❌ El archivo CSV debe contener al menos una fila de datos además de los encabezados.");
      reject(new Error("El archivo CSV debe contener al menos una fila de datos además de los encabezados."));
      return;
    }

    const headers = data[0]; // Primera fila como nombres de atributos
    const formattedData = data.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || ""; // Si no hay dato, se asigna cadena vacía
      });
      return obj;
    });

    console.log("📂 Datos formateados correctamente:", formattedData);

    db.update(
      { _id: category },
      { $set: { values: formattedData } }, // Se almacenan como objetos en `values`
      { upsert: true },
      (err, numReplaced) => {
        if (err) {
          console.error("❌ Error al insertar datos en NeDB:", err);
          reject(err);
        } else {
          console.log(`✅ ${numReplaced} documentos actualizados en NeDB para la categoría "${category}".`);
          db.persistence.compactDatafile(); // Forzar escritura en disco
          resolve(numReplaced);
        }
      }
    );
  });
}



module.exports = { getData, updateData, deleteData, getCategories, saveCategory, insertCsvData };
