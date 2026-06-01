const Usuario = require('../../models/usuario/Usuario');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, rol: usuario.rol, nombre: usuario.nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const usuario = new Usuario({ nombre, email, password: hash, rol });
    await usuario.save();
    res.status(201).json({ mensaje: 'Usuario creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login, register };
