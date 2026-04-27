const router             = require('express').Router();
const PacienteController = require('../../controllers/terapia/PacienteController');
const { soloLogopeda }   = require('../../middleware/auth');
router.use(soloLogopeda);
router.post('/',   PacienteController.crearPaciente);
router.get('/',    PacienteController.listarPacientes);
router.get('/:id', PacienteController.consultarPaciente);
router.put('/:id', PacienteController.editarPaciente);
module.exports = router;
