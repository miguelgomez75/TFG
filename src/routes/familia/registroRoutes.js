const router                    = require('express').Router();
const RegistroClinicoController = require('../../controllers/comunicacion/RegistroClinicoController');
const { soloFamilia }           = require('../../middleware/auth');

// ISP: Familia solo puede leer registros y recomendaciones
router.use(soloFamilia);

// IMPORTANTE: ruta estática ANTES de la paramétrica
router.get('/recomendaciones/:pacienteId', RegistroClinicoController.getRecomendaciones); // ANTES de /:pacienteId
router.get('/:pacienteId',                 RegistroClinicoController.getRegistros);

module.exports = router;
