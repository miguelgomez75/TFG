const router             = require('express').Router();
const PracticaController = require('../../controllers/terapia/PracticaController');
const { soloFamilia }    = require('../../middleware/auth');

router.use(soloFamilia);

router.post('/',             PracticaController.iniciarSesion);      // crearSesion
router.put('/:id/respuesta', PracticaController.registrarRespuesta); // registrarRespuesta
router.put('/:id/finalizar', PracticaController.finalizarSesion);    // finalizarSesion + marcarCompletada

module.exports = router;
