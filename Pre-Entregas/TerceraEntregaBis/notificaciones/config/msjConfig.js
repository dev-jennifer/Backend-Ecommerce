const twilio =require('twilio')
const {
  ACCOUNT_SID,
  AUTH_TOKEN,
  TWILO_PHONE,
  WHATSAPP_ADMIN,
  WHATSAPP_FROM,
} = require('../../src/utils/config');
const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

async function msgSend(number, order){
 

try {
  //sms to user
    const message = await client.messages.create({
      body: `Hemos recibido su pedido  se encuentra en estado PROCESANDO`,
      from: TWILO_PHONE,
      to: number,
    });
 
} catch (e) {
   console.error('SMS CLIENT', e);
}
try {
  //whatsapp to admin
  const smsAdmin = await client.messages
    .create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${WHATSAPP_ADMIN}`,
      body: `Nuevo Pedido nº${order.id}  - ${order.buyerID} `,
    })
    .then((message) => console.warn("SID",message.sid))
    .done();
 
} catch (e) {
   console.error('SMS admin', e);
}
 
}


module.exports=msgSend