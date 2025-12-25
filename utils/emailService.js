const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async(to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Bookstore" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

const sendWelcomeEmail = async(user) => {
    const html = `
    <h1>Welcome to Bookstore!</h1>
    <p>Hello ${user.name},</p>
    <p>Thank you for registering with us.</p>
    <p>Happy reading!</p>
  `;

    return await sendEmail(user.email, "Welcome to Bookstore", html);
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
};