const express = require("express");
const router = express.Router();
const { getData, insertData, updateData, deleteData } = require("../database");

// 🔹 Obtener todos los datos
router.get("/", async (req, res) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// 🔹 Agregar un nuevo dato
router.post("/", async (req, res) => {
  try {
    const newData = req.body;
    const inserted = await insertData(newData);
    res.json(inserted);
  } catch (error) {
    res.status(500).json({ error: "Error al insertar datos" });
  }
});

// 🔹 Actualizar un dato por ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updated = await updateData(id, updatedData);
    res.json({ message: "Actualizado correctamente", updated });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar datos" });
  }
});

// 🔹 Eliminar un dato por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteData(id);
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar datos" });
  }
});

// 🔹 Obtener todas las categorías disponibles
router.get("/categories", async (req, res) => {
    try {
      const data = await getData();
      if (data.length === 0) {
        return res.json([]);
      }
      const categories = Object.keys(data[0]).filter((key) => key !== "_id");
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener categorías" });
    }
  });

module.exports = router;
