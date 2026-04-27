const router             = require('express').Router();
const RegistroController = require('../../controllers/comunicacion/RegistroController');
const { soloFamilia }    = require('../../middleware/auth');
router.use(soloFamilia);
router.get('/:pacienteId', RegistroController.getRegistros);
module.exports = router;
