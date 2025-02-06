const express = require("express");
const cors = require("cors");
const retroRoutes = require("./routes/retroRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔹 Configurar las rutas
app.use("/api/retro-data", retroRoutes);

// 🔹 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
