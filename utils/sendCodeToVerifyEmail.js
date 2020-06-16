import nodemailer from 'nodemailer';

export default (emailTo, confirmCode) =>
  new Promise(async (resolve, reject) => {
    console.log('qol');
    const emailTransfer = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_MAIL_PW,
      },
    });

    console.log('zol');
    const emailInfo = {
      from: process.env.SENDER_MAIL,
      to: emailTo,
      subject: 'Verify your e-mail address! (NoteAppp)',
      text: `Here is your confirm code: ${confirmCode}`,
    };

    console.log('yol');
    try {
      await emailTransfer.sendMail(emailInfo);
      console.log('pol');
      return resolve('sccs');
    } catch (err) {
      console.log('col')
      return reject(err);
    }
  });
