const router           = require('express').Router();
const SesionController = require('../../controllers/terapia/SesionController');
const { soloLogopeda } = require('../../middleware/auth');
router.use(soloLogopeda);
router.post('/',           SesionController.crearSesion);
router.get('/:pacienteId', SesionController.getSesiones);
module.exports = router;
