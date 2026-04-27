require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const path     = require('path');

const AuthController   = require('./controllers/auth/AuthController');
const { verificarToken } = require('./middleware/auth');

// Rutas segregadas por actor (ISP)
const logopedaActividad = require('./routes/logopeda/actividadRoutes');
const logopedaPaciente  = require('./routes/logopeda/pacienteRoutes');
const logopedaSesion    = require('./routes/logopeda/sesionRoutes');
const logopedaRegistro  = require('./routes/logopeda/registroRoutes');
const logopedaProgreso  = require('./routes/logopeda/progresoRoutes');
const familiaActividad  = require('./routes/familia/actividadRoutes');
const familiaPractica   = require('./routes/familia/practicaRoutes');
const familiaRegistro   = require('./routes/familia/registroRoutes');

// Rutas compartidas
const AsignacionController    = require('./controllers/actividad/AsignacionController');
const RecomendacionController = require('./controllers/actividad/RecomendacionController');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../views')));

// Auth - sin token
app.post('/api/auth/login',    AuthController.login);
app.post('/api/auth/register', AuthController.register);

// Rutas Logopeda (todas requieren token, soloLogopeda en cada router)
app.use('/api/logopeda/actividades', verificarToken, logopedaActividad);
app.use('/api/logopeda/pacientes',   verificarToken, logopedaPaciente);
app.use('/api/logopeda/sesiones',    verificarToken, logopedaSesion);
app.use('/api/logopeda/registros',   verificarToken, logopedaRegistro);
app.use('/api/logopeda/progreso',    verificarToken, logopedaProgreso);
app.post('/api/logopeda/asignaciones',    verificarToken, AsignacionController.asignarActividad);
app.get('/api/logopeda/asignaciones/:pacienteId', verificarToken, AsignacionController.getAsignaciones);
app.post('/api/logopeda/recomendaciones', verificarToken, RecomendacionController.recomendarActividad);

// Rutas Familia (todas requieren token, soloFamilia en cada router)
app.use('/api/familia/actividades', verificarToken, familiaActividad);
app.use('/api/familia/practica',    verificarToken, familiaPractica);
app.use('/api/familia/registros',   verificarToken, familiaRegistro);
app.use('/api/familia/progreso',    verificarToken, logopedaProgreso); // compartida

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/caa')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error MongoDB:', err));

app.listen(process.env.PORT || 3002, () =>
  console.log(`Servidor V3 en puerto ${process.env.PORT || 3002}`)
);
