const router              = require('express').Router();
const ActividadController = require('../../controllers/actividad/ActividadController');
const { soloLogopeda }    = require('../../middleware/auth');

router.use(soloLogopeda);

router.get('/disponibles',     ActividadController.listarDisponibles);     // RUP: findDisponibles
router.get('/',                ActividadController.listarActividades);
router.get('/:id',             ActividadController.getActividad);
router.post('/',               ActividadController.crearActividad);
router.put('/:id',             ActividadController.editarActividad);
router.put('/:id/publicar',    ActividadController.publicarActividad);
router.put('/:id/archivar',    ActividadController.archivarActividad);
router.delete('/:id',          ActividadController.eliminarActividad);     // RUP: deleteById

module.exports = router;
