const router             = require('express').Router();
const PracticaController = require('../../controllers/terapia/PracticaController');
const { soloFamilia }    = require('../../middleware/auth');
router.use(soloFamilia);
router.post('/',             PracticaController.iniciarSesion);
router.put('/:id/respuesta', PracticaController.registrarRespuesta);
router.put('/:id/finalizar', PracticaController.finalizarSesion);
module.exports = router;
