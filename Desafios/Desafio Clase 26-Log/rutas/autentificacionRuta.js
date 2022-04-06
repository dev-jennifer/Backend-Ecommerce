import express from "express";
import passport from "passport";
import options from "../src/utils/options.js";


import { Strategy } from "passport-facebook";
const FacebookStrategy = Strategy;

const autentificacionRuta = express.Router();
autentificacionRuta.get("/login", (req, res) => {
  res.render("login");
});


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

autentificacionRuta.get("/datos", (req, res) => {
  if (req.isAuthenticated()) {
    if (!req.user.contador) {
      req.user.contador = 0;
    }
    req.user.contador++;
    console.log(req.user);
    const datosUsuario = {
      nombre: req.user.displayName,
      foto: req.user.photos[0].value,
      // email: req.user.emails[0].value,
    };
    res.render("datos", { contador: req.user.contador, datos: datosUsuario });
  } else {
    res.redirect("/");
    console.log("Usuario no autenticdo");
  }
});

autentificacionRuta.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

autentificacionRuta.get("/auth/facebook", passport.authenticate("facebook"));

autentificacionRuta.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/",
    successRedirect: "/datos",
    authType: "reauthenticate",
  })
);

export default autentificacionRuta;
