const socket = io.connect();

/* ---------------------- Chat ----------------------*/

function enviarMensaje() {
  const id = document.querySelector("#id");
  const nombre = document.querySelector("#nombre");
  const apellido = document.querySelector("#apellido");
  const edad = document.querySelector("#edad");
  const avatar = document.querySelector("#avatar");
  const texto = document.querySelector("#textoMensaje");
  const alias = document.querySelector("#alias");

  const date = new Date();
  const dateStr =
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("00" + date.getDate()).slice(-2) +
    "/" +
    date.getFullYear() +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);

  socket.emit("mensajeNuevo", {
    id: id.value,
    nombre: nombre.value,
    apellido: apellido.value,
    edad: edad.value,
    alias: alias.value,
    avatar: avatar.value,
    textoMsj: texto.value,
    fecha: dateStr,
  });
  return false;
}

socket.on(
  "mensajes",
  ({ normalizedHolding, mensajeSchema, porcentaje }) => {

    console.log("normalizado", normalizedHolding);

    const denormalizedHolding = normalizr.denormalize(
      normalizedHolding.result,
      mensajeSchema,
      normalizedHolding.entities.mensaje
    );
    console.log("mensaje", denormalizedHolding);

    const porcentajeMensaje=(`Porcentaje Optimizado: ${porcentaje.toFixed(2)} %`);
    document.getElementById("contenedorMensaje").innerHTML = porcentajeMensaje;

    let constMensajeHtml = "";
    denormalizedHolding.forEach((msg) => {
      console.log("Msg", msg);
      constMensajeHtml += `
        <span style="color:blue;">
          <b>${msg.author.alias}</b></span>
        <span style="color:brown";>${msg.text}</span>
        <span style="color:green; font-style:italic";>${msg.date}</span>
        <br>
        <img src="${msg.author.avatar}" style="width:30px";/>`;
    });
    document.getElementById("contenedorMensaje").innerHTML = constMensajeHtml;
  }
);

socket.on("mensajes", (normalizedHolding, mensaje) => {
  console.log("\n ------------- OBJETO DESNORMALIZADO --------------- ");
  const denormalizedHolding = normalizr.denormalize(
    normalizedHolding.result,
    mensaje,
    normalizedHolding.entities
  );
  print(denormalizedHolding);

  const longN = JSON.stringify(normalizedHolding).length;

  console.log("\nLongitud objeto original: ", longO);
  console.log("\nLongitud objeto normalizado: ", longN);

  const porcentaje = (longN * 100) / longO;
  const porcentajeMensaje = `Porcentaje Optimizado: ${porcentaje.toFixed(2)} %`;
  document.getElementById("contenedorMensaje").innerHTML = porcentajeMensaje;

  let constMensajeHtml = "";
  console.log("Mensajes", denormalizedHolding);

  denormalizedHolding.forEach((msg) => {
    console.log("Msg", msg);
    constMensajeHtml += `
        <span style="color:blue;">
          <b>${msg.author.alias}</b></span>
        <span style="color:brown";>${msg.text}</span>
        <span style="color:green; font-style:italic";>${msg.date}</span>
        <br>
        <img src="${msg.author.avatar}" style="width:30px";/>`;
  });

  document.getElementById("contenedorMensaje").innerHTML = constMensajeHtml;
});
