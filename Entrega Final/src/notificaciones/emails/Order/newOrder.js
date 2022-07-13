const send = require('../../config/configEmail');

//email to admin
function newOrderEmail(resultado) {
  console.log("resultadoEmail", resultado)
  const templateFile = 'templateOrder',
    subject = `Nuevo pedido de  ${resultado.buyerID}- ${resultado.name}`,
    info = {
      orderNumber: resultado.id,
      producto: resultado.items,
      total: resultado.total,
    };

     send(templateFile, subject, info);
}
  
module.exports =  newOrderEmail ;
