require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const path       = require('path');

const AuthController            = require('./controllers/auth/AuthController');
const PacienteController        = require('./controllers/terapia/PacienteController');
const AsignacionController      = require('./controllers/actividad/AsignacionController');
const RegistroClinicoController = require('./controllers/comunicacion/RegistroClinicoController');
const { verificarToken }        = require('./middleware/auth');

// ── Rutas Logopeda ──────────────────────────────────────────────────────────
const logopedaPaciente  = require('./routes/logopeda/pacienteRoutes');
const logopedaActividad = require('./routes/logopeda/actividadRoutes');
const logopedaCategoria = require('./routes/logopeda/categoriaRoutes');
const logopedaSesion    = require('./routes/logopeda/sesionRoutes');
const logopedaRegistro  = require('./routes/logopeda/registroRoutes');
const logopedaProgreso  = require('./routes/logopeda/progresoRoutes');

// ── Rutas Familia ───────────────────────────────────────────────────────────
const familiaActividad  = require('./routes/familia/actividadRoutes');
const familiaPractica   = require('./routes/familia/practicaRoutes');
const familiaRegistro   = require('./routes/familia/registroRoutes');
const familiaProgreso   = require('./routes/familia/progresoRoutes');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../views')));

// ── Auth y rutas públicas (sin token) ───────────────────────────────────────
app.post('/api/auth/login',    AuthController.login);
app.post('/api/auth/register', AuthController.register);

// Búsqueda de paciente por código legible — usada por la familia para
// identificar su paciente sin conocer el ObjectId de Mongo.
app.get('/api/pacientes/codigo/:codigo', PacienteController.buscarPorCodigo);

// ── Logopeda ────────────────────────────────────────────────────────────────
app.use('/api/logopeda/pacientes',   verificarToken, logopedaPaciente);
app.use('/api/logopeda/actividades', verificarToken, logopedaActividad);
app.use('/api/logopeda/categorias',  verificarToken, logopedaCategoria);
app.use('/api/logopeda/sesiones',    verificarToken, logopedaSesion);
app.use('/api/logopeda/registros',   verificarToken, logopedaRegistro);
app.use('/api/logopeda/progreso',    verificarToken, logopedaProgreso);

// RUP CdU-01: asignarActividad + getAsignaciones
app.post('/api/logopeda/asignaciones',
  verificarToken, AsignacionController.asignarActividad);
app.get('/api/logopeda/asignaciones/:pacienteId',
  verificarToken, AsignacionController.getAsignaciones);

// RUP CdU-04: recomendarActividad → crearRecomendacion
app.post('/api/logopeda/recomendaciones',
  verificarToken, RegistroClinicoController.crearRecomendacion);

// ── Familia ─────────────────────────────────────────────────────────────────
app.use('/api/familia/actividades',  verificarToken, familiaActividad);
app.use('/api/familia/practica',     verificarToken, familiaPractica);
app.use('/api/familia/registros',    verificarToken, familiaRegistro);
app.use('/api/familia/progreso',     verificarToken, familiaProgreso);

// ── MongoDB ─────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/caa')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error MongoDB:', err));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Servidor CAA-RUP en puerto ${PORT}`));
