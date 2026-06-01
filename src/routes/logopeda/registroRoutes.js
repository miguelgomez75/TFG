const router                    = require('express').Router();
const RegistroClinicoController = require('../../controllers/comunicacion/RegistroClinicoController');
const { soloLogopeda }          = require('../../middleware/auth');

router.use(soloLogopeda);

// IMPORTANTE: rutas estáticas ANTES de las paramétricas
router.post('/',                RegistroClinicoController.crearRegistro);
router.get('/detalle/:id',      RegistroClinicoController.getRegistro);       // ANTES de /:pacienteId
router.get('/:pacienteId',      RegistroClinicoController.getRegistros);
router.put('/:id',              RegistroClinicoController.editarRegistro);
router.delete('/:id',           RegistroClinicoController.eliminarRegistro);

module.exports = router;
