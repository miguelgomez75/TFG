require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const path     = require('path');

const AuthController          = require('./controllers/auth/AuthController');
const PacienteController      = require('./controllers/terapia/PacienteController');
const SesionController        = require('./controllers/terapia/SesionController');
const PracticaController      = require('./controllers/terapia/PracticaController');
const ProgresoController      = require('./controllers/terapia/ProgresoController');
const ActividadController     = require('./controllers/actividad/ActividadController');
const AsignacionController    = require('./controllers/actividad/AsignacionController');
const RecomendacionController = require('./controllers/actividad/RecomendacionController');
const RegistroController      = require('./controllers/comunicacion/RegistroController');
const { verificarToken }      = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../views')));

app.post('/api/auth/login',    AuthController.login);
app.post('/api/auth/register', AuthController.register);

app.get('/api/pacientes',     verificarToken, PacienteController.listarPacientes);
app.post('/api/pacientes',    verificarToken, PacienteController.crearPaciente);
app.get('/api/pacientes/:id', verificarToken, PacienteController.consultarPaciente);
app.put('/api/pacientes/:id', verificarToken, PacienteController.editarPaciente);

app.get('/api/actividades',                  verificarToken, ActividadController.listarActividades);
app.get('/api/actividades/disponibles',      verificarToken, ActividadController.listarActividadesDisponibles);
app.post('/api/actividades',                 verificarToken, ActividadController.crearActividad);
app.get('/api/actividades/:id',              verificarToken, ActividadController.getActividad);
app.put('/api/actividades/:id/publicar',     verificarToken, ActividadController.publicarActividad);
app.put('/api/actividades/:id/archivar',     verificarToken, ActividadController.archivarActividad);

app.post('/api/asignaciones',             verificarToken, AsignacionController.asignarActividad);
app.get('/api/asignaciones/:pacienteId',  verificarToken, AsignacionController.getAsignaciones);
app.post('/api/recomendaciones',          verificarToken, RecomendacionController.recomendarActividad);

// V2: rutas separadas por actor
app.post('/api/practica',                 verificarToken, PracticaController.iniciarSesion);
app.put('/api/practica/:id/respuesta',    verificarToken, PracticaController.registrarRespuesta);
app.put('/api/practica/:id/finalizar',    verificarToken, PracticaController.finalizarSesion);

app.post('/api/sesiones',                 verificarToken, SesionController.crearSesion);
app.get('/api/sesiones/:pacienteId',      verificarToken, SesionController.getSesiones);

app.get('/api/registros/:pacienteId',  verificarToken, RegistroController.getRegistros);
app.post('/api/registros',             verificarToken, RegistroController.crearRegistro);
app.put('/api/registros/:id',          verificarToken, RegistroController.editarRegistro);
app.delete('/api/registros/:id',       verificarToken, RegistroController.eliminarRegistro);

app.get('/api/progreso/:pacienteId',   verificarToken, ProgresoController.getProgreso);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/caa')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error MongoDB:', err));

app.listen(process.env.PORT || 3001, () =>
  console.log(`Servidor V2 en puerto ${process.env.PORT || 3001}`)
);
