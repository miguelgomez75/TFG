const router             = require('express').Router();
const PacienteController = require('../../controllers/terapia/PacienteController');
const { soloLogopeda }   = require('../../middleware/auth');

router.use(soloLogopeda);

router.get('/activos', PacienteController.listarPacientesActivos); // RUP: findActivos
router.get('/',        PacienteController.listarPacientes);
router.get('/:id',     PacienteController.consultarPaciente);
router.post('/',       PacienteController.crearPaciente);
router.put('/:id',     PacienteController.editarPaciente);
router.delete('/:id',  PacienteController.eliminarPaciente);       // RUP: deleteById

module.exports = router;
