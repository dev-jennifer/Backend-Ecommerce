const fs = require("fs");
class Productos {
  constructor() {
    this.ruta = "./public/data/productos.txt";
  }

  getAll() {
    let data;
    try {
      let jsonData = fs.readFileSync(this.ruta, "utf-8");
      data = JSON.parse(jsonData);
    } catch (error) {
      data = [];
    }
    return data;
  }

  save(objeto) {
    let contenido = this.getAll();

    let id = contenido.length + 1;
    let nuevoObjeto = { ...objeto, id };
    contenido.push(nuevoObjeto);

    fs.writeFile(this.ruta, JSON.stringify(contenido, null, 2), (error) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log("Nuevo ID: " + id);
        return id;
      }
    });
  }

  getById(numero) {
    const contenidoExistente = this.getAll();
    const index = contenidoExistente.findIndex((x) => x.id === numero);
    let mensaje;
    if (index == -1) {
      mensaje = "No hay valores para ese ID";
    } else {
      mensaje = contenidoExistente[index];
    }
    return mensaje;
  }

  deleteById(numero) {
    const contenidoExistente = this.getAll();

    const index = contenidoExistente.findIndex((x) => x.id === numero);
    console.log(contenidoExistente)
    console.log("id:", numero)

    let mensaje;
    if (index != -1) {
      contenidoExistente.splice(index, 1);
      console.log(contenidoExistente)
      fs.writeFile(this.ruta, JSON.stringify(contenidoExistente, null, 2), (error) => {
        if (error) {
          throw new Error(error);
          } else {
             mensaje = "Se ha eliminado el ID:" 
          }
        }
        
      )
    } 
    return mensaje;
  }

  //   deleteAll() {
  //     let borrar = [];

  //     fs.writeFile(this.ruta, JSON.stringify(borrar), (error) => {
  //       if (error) {
  //         throw new Error(error);
  //       } else {
  //         console.log("Se ha borrado todo su contenido");
  //       }
  //     });
  //   }
}

module.exports = Productos;
