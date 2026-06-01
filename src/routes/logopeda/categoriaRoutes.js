const router              = require('express').Router();
const CategoriaController = require('../../controllers/actividad/CategoriaController');
const { soloLogopeda }    = require('../../middleware/auth');

router.use(soloLogopeda);

router.get('/',    CategoriaController.listarCategorias); // RUP: findAll
router.post('/',   CategoriaController.crearCategoria);
router.put('/:id', CategoriaController.editarCategoria);

module.exports = router;
