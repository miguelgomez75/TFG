const router             = require('express').Router();
const ProgresoController = require('../../controllers/terapia/ProgresoController');
const { logopedaOFamilia } = require('../../middleware/auth');
router.use(logopedaOFamilia);
router.get('/:pacienteId', ProgresoController.getProgreso);
module.exports = router;
