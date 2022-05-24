const express =require("express");
const ProductsController = require("../controllers/products.controller");

const routerProducts = express.Router();

routerProducts.get("/nuevo", ProductsController.renderNewProduct)
routerProducts.get("/", ProductsController.renderProducts)
routerProducts.post("/", ProductsController.saveProducts)
routerProducts.delete("/:id", ProductsController.deleteProduct)
routerProducts.get("/:id?",ProductsController.getProduct)
routerProducts.get("/edit/:id", ProductsController.formEditProduct)
routerProducts.put("/:id", ProductsController.editProduct)


module.exports=routerProducts;