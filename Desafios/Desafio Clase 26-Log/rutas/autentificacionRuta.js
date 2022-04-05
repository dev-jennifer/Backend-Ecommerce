import express from "express";
import { generateAuthToken,auth} from './../jwt.js';
import jwt from "jsonwebtoken";

const autentificacionRuta = express.Router();
autentificacionRuta.get("/login", (req, res) => {
  const nombre = req.session.nombre;

  if (nombre) {
    res.redirect("/");
  } else {
    res.render("login.hbs");
  }
});

autentificacionRuta.post("/login", (req, res) => {
  const { nombre, password } = req.body;
  const usuario = usuarios.find((usuario) => usuario.nombre == nombre);
  if (!usuario) {
    return res.json({ error: "usuario no registrado" });
  }

  const credencialesOk =
    usuario.nombre == nombre && usuario.password == password;
  if (!credencialesOk) {
    return res.json({ error: "credenciales invalidas" });
  }

  usuario.contador = 0;
  const access_token = jwt.generateAuthToken(nombre);
  res.json({
    nombre,
    access_token,
  });
});

autentificacionRuta.get("/login-error", (req, res) => {
  res.render("login-error");
});

autentificacionRuta.get("/logout", (req, res) => {
  const nombre = req.session.nombre;

  if (nombre) {
    res.render("logout.hbs");
    try {
      req.session.destroy();
      res.set({ Refresh: "2; url=/login" });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/");
  }
});

autentificacionRuta.get("/register", (req, res) => {
  res.render("register.hbs");
});

const usuarios = [];
autentificacionRuta.post("/register", (req, res) => {
  const { nombre } = req.body;
  const usuario = usuarios.find((usuario) => usuario.nombre == nombre);
  if (usuario) {
    return res.status(400).json({ error: "el nombre de usuario ya existe" });
  }

  const user = req.body;
  if (!user.contador) {
    user.contador = 0;
  }
  usuarios.push(req.body);
  const access_token = generateAuthToken(nombre);
  // res.json({ access_token });
  console.log(usuarios)
  res.redirect("/")
});

autentificacionRuta.get("/register-error", (req, res) => {
  res.render("register-error");
});


/* --------- API DE DATOS ---------- */
autentificacionRuta.get("/api/datos", auth, (req, res) => {
  const usuario = usuarios.find((usuario) => usuario.nombre == req.user.nombre);
  if (!usuario) {
    return res.status(404).json({ error: "usuario no encontrado" });
  }

  usuario.contador++;
  res.json({
    datos: usuario,
    contador: usuario.contador,
  });
});
export default autentificacionRuta;
