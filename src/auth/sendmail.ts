import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config(); 

export const sendMail = async(email,otp) => {
    console.log(email,otp);
try {
  let transporter = nodemailer.createTransport({
     service: 'gmail',
    auth: {
      user: process.env.email, // generated ethereal user
      pass: process.env.password, // generated ethereal password
    },
  });
  
  var mailOptions = {
    from: process.env.email,
    to: email,
    subject: 'its a verification otp',
    text:otp
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error.message);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

} catch (error) {
    console.log(error);
    
}
}
