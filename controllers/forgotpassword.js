// const bcrypt = require('bcryptjs');
const { queryAsync } = require('../routes/db-config');
const emailService = require('./emailService'); // Assuming you have an email service set up
const otpGenerator = require('otp-generator');

const generateResetToken = () => {
    // Implement the logic to generate a reset token
    // This function can be similar to the one in your main controller
    return otpGenerator.generate(18, { digits: true, alphabets: true, upperCase: true, specialChars: false });
};

exports.showForgotPasswordForm = (req, res) => {
    res.render('forgot-password', { message: null });
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email exists in the database
        const user = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
        
        if (user.length === 0) {
            return res.render('forgot-password', { message: 'User with this email does not exist' });
        }

        // Generate a reset token
        const resetToken = generateResetToken();

        // Store the reset token in the database along with the user's email and expiration time
        await queryAsync('UPDATE users SET reset_token = ?, reset_token_expires = NOW() + INTERVAL 1 HOUR WHERE email = ?', [resetToken, email]);

        // Send reset email
        const resetLink = `${process.env.BASE_URL}/auth/reset-password/${resetToken}`;
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: `<h2 style="color:blue;">Password Reset</h2>
            <p>Dear,<strong>${user[0].username}</strong></p>
            <p>Please click the following link to rest password your email:<a href="${resetLink}"> Click here</a></p>       
            <p>If you did not request this verification, you can ignore this email.</p>
            <p>Thank you!</p>`,
        };

        await emailService.sendMail(mailOptions);
        return res.render('forgot-password', { message: 'Reset email sent. Check your inbox.' });
    } catch (error) {
        console.error('Error sending reset email:', error);
        return res.render('forgot-password', { message: 'Error sending reset email. Please try again later.' });
    }
};

exports.validateToken = async (req, res) => {
    const { token } = req.params;

    try {
        // Check if the reset token is valid
        const result = await queryAsync(`
            SELECT * FROM users 
            WHERE reset_token = ? 
              AND reset_token_expires < CONVERT_TZ(NOW(), '+00:00', '+05:30')
        `, [token]);

        if (result.length === 0) {
            console.log(result.length);
            console.log(token);
            return res.render('reset-password', { token, message: 'Invalid or expired token. Please try again.' });
        }

        // Render the page with the reset password form
        return res.render('reset-password', { token, message: null });
    } catch (error) {
        console.error('Error validating reset token:', error);
        return res.render('reset-password', { token, message: 'Error validating reset token. Please try again later.' });
    }
};
