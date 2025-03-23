const path = require('path');
const User = require(path.resolve(__dirname, '../Model/User.js'));
const generateOtp = require(path.resolve(__dirname, '../Utils/otp.js'));
const GeneratingOtp = require(path.resolve(__dirname, '../Model/GeneratingOtp.js'));
const sendEmail = require(path.resolve(__dirname, '../Utils/email.js'));
const bcrypt = require('bcrypt');

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + 300000); // 5 min

        await GeneratingOtp.deleteMany({ email });

        const newOtp = new GeneratingOtp({ email, otp: otpCode, expiresAt });
        await newOtp.save();

        await sendEmail(email, "Reset Password OTP", `Your OTP is ${otpCode}`);

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpDoc = await GeneratingOtp.findOne({ email, otp });

        if (!otpDoc) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (otpDoc.expiresAt < new Date()) {
            await GeneratingOtp.deleteMany({ email });
            return res.status(400).json({ message: 'OTP expired' });
        }

        await GeneratingOtp.deleteMany({ email });

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
