const express = require("express");
const router = express.Router();
const { getData, insertCsvData, updateData, deleteData } = require("../database");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// 🔹 Obtener todos los datos
router.get("/", async (req, res) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    console.error("❌ Error al obtener datos:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// 🔹 Subir y procesar un archivo CSV
router.post("/upload-csv", upload.single("file"), async (req, res) => {
  try {
    console.log("📂 Recibiendo archivo CSV...");

    if (!req.file) {
      console.error("❌ No se ha subido ningún archivo.");
      return res.status(400).json({ error: "No se ha subido ningún archivo." });
    }

    const category = req.body.category;
    const filePath = req.file.path;

    console.log("🗂️ Archivo recibido:", req.file);
    console.log("📂 Categoría recibida:", category);

    const csvData = fs.readFileSync(filePath, "utf8")
      .split("\n")
      .map(row => row.trim())
      .filter(row => row.length > 0);

    if (csvData.length < 2) {
      console.error("❌ El archivo CSV no tiene suficientes datos.");
      return res.status(400).json({ error: "El archivo CSV no tiene suficientes datos." });
    }

    const parsedData = csvData.map(row => row.split(",").map(val => val.trim()));

    console.log("📊 Datos parseados del CSV:", parsedData);

    await insertCsvData(category, parsedData);
    fs.unlinkSync(filePath);

    console.log("✅ CSV cargado exitosamente.");
    return res.json({ message: "CSV cargado exitosamente", category, data: parsedData });

  } catch (error) {
    console.error("❌ Error al procesar el CSV:", error);
    res.status(500).json({ error: "Error al procesar el archivo CSV", details: error.message });
  }
});

// 🔹 Actualizar una categoría específica
router.put("/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const updatedData = req.body;

    console.log("🔄 Recibida solicitud PUT para categoría:", category, updatedData);
    
    const result = await updateData(category, updatedData);

    if (!result) {
      return res.status(404).json({ error: "No se encontró la categoría para actualizar" });
    }

    res.json({ message: "Actualizado correctamente", result });
  } catch (error) {
    console.error("❌ Error en PUT /api/retro-data/:category:", error);
    res.status(500).json({ error: "Error al actualizar los datos" });
  }
});

// 🔹 Eliminar una categoría específica
router.delete("/:category", async (req, res) => {
  try {
    const category = req.params.category;
    await deleteData(category);
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
});

module.exports = router;
