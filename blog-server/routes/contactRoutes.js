const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' }); // Adjust path to your .env file

const router = express.Router();

// @desc    Send contact form email
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // 1. Basic Validation (add more as needed)
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // 2. Create a Nodemailer transporter
    let transporter;

    // --- Using Gmail (for simplicity, but consider dedicated services for production) ---
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    // --- Using SendGrid (recommended for production) ---
    // else if (process.env.SENDGRID_API_KEY) {
    //     transporter = nodemailer.createTransport({
    //         host: 'smtp.sendgrid.net',
    //         port: 587,
    //         secure: false, // true for 465, false for other ports
    //         auth: {
    //             user: 'apikey', // This is literally 'apikey' for SendGrid
    //             pass: process.env.SENDGRID_API_KEY,
    //         },
    //     });
    // }
    // --- Add other services as needed ---
    else {
        console.error('Email transporter not configured. Check EMAIL_USER/EMAIL_PASS or SENDGRID_API_KEY in .env');
        return res.status(500).json({ msg: 'Server email configuration error.' });
    }

    // 3. Define email options
    const mailOptions = {
        from: `"${name}" <${email}>`, // Sender's name and email from the form
        to: 'your_receiving_email@example.com', // Replace with YOUR email where you want to receive messages
        subject: `MyBlog Contact: ${subject}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    };

    // 4. Send the email
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ msg: 'Error sending message.', error: error.message });
    }
});

module.exports = router;