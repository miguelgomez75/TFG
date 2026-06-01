const router           = require('express').Router();
const SesionController = require('../../controllers/terapia/SesionController');
const { soloLogopeda } = require('../../middleware/auth');

router.use(soloLogopeda);

// IMPORTANTE: rutas estáticas ANTES de las paramétricas para evitar colisiones
router.post('/',                SesionController.guardarSesion);    // CdU-05: guardarSesion
router.get('/detalle/:id',      SesionController.getSesion);        // cargarSesion — ANTES de /:pacienteId
router.get('/:pacienteId',      SesionController.getSesiones);      // findByPaciente
router.put('/:id',              SesionController.actualizarSesion); // update
router.delete('/:id',           SesionController.eliminarSesion);   // deleteById

module.exports = router;
