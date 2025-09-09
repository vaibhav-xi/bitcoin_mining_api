const express = require('express');
const {
  register,
  login,
  socialLogin,
  getMe,
  forgotPassword,
  resetPassword,
  updatePasswordDirect,
  logout,
  verifyEmail,
  verifyEmailOTP,
  resendEmailVerification
} = require('../controllers/authController');

const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get("/referrals", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        message: "Referral code is required",
      });
    }

    // Case-insensitive search
    const count = await User.countDocuments({
      referralUsed: { $regex: `^${code}$`, $options: "i" },
    });

    res.json({
      success: true,
      referralCode: code,
      count,
    });
  } catch (error) {
    console.error("Fetching error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user referrals",
    });
  }
});

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/social-login', socialLogin);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/update-password-direct', updatePasswordDirect); // For testing purposes
router.get('/verify-email/:token', verifyEmail);
router.get('/verify-email-otp/:otp/:email', verifyEmailOTP);
router.post('/resend-verification', resendEmailVerification);

// Protected routes
router.get('/me', auth, getMe);
router.get('/logout', auth, logout);

module.exports = router;
