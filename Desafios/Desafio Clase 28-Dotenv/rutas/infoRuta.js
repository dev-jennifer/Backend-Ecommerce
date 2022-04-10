import express from "express";
import minimist from 'minimist';
import dotenv from "dotenv";
dotenv.config()

const infoRuta = express.Router();
 
infoRuta.get("/", (req, res) => {

    const argumentos= process.argv.forEach((val, index) => {
        console.log(`${index}: ${val}`);
      });

    const memory=process.memoryUsage()
 
  res.render("info.hbs", {datos:[argumentos,memory]});
});

export default infoRuta;
