const express=require("express")
const routerEmail = express.Router();

routerEmail.post('/:template', function (req, res) {
  res.render(`${req.params.template}`, {
    data: req.body,
  });
});


module.exports = routerEmail;