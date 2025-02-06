const Datastore = require("nedb");
const path = require("path");

// 📂 Definir la ubicación del archivo de la base de datos
const db = new Datastore({ filename: path.join(__dirname, "data", "retroSummary.db"), autoload: true });

// 📌 Datos iniciales con estructura corregida y `_id`
const initialData = {
  _id: "retroSummary_001", // ✅ Identificador único
  QueHicimosBien: [
    "El equipo siempre está dispuesto a ayudar.",
    "El aumento en la generación de documentación.",
    "Los servidores para pruebas cada vez son más estables.",
    "Los nuevos procedimientos y documentos que se han generado.",
    "Las ganas y el compromiso del equipo.",
    "La retroalimentación del 1:1.",
    "La nueva forma de realizar la reunión retrospectiva.",
    "La finalización del trimestre y el cumplimiento de los objetivos.",
    "La sinergía del equipo.",
    "El manejo profesional de las prioridades.",
    "Se terminaron las tareas a tiempo.",
    "Participamos con presentaciones en varias reuniones de revisión.",
    "El aumento de la documentación en Confluence es de gran ayuda cuando se necesita información sobre algún tema.",
    "Las ramas lleven el nombre del ticket en el que se está trabajando, así como los commits, para facilitar la sincronización entre Jira y Git.",
    "Las reuniones con Néstor sobre las pruebas automatizadas.",
    "La colaboración de Fernando ajustando lo que no funciona en Intranet2.",
    "Crear una rama por ticket trabajando en Jira.",
    "Las mejoras en cuanto a testing y CI (backend).",
    "La presentación en el Kick-off de un trabajo desarrollado por el equipo.",
    "Continuar haciendo pruebas a nuestros desarrollos, en la medida de lo posible.",
    "Delegar responsabilidades de equipo, por ejemplo, liderar la realización de las reuniones retrospectivas.",
    "Mantener el compromiso individual con las tareas asignadas, asegurándonos de cumplir con las expectativas y objetivos establecidos.",
    "Seguir siendo el mejor equipo.",
    "Veníamos cerrando muy bien los objetivos. Es importante revisar cuidadosamente los actuales para evitar errores.",
    "El trabajo de Darío con la ventana de Tigo Cenam. ¡Felicitaciones!",
    "La realización constante de pruebas.",
    "La generación de incentivos para documentar código y procesos.",
    "El acompañamiento del equipo para las ventanas.",
    "El buen trabajo en equipo.",
    "El compromiso del grupo.",
    "El alto nivel de profesionalismo.",
    "El buen desempeño del equipo se refleja en su capacidad para responder con agilidad a los problemas que surgen de manera urgente.",
    "Las pruebas al código, son desgastantes pero ahorran tiempo.",
    "La confiabilidad del equipo.",
    "La colaboración por parte del equipo."
  ],
  OportunidadesDeMejora: [
    "La necesidad de aceptar que las prioridades cambian y no es algo personal.",
    "Es fundamental que cada sistema que utilizamos cuente con un archivo README claro, que incluya un paso a paso sobre cómo configurar un entorno y realizar las pruebas correspondientes.",
    "Esto debe aplicarse también al release notes, detallando los cambios realizados.",
    "Cada proyecto y objetivo debe tener su propio ambiente para evitar conflictos.",
    "El uso de nuevas plataformas para las POC.",
    "El aprendizaje y entendimiento de nuevos conceptos, ya que debo investigar y leer los temas que documento en Confluence o en documentos oficiales.",
    "Ambientes de Kea, hooks, extensions, Mandarin, deployment, Oracle DB y CiscoCIM.",
    "El funcionamiento de Puppet, CI y plugins de Gradle.",
    "La importancia de repasar cada cierto tiempo las DoD (definitions of done) de las épicas de los objetivos para estar seguros de tener todos los temas contemplados.",
    "Los ambientes de desarrollo más actualizados y automatizados.",
    "La fijación de los objetivos con mayor anticipación, considerando que somos dos grupos pequeños para tantos objetivos.",
    "Clarificar las tareas necesarias para alcanzar los objetivos.",
    "Evitar agregar objetivos importantes a mitad del trimestre.",
    "No llegar corriendo, con el último suspiro, al final del trimestre.",
    "Las fallas en la Intranet2 que no han permitido continuar con las pruebas automatizadas.",
    "Ramas genéricas sin referenciar tickets.",
    "Dejar los temas pendientes para revisar al final.",
    "Tickets sin descripción o sin comentarios al cerrarlos.",
    "Cambio de alcance sobre la marcha.",
    "La planeación muchas veces es superada en importancia por las prioridades.",
    "Las definiciones de producto no son muy buenas.",
    "Como parte de mi rol como líder, debo salir de la parte técnica de vez en cuando para tener visibilidad de cada uno.",
    "Dedicar tiempo a objetivos que tienen definiciones poco claras y generan dudas.",
    "No incluirnos en las tareas programadas.",
    "Cada dos meses, por ejemplo, involucrar a un funcionario de PX en la reunión retrospectiva, para que plantee o hable sobre temas organizacionales.",
    "Crear reuniones con los miembros del equipo para aclarar dudas y proponer mejoras.",
    "Proponer los objetivos del trimestre o tener objetivos reservados que se puedan trabajar si el periodo lo permite.",
    "La planificación del primer trimestre.",
    "Cuando hayan nuevas solicitudes, realizar una reunión con el encargado del área de Producto para que defina las expectativas.",
    "La estabilidad del ambiente de pruebas.",
    "Hacer una revisión comparativa de la reunión retrospectiva previa y la que se lleva a cabo.",
    "Verificar si se ejecutó alguna acción (acciones pendientes) de la reunión retrospectiva anterior.",
    "Considerar que debido a una gran carga de trabajo puede verse afectada la calidad del desarrollo.",
    "Analizar y discutir las métricas de cada sprint al finalizar la reunión de planeación."
  ],
  QueHicimosMal: [
    "La documentación del simulador y los ambientes de desarrollo.",
    "Más información en los tickets de Jira, como la descripción, los criterios de aceptación y pasos de reproducción.",
    "La ausencia de organización en la reunión de demostración, lo que ocasionó una pérdida de tiempo no intencionada, impidiendo la presentación.",
    "Durante el trimestre, es importante leer con más detalle las definiciones de hecho (DOD) de las épicas y los objetivos, para asegurarnos de no desviarnos.",
    "Obtener una visión más clara para mejorar la participación del equipo de desarrollo en el proyecto POC de Telecentro.",
    "Documentar las pruebas con simuladores.",
    "Documentar las soluciones a problemas comunes y frecuentes.",
    "Realizar revisión de código.",
    "Las estimaciones de la definición y del alcance de cada ticket.",
    "CI y pruebas automatizadas.",
    "Exponer todas las dudas que surjan durante las reuniones.",
    "Definiciones tardías y cambios de alcance."
  ]
};

// 🔹 Eliminar datos previos y luego insertar los nuevos datos
db.remove({}, { multi: true }, (err, numRemoved) => {
  if (err) {
    console.error("❌ Error al limpiar la base de datos:", err);
  } else {
    console.log(`🗑️ Se eliminaron ${numRemoved} registros antiguos.`);
    db.insert(initialData, (err, newDoc) => {
      if (err) {
        console.error("❌ Error al insertar datos:", err);
      } else {
        console.log("✅ Datos iniciales insertados correctamente:", newDoc);
      }
    });
  }
});


