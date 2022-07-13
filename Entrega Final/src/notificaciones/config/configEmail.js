const nodemailer = require('nodemailer');
const request = require('request');
const CONFIG = require('../../utils/config');

function send(templateFile,  subject, info) {
  console.log('DATA', info);
  let options = {
    uri: `http://localhost:8080/template/email/${templateFile}`,
    method: 'POST',
    json: info
  };
  request(options, async function (error, response, body) {
    if (error) console.log(error);
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: CONFIG.EMAIL.TEST_EMAIL,
        pass: CONFIG.EMAIL.PASS_EMAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    let mailOptions = {
      from: 'Admin <noreply@admin.com>',
      to: CONFIG.EMAIL.ADMIN_EMAIL,
      subject: subject,
      html: body,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) console.log(error);
      console.log('info', info);
    });
  });
}

module.exports = send;
