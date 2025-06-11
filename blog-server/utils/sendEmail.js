// src/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports (like 587)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            // <--- ADD THIS BLOCK
            rejectUnauthorized: false // <--- THIS LINE IGNORES CERTIFICATE VALIDATION
        } // <--- END OF ADDED BLOCK
    });

    // 2. Define email options
    const mailOptions = {
        from: `MyBlog Admin <${process.env.EMAIL_USER}>`, // Sender address
        to: options.email, // List of receivers
        subject: options.subject, // Subject line
        html: options.message, // HTML body content
        // You can also add text: options.message for plain text fallback
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;