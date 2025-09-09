const nodemailer = require("nodemailer");

async function sendEmail(options, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: `"AMSOM CONSTRUCTABILITY" <${process.env.EMAIL_USER}>`,
    subject,
    html,
  };


  if (typeof options === 'object') {
    mailOptions.to = options.to;
    if (options.bcc) {
      mailOptions.bcc = options.bcc;
    }
  } else {
    mailOptions.to = options;
  }

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
