import express from "express";
import passport from "passport";
import { Strategy } from "passport-facebook";
const FacebookStrategy = Strategy;
import dotenv from "dotenv";
dotenv.config()

const autentificacionRuta = express.Router();
 
autentificacionRuta.get("/login", (req, res) => {
  res.render("login");
});


const FACE_APP_ID = process.env.FACEBOOK_APP_ID


const FACE_APP_SECRET =process.env.FACEBOOK_APP_SECRET  


 
passport.use(
  new FacebookStrategy(
    {
      clientID: FACE_APP_ID,
      clientSecret: FACE_APP_SECRET,
      callbackURL: "http://localhost:8081/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },

    function (accessToken, refreshToken, profile, cb) {
      console.log("accessToken: ", accessToken);
      console.log("refreshToken: ", refreshToken);
      console.log(profile);
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

    req.session.nombre = req.user.displayName;
    req.session.foto = req.user.photos[0].value;
    // email: req.user.emails[0].value,
    res.redirect("/");
  } else {
    res.redirect("/");
    console.log("Usuario no autenticdo");
  }
});

autentificacionRuta.get("/logout", (req, res) => {
  
  req.logout();
  req.session.destroy();
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
