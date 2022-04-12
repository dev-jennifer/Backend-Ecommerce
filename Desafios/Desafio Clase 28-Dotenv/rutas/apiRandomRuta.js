import express from "express";
import minimist from "minimist";

import { fork } from "child_process";

import path from "path";
const __dirname = path.resolve();

const apiRandomRuta = express.Router();

apiRandomRuta.get("/:cant?", async (req, res) => {
  console.log("[Parent]", "initalize");

  const cantidad = req.params.cant !== undefined ? req.params.cant : 100000000;

  let child = fork(__dirname + "/rutas/child.js");
 
  child.on("message", (msg) => {
    if (msg == "ok") {
      child.send(cantidad);
    } else {
      res.json(msg);
    }
  });

});

export default apiRandomRuta;
