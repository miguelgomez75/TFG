const mongoose  = require('mongoose');

// codigoAcceso: código corto legible generado automáticamente (PAC-XXXX)
// que el logopeda puede compartir con la familia sin exponer el _id de Mongo.
const pacienteSchema = new mongoose.Schema({
  nombre:          { type: String, required: true },
  fechaNacimiento: { type: Date },
  nivelActual:     { type: String },
  activo:          { type: Boolean, default: true },
  codigoAcceso:    { type: String, unique: true },   // ← nuevo: código legible
  usuarioId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, { timestamps: true });

// Genera el código antes de guardar si aún no tiene uno
pacienteSchema.pre('save', async function (next) {
  if (this.codigoAcceso) return next();
  let intentos = 0;
  let codigo;
  do {
    const num = String(Math.floor(1000 + Math.random() * 9000)); // 1000-9999
    codigo = `PAC-${num}`;
    const existe = await mongoose.model('Paciente').findOne({ codigoAcceso: codigo });
    if (!existe) break;
    intentos++;
  } while (intentos < 10);
  this.codigoAcceso = codigo;
  next();
});

module.exports = mongoose.model('Paciente', pacienteSchema);
