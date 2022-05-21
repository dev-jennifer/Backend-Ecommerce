const send = require('../../config/configEmail');

function newOrderEmail(resultado) {
  console.log('EJECUTANDO', resultado);
  const templateFile = 'templateOrder',
    toEmail = resultado.buyerID,
    subject = 'Nueva Orden',
    info = { orderNumber: resultado.id };

     send(templateFile, toEmail, subject, info);
}
  
module.exports = { newOrderEmail };
