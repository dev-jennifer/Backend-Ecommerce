const nodemailer = require('nodemailer');
const request = require('request');
const { TEST_EMAIL, PASS_EMAIL } = require('../../src/utils/config');

function send(templateFile, toEmail, subject, info) {
  let options = {
    uri: `http://localhost:8080/template/email/${templateFile}`,
    method: 'POST',
    json: info,
  };
  request(options, async function (error, response, body) {
    if (error) console.log(error);
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: TEST_EMAIL,
        pass: PASS_EMAIL,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    let mailOptions = {
      from: 'Admin <noreply@admin.com>',
      to: toEmail,
      subject: subject,
      html: body,
    };
   await transporter.sendMail(mailOptions, function (error, info) {
      if (error) console.log(error);
      console.log(info)
    });
  });
}

module.exports = send;
