import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function hashOTP(otp) {
  return await bcrypt.hash(otp, 10)
}

export async function verifyOTP(otp, hashedOTP) {
  return await bcrypt.compare(otp, hashedOTP)
}

export async function sendEmailOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Productr" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Productr OTP',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  })
}

// export async function sendPhoneOTP(phone, otp) {
//   const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
//     method: 'POST',
//     headers: {
//       authorization: process.env.FAST2SMS_API_KEY,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       route: 'q',
//       message: `Your Productr OTP is ${otp}. Valid for 10 minutes.`,
//       language: 'english',
//       numbers: phone,
//     }),
//   })

//   const data = await response.json()
//   if (!data.return) throw new Error('Failed to send SMS OTP')
// }

export async function sendPhoneOTP(phone, otp) {
  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      authorization: process.env.FAST2SMS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      route: 'q',
      message: `Your Productr OTP is ${otp}. Valid for 10 minutes.`,
      language: 'english',
      numbers: phone,
    }),
  })

  const data = await response.json()
  if (!data.return) throw new Error('Failed to send SMS OTP')
}