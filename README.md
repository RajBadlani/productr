# Productr

Productr is a full-stack product management app with OTP login, protected dashboard routes, product CRUD, publish/unpublish controls, and Cloudinary image uploads.

## Project Structure

- `client/` - React, TypeScript, Vite, Tailwind CSS frontend
- `server/` - Express, MongoDB, Mongoose backend

## Prerequisites

- Node.js installed
- MongoDB connection string
- Cloudinary account for product image uploads
- Gmail app password for email OTP
- Fast2SMS API key for phone OTP

## Frontend Setup

Go to the frontend folder:

```bash
cd client
```

Install dependencies:

```bash
pnpm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
pnpm dev
```

The frontend will run on the Vite dev server, usually:

```text
http://localhost:5173
```

## Backend Setup

Go to the backend folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

FAST2SMS_API_KEY=your_fast2sms_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Run the backend in development mode:

```bash
npm run dev
```

Run the backend in production mode:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

## Required Environment Variables

### Client

- `VITE_API_URL` - Backend API base URL. Example: `http://localhost:5000`

### Server

- `PORT` - Backend server port. Example: `5000`
- `MONGODB_URI` - MongoDB database connection string
- `JWT_SECRET` - Secret key used to sign and verify JWT tokens
- `EMAIL_USER` - Gmail address used to send email OTPs
- `EMAIL_PASS` - Gmail app password used by Nodemailer
- `FAST2SMS_API_KEY` - Fast2SMS authorization key used to send phone OTPs
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Useful Commands

### Frontend

```bash
pnpm dev
pnpm build
pnpm lint
```

### Backend

```bash
npm run dev
npm start
```

## Notes

- Phone OTP requires Fast2SMS OTP API access to be enabled for your account.
- Email OTP requires a Gmail app password, not your normal Gmail password.
- Product image upload requires valid Cloudinary credentials.
- Protected product APIs require a valid JWT token from OTP login.
