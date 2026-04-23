import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import {
  generateOTP,
  hashOTP,
  verifyOTP,
  sendEmailOTP,
  sendPhoneOTP,
} from '../config/otp.js'

function detectIdentifierType(identifier) {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
  return isEmail ? 'email' : 'phone'
}

export async function sendOtp(req, res) {
  try {
    const { identifier } = req.body
    if (!identifier) return res.status(400).json({ message: 'Identifier is required' })

    const identifierType = detectIdentifierType(identifier)
    const otp = generateOTP()
    const hashedOtp = await hashOTP(otp)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // create user if not exists, update OTP if exists
    await User.findOneAndUpdate(
      { identifier },
      { identifier, identifierType, otp: hashedOtp, otpExpiry, isVerified: false },
      { upsert: true, new: true }
    )

    if (identifierType === 'email') {
      await sendEmailOTP(identifier, otp)
    } else {
      await sendPhoneOTP(identifier, otp)
    }

    res.status(200).json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error('sendOtp error:', error.message)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
}

export async function verifyOtp(req, res) {
  try {
    const { identifier, otp } = req.body
    if (!identifier || !otp) return res.status(400).json({ message: 'All fields are required' })

    const user = await User.findOne({ identifier })
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP has expired' })

    const isValid = await verifyOTP(otp, user.otp)
    if (!isValid) return res.status(400).json({ message: 'Invalid OTP' })

    // clear OTP after successful verification
    user.otp = null
    user.otpExpiry = null
    user.isVerified = true
    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, identifier, identifierType: user.identifierType } })
  } catch (error) {
    console.error('verifyOtp error:', error.message)
    res.status(500).json({ message: 'Failed to verify OTP' })
  }
}

export async function resendOtp(req, res) {
  try {
    const { identifier } = req.body
    if (!identifier) return res.status(400).json({ message: 'Identifier is required' })

    const user = await User.findOne({ identifier })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const otp = generateOTP()
    const hashedOtp = await hashOTP(otp)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = hashedOtp
    user.otpExpiry = otpExpiry
    await user.save()

    if (user.identifierType === 'email') {
      await sendEmailOTP(identifier, otp)
    } else {
      await sendPhoneOTP(identifier, otp)
    }

    res.status(200).json({ message: 'OTP resent successfully' })
  } catch (error) {
    console.error('resendOtp error:', error.message)
    res.status(500).json({ message: 'Failed to resend OTP' })
  }
}