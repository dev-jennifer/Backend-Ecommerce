class ProductDTO {
  constructor(id, nombre, descripcion, foto, codigo, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.foto = foto;
    this.codigo = codigo;
    this.precio = precio;
    this.stock = stock;
  }

  getProducts() {
    return this.nombre;
  }
}
module.exports=ProductDTO