import nodemailer from  'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const sendEmail = async (options) => {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    //Send email with defined transport object
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    const info = await transport.sendMail(message);

    console.log("Message sent: %s", info.messageId)
};

export default sendEmail;