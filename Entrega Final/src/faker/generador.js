const {faker}=require("@faker-js/faker")
faker.locale="es"

const generadorProductos = () => ({
  nombre: faker.commerce.productName(),
  descripcion: faker.commerce.productName(),
  precio: faker.commerce.price(),
  foto: faker.image.imageUrl(300, 300, 'commerce', true, true),
  categoria: "fruta",
  stock: 100,
});

module.exports = generadorProductos;