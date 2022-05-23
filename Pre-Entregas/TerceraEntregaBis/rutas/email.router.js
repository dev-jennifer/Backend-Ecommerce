const express=require("express")
const routerTemplate = express.Router();

routerTemplate.post('/:template', function (req, res) {
  res.render(`${req.params.template}`, {
    data: req.body,
  });
});


module.exports=routerTemplate