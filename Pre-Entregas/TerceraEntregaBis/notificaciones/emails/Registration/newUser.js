const send = require('../../config/configEmail');
 
async function sendEmail(newUser) {
 
    const templateFile = 'templateRegistration',
      toEmail = newUser.email,
      subject = 'Nueva Usuario',
      info = { Email: newUser.id };


   await send(templateFile, toEmail, subject, info);
}

module.exports =  sendEmail  
