const router               = require('express').Router();
const ActividadController  = require('../../controllers/actividad/ActividadController');
const AsignacionController = require('../../controllers/actividad/AsignacionController');
const { soloFamilia }      = require('../../middleware/auth');

// ISP: Familia solo puede ver actividades disponibles, no crear ni publicar
router.use(soloFamilia);

// IMPORTANTE: rutas estáticas ANTES de las paramétricas
router.get('/recomendadas/:pacienteId', AsignacionController.getAsignacionesActivas); // ANTES de /:id
router.get('/',                         ActividadController.listarActividadesDisponibles);
router.get('/:id',                      ActividadController.getActividad);

module.exports = router;
