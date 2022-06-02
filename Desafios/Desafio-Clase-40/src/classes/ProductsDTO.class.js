class ProductDTO {
  constructor(nombre, descripcion,precio,foto,codigo,stock) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.foto = foto;
    this.codigo = codigo;
    this.stock = stock;
  }

  getProducts(){
      return this.nombre;
  }
}
module.exports=ProductDTO