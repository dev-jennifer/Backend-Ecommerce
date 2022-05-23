const twilio =require('twilio')
const {
  ACCOUNT_SID,
  AUTH_TOKEN,
  TWILO_PHONE,
  WHATSAPP_ADMIN,
  WHATSAPP_FROM,
} = require('../../src/utils/config');
const client = twilio(ACCOUNT_SID, AUTH_TOKEN,TWILO_PHONE);

async function msgSend(number, order){
  console.log("order",order);

// try {
//   //sms to user
//     const message = await client.messages.create({
//       body: `Hemos recibido su pedido  se encuentra en estado PROCESANDO`,
//       from: TWILO_PHONE,
//       to: number,
//     });
 
// } catch (e) {
//    console.error('SMS CLIENT', e);
// }
try {
  //whatsapp to admin
  console.warn("WHATSAPP_FROM",WHATSAPP_FROM);
    console.warn("WHATSAPP_ADMIN",WHATSAPP_ADMIN);
    
  const smsAdmin = await client.messages.create({
    from: `whatsapp:${WHATSAPP_FROM}`,
    to: `whatsapp:${WHATSAPP_ADMIN}`,
    body: `Nuevo Pedido nº${order.id} de ${order.name} - ${order.buyerID} `,
  });
 
} catch (e) {
   console.error('SMS admin', e);
}
 
}


module.exports=msgSend