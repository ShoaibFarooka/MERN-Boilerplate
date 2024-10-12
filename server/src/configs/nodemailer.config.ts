import nodemailer, { Transporter } from 'nodemailer';

// Configure Nodemailer transporter
const transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    auth: {
        user: process.env.SENDER_EMAIL as string,
        pass: process.env.SENDER_EMAIL_PASSWORD as string,
    },
});

export default transporter;
