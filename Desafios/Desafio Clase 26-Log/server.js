import express from "express";
import productosTestRuta from "./rutas/productosTestRuta.js";
import autentificacionRuta from "./rutas/autentificacionRuta.js";

import { normalizedHolding } from "./src/utils/normalizr.js";
import { createServer } from "http";
import { Server } from "socket.io";
import passport from "passport";
import { Strategy } from "passport-facebook";
const FacebookStrategy = Strategy;

import MensajesDAO from "./src/DAO/firebase.dao.js";

import hbs from "hbs";
import path from "path";
import options from "./src/utils/options.js";

const mensajeClass = new MensajesDAO();


import cookieParser from "cookie-parser";
import session from "express-session";
// import connectMongo from 'connect-mongo'

const app = express();
const httpServer = new createServer(app);
const io = new Server(httpServer);

const FACEBOOK_APP_ID = options.facebookId.facebook_app_id;
const FACEBOOK_APP_SECRET = options.facebookId.facebook_app_secret;

/*-------- [Conf Passport]*/
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:8081/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },

    function (accessToken, refreshToken, profile, cb) {
      console.log("accessToken: ", accessToken);
      console.log("refreshToken: ", refreshToken);
      // console.log(profile);
      cb(null, profile);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

/*----------- Session -----------*/
app.use(cookieParser());
app.use(
  session({
    secret: "1234567890!@#$%^&*()",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: "auto",
      maxAge: 600,
    },
  })
);

const __dirname = path.resolve();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views"); //Folder views (templates)
hbs.registerPartials(__dirname + "/public/views/partials", function (err) {});

/*----------- passport -----------*/
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

app.use("/", autentificacionRuta);

/*============================[Rutas]============================*/
app.get("/chat", (req, res) => {
  res.render("chat");
});
app.use("/", productosTestRuta);
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/",
    successRedirect: "/datos",
    authType: "reauthenticate",
  })
);

app.get("/datos", (req, res) => {
  if (req.isAuthenticated()) {
    if (!req.user.contador) {
      req.user.contador = 0;
    }
    req.user.contador++;
    console.log(req.user);
    const datosUsuario = {
      nombre: req.user.displayName,
      foto: req.user.photos[0].value,
      email: req.user.emails[0].value,
    };
    res.render("datos", { contador: req.user.contador, datos: datosUsuario });
  } else {
    res.redirect("/");
    console.log("Usuario no autenticdo");
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



io.on("connection", async (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  socket.on("mensajeNuevo", async (msg) => {
    await mensajeClass.guardar(msg);
    const mensajeGuardados = await mensajeClass.mostrarTodos();

    const normalizar = normalizedHolding(mensajeGuardados);
    const longO = JSON.stringify(mensajeGuardados).length;
    const longN = JSON.stringify(normalizar).length;
    const porcentaje = (longN * 100) / longO;

    socket.emit("mensajes", {
      normalizedHolding: normalizar,
      porcentaje: porcentaje,
    });
  });
});

/* ---------------------- Servidor ----------------------*/
const PORT = process.env.PORT || 8081;
const server = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
