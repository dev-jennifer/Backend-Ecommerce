const twilio =require('twilio')
const CONFIG = require('../../src/utils/config');
const client = twilio(CONFIG.TWILO.ACCOUNT_SID, CONFIG.TWILO.AUTH_TOKEN);

 
async function msgSend(number, order){
try {
  //sms to user
    const message = await client.messages.create({
      body: `Hemos recibido su pedido  se encuentra en estado PROCESANDO`,
      from: CONFIG.TWILO.TWILO_PHONE,
      to: number,
    });
 
} catch (e) {
   console.error('SMS CLIENT', e);
}
try {
  //whatsapp to admin
  const smsAdmin = await client.messages
    .create({
      from: `whatsapp:${CONFIG.TWILO.WHATSAPP_FROM}`,
      to: `whatsapp:${CONFIG.TWILO.WHATSAPP_ADMIN}`,
      body: `Nuevo Pedido nº${order.id}  - ${order.buyerID} `,
    })
    .then((message) => console.warn('SID', message.sid))
    .done();
 
} catch (e) {
   console.error('SMS admin', e);
}
 
}


module.exports=msgSend