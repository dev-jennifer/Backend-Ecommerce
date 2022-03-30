import express from "express";
const autentificacionRuta = express.Router();

autentificacionRuta.post("/login", (req, res) => {
  req.session.nombre = req.body.name;
  res.redirect("/");
});
autentificacionRuta.get("/login", (req, res) => {
  const nombre = req.session.nombre;

  if (nombre) {
    res.redirect("/");
  } else {
    res.render("login.hbs");
  }
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

export default autentificacionRuta;
