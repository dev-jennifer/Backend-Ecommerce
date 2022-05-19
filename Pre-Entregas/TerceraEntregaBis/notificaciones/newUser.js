const { createTransport } =require("nodemailer"),
  minimist  =require( "minimist");

const {TEST_EMAIL, PASS_EMAIL} = require("../src/utils/config")
 
  
const transporter = createTransport({
 service: 'gmail',
  host: 'smtp.gmail.com',
    auth: {
        user: TEST_EMAIL,
        pass: PASS_EMAIL
    },
      tls: {
          rejectUnauthorized: false
      }
});


async function sendEmail(newUser) {
let emailContent = {
    from: 'Admin <noreply@admin.com>',
    to: `${newUser}`,
    subject: 'Nuevo Usuario',
    html: '<h3 style="color: blue;">Nuevo usuario registrado</span></h3>'
}


try {
    const info = await transporter.sendMail(emailContent);
    console.log(info);
} catch (error) {
    console.error('Hubo un erro:', error);
}
}

module.exports={sendEmail}