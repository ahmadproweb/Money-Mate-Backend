const User = require("../models/User");
const generateCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");
const checkLimit = require("../utils/limitCheck");
const bcrypt = require("bcryptjs");

const OTPTemplate = require("../utils/OTPTemplate");

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (!existingUser.isVerified) {
      const { allowed, remaining } = checkLimit(existingUser, "forgotPasswordAttempts");
      if (!allowed) {
        return res.status(429).json({
          message: "Verification code limit reached. Try again tomorrow."
        });
      }

      const code = generateCode();
      existingUser.verificationCode = code;
      existingUser.codeExpires = new Date(Date.now() + 10 * 60 * 1000);
      await existingUser.save();

      const html = OTPTemplate(email, code, "Verify your Email");
      await sendEmail(email, "Verify your Email", html);

      return res.status(200).json({
        message: `You already signed up but haven't verified your email. A new code has been sent. Attempts left: ${remaining}`
      });
    }

    return res.status(400).json({ message: "Email is already in use." });
  }

  const code = generateCode();
  const hash = await bcrypt.hash(password, 10);
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  const tempUser = new User({
    email,
    password: hash,
    verificationCode: code,
    codeExpires: expires,
    isVerified: false,
  });

  await tempUser.save();

  const html = OTPTemplate(email, code, "Verify your Email");
  await sendEmail(email, "Verify your Email", html);

  res.status(200).json({
    message: "Verification email sent. Please check your inbox."
  });
};


exports.verify = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "No such user" });
  if (user.isVerified) return res.status(400).json({ message: "Already verified" });
  if (user.verificationCode !== code || user.codeExpires < new Date())
    return res.status(400).json({ message: "Code invalid or expired" });

  user.isVerified = true;
  user.verificationCode = undefined;
  user.codeExpires = undefined;
  await user.save();

  const token = generateToken(user._id);
  res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ message: "Verified & logged in", token });
};

exports.login = async (req, res) => {
  console.log("api hit", req.body)
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Invalid email or password" });

  if (!user.isVerified) {
    const { allowed, remaining } = checkLimit(user, "forgotPasswordAttempts");

    if (!allowed) {
      return res.status(429).json({ message: "Verification code limit reached. Try again tomorrow." });
    }

    const code = generateCode();
    user.verificationCode = code;
    user.codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    const html = OTPTemplate(user.email, code, "Verify Your Email");

    await sendEmail(
      user.email,
      "Verify your email",
      html 
    );

    await user.save();

    return res.status(403).json({
      message: `Email not verified. A new code has been sent. Attempts left: ${remaining}`
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

  const token = generateToken(user._id);
  res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.json({ message: "Logged in", token });
};


exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified) return res.status(400).json({ message: "Email already verified go to login page" });

  const { allowed, remaining } = checkLimit(user, "forgotPasswordAttempts");
  if (!allowed) {
    return res.status(429).json({ message: "OTP resend limit reached. Try again tomorrow." });
  }

  const code = generateCode();
  user.verificationCode = code;
  user.codeExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const html = OTPTemplate(email, code, "Verify your Email");
  await sendEmail(email, "Verify your Email", html);

  res.status(200).json({
    message: `A new verification code has been sent. Attempts left: ${remaining}`
  });
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Email not found" });

  if (!user.isVerified) {
    const { allowed, remaining } = checkLimit(user, "forgotPasswordAttempts");

    if (!allowed) {
      return res.status(429).json({ message: "Verification code limit reached. Try again tomorrow." });
    }

    const code = generateCode();
    user.verificationCode = code;
    user.codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    const html = OTPTemplate(user.email, code, "Verify Your Email");

    await sendEmail(user.email, "Verify your email", html);
    await user.save();

    return res.status(403).json({
      message: `Please verify your email first. A new code has been sent. Attempts left: ${remaining}`
    });
  }

  const { allowed, remaining } = checkLimit(user, "forgotPasswordAttempts");
  if (!allowed) {
    return res.status(429).json({ message: `Forgot password limit reached. Try tomorrow.` });
  }

  const code = generateCode();
  user.verificationCode = code;
  user.codeExpires = new Date(Date.now() + 10 * 60 * 1000);

  const html = OTPTemplate(user.email, code, "Reset Your Password");

  await sendEmail(email, "Reset your password", html);
  await user.save();

  res.json({ message: `Reset code sent. You have ${remaining} attempts left today.` });
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid" });

  const { allowed, remaining } = checkLimit(user, 'resetPasswordAttempts');
  if (!allowed) return res.status(429).json({ message: `Reset limit reached. Try again tomorrow.` });

  if (user.verificationCode !== code || user.codeExpires < new Date())
    return res.status(400).json({ message: "Code invalid or expired" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.verificationCode = undefined;
  user.codeExpires = undefined;
  await user.save();

  res.json({ message: `Password reset successful. ${remaining} resets remaining today.` });
};
