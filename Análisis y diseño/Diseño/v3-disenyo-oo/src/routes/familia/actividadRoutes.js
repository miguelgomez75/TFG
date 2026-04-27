const router              = require('express').Router();
const ActividadController = require('../../controllers/actividad/ActividadController');
const { soloFamilia }     = require('../../middleware/auth');
// V3 ISP: Familia solo puede ver actividades disponibles
router.use(soloFamilia);
router.get('/:id', ActividadController.getActividad);
router.get('/',    ActividadController.listarActividadesDisponibles);
module.exports = router;
