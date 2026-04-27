const router             = require('express').Router();
const RegistroController = require('../../controllers/comunicacion/RegistroController');
const { soloLogopeda }   = require('../../middleware/auth');
router.use(soloLogopeda);
router.post('/',              RegistroController.crearRegistro);
router.put('/:id',            RegistroController.editarRegistro);
router.delete('/:id',         RegistroController.eliminarRegistro);
module.exports = router;
