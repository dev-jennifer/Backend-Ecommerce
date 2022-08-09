class ProductDTO {
  constructor(productos) {
    this.id = productos.id;
    this.nombre = productos.nombre;
    this.descripcion = productos.descripcion;
    this.foto = productos.foto;
    this.categoria = productos.categoria;
    this.precio = productos.precio;
    this.stock = productos.stock;
  }

  getProductsAll = async () => {
    return (this.id,this.nombre,this.foto,this.categoria,this.precio) 
   
  };
}
module.exports=ProductDTO