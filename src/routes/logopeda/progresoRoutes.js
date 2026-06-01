const router              = require('express').Router();
const ProgresoController  = require('../../controllers/terapia/ProgresoController');
const { logopedaOFamilia }= require('../../middleware/auth');

// Compartida: tanto Logopeda como Familia pueden ver el progreso
router.use(logopedaOFamilia);

router.get('/:pacienteId', ProgresoController.getProgreso);

module.exports = router;
