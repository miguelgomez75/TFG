// seed.js — ejecutar con: node seed.js
// Borra usuarios existentes y crea logopeda + familia limpios
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre:   String,
  email:    String,
  password: String,
  rol:      String
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/caa');
  console.log('Conectado a MongoDB');

  // Borrar usuarios anteriores con estos emails para empezar limpio
  await Usuario.deleteMany({ email: { $in: ['logopeda@caa.es', 'familia@caa.es'] } });
  console.log('Usuarios anteriores eliminados');

  const hashLogopeda = await bcrypt.hash('logopeda123', 10);
  const hashFamilia  = await bcrypt.hash('familia123',  10);

  await Usuario.create([
    { nombre: 'Ana García',      email: 'logopeda@caa.es', password: hashLogopeda, rol: 'LOGOPEDA' },
    { nombre: 'Carlos Martínez', email: 'familia@caa.es',  password: hashFamilia,  rol: 'FAMILIA'  }
  ]);

  console.log('✓ Logopeda creado  → logopeda@caa.es / logopeda123');
  console.log('✓ Familia creada   → familia@caa.es  / familia123');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
