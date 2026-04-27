const jwt = require('jsonwebtoken');

// V3 ISP: interfaces de acceso segregadas por actor
// Cada actor solo ve los endpoints que le corresponden

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const soloLogopeda = (req, res, next) => {
  if (req.usuario.rol !== 'LOGOPEDA')
    return res.status(403).json({ error: 'Acceso restringido a Logopeda' });
  next();
};

const soloFamilia = (req, res, next) => {
  if (req.usuario.rol !== 'FAMILIA')
    return res.status(403).json({ error: 'Acceso restringido a Familia' });
  next();
};

const logopedaOFamilia = (req, res, next) => {
  if (!['LOGOPEDA', 'FAMILIA'].includes(req.usuario.rol))
    return res.status(403).json({ error: 'Acceso no autorizado' });
  next();
};

module.exports = { verificarToken, soloLogopeda, soloFamilia, logopedaOFamilia };
