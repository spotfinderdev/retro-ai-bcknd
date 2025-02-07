const express = require("express");
const cors = require("cors");
const retroRoutes = require("./routes/retroRoutes");
const { updateData } = require("./database"); // Importar `updateData`

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔹 Configurar las rutas
app.use("/api/retro-data", retroRoutes);

// 🔹 Endpoint para actualizar categorías
app.put("/api/retro-data/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;

    console.log("🔄 Recibida solicitud PUT:", id, update);
    
    const result = await updateData(id, update);

    if (!result) {
      return res.status(404).json({ error: "No se encontró el documento a actualizar" });
    }

    res.json({ message: "Actualizado correctamente", result });
  } catch (error) {
    console.error("❌ Error en PUT /api/retro-data/:id:", error);
    res.status(500).json({ error: "Error al actualizar los datos" });
  }
});

// 🔹 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
