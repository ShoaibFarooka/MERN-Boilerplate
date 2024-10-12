import transporter from '../configs/nodemailer.config';

const sendEmail = async (to: string, subject: string, text?: string, html?: string): Promise<void> => {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            ...(text ? { text } : {}),
            ...(html ? { html } : {}),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
    } catch (error) {
        console.error('Error sending email: ', error);
        const newError = new Error('Unable to send email!');
        (newError as any).code = 500; // Type assertion to add custom property
        throw newError;
    }
};

export { sendEmail };
