const axios =require('axios');
const generadorProductos=require("../../src/faker/generador")
let url= 'http://localhost:8080/api/productos/'

 
const obtener = () => {
  axios
    .get(url)
    .then((response) => {
      // Obtenemos los datos
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const publicar = () => {
let nuevoProducto = generadorProductos()

   axios
     .post(url,nuevoProducto)
     .then((response) => {
       // Obtenemos los datos
       console.log(response.data);
     })
     .catch((error) => {
       console.log(error);
     });
 };

 const actualizar = () => {
    let nuevoProducto = generadorProductos();
   axios
     .put(`${url}/1`, nuevoProducto)
     .then((response) => {
       // Obtenemos los datos
       console.log(response.data);
     })
     .catch((error) => {
       console.log(error);
     });
 };

  const eliminar = () => {
   
    axios
      .delete(`${url}/1` )
      .then((response) => {
        // Obtenemos los datos
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
obtener()
//publicar
//actualizar();
//eliminar()