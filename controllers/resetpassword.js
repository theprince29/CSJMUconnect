// reset password 


const bcrypt = require('bcryptjs');
const { queryAsync } = require('../routes/db-config');

exports.updateNewPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Validate the token again before updating the password
        const result = await queryAsync('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()', [token]);

        if (result.length === 0) {
            return res.render('reset-password', { token, message: 'Invalid or expired token. Please try again.' });
        }

        const userId = result[0].id;
        const hashedPassword = await bcrypt.hash(newPassword, 8);

        // Update the user's password and clear the reset token
        await queryAsync('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [hashedPassword, userId]);

        return res.render('reset-successfull', { message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.render('reset-failed', { token, message: 'Error updating password. Please try again later.' });
    }
};
