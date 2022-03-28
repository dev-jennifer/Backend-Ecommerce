 
const fs = require("fs");
class Contenedor {
  constructor(nombreArchivo) {
    this.ruta = "./data/" + nombreArchivo + ".txt";
  }

  getAll() {
    let contenidoExistente;

    if (!fs.existsSync(this.ruta)|| fs.readFileSync(this.ruta, "utf-8")=="") {
      contenidoExistente = [];
      
    } else {
      try {
        contenidoExistente = fs.readFileSync(this.ruta, "utf-8");
        contenidoExistente = JSON.parse(contenidoExistente)

      } catch (error) {
        throw new Error("Error");
      }
    } 
    return contenidoExistente
      
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
    console.log(index);
    if (index != -1) {
      contenidoExistente.splice(index, 1);

      fs.writeFile(
        this.ruta,
        JSON.stringify(contenidoExistente, null, 2),
        (error) => {
          if (error) {
            throw new Error(error);
          } else {
            console.log("Se ha eliminado el ID:", numero);
          }
        }
      );
    } else {
      console.log("No existe ID");
    }
  }

  deleteAll() {
    let borrar = [];
  
    fs.writeFile(this.ruta, JSON.stringify(borrar), (error) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log("Se ha borrado todo su contenido");
      }
    });
  }
}

module.exports = Contenedor

