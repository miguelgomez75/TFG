const router             = require('express').Router();
const ProgresoController = require('../../controllers/terapia/ProgresoController');
const { soloFamilia }    = require('../../middleware/auth');

// RUP CdU-06: Familia también puede ver el progreso de su paciente
router.use(soloFamilia);
router.get('/:pacienteId', ProgresoController.getProgreso);

module.exports = router;
