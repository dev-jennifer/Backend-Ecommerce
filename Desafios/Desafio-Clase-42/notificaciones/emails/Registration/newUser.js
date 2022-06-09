const send = require('../../config/configEmail');
 
async function sendEmail(newUser) {
 
    const templateFile = 'templateRegistration',
      toEmail = newUser.email,
      subject = 'Nueva Usuario',

      info = {name:newUser.name};

      console.log("INFO", info);

   return await send(templateFile,  subject, info);
}

module.exports =  sendEmail  
