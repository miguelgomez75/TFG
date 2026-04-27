const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre:   { type: String },
  email:    { type: String },
  password: { type: String },
  rol:      { type: String }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
