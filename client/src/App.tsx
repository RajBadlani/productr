import { Link } from "react-router-dom";

const backendSummary = [
  "The server runs with Express and exposes API routes under /api.",
  "MongoDB is connected with Mongoose and stores users and products.",
  "Users login with email or phone number using a 6 digit OTP.",
  "OTP values are hashed before saving and expire after 10 minutes.",
  "After OTP verification, the server creates a JWT token for the user.",
  "Product routes are protected, so every product belongs to the logged in user.",
  "The backend supports creating, reading, updating, deleting, publishing, and unpublishing products.",
  "Product images are uploaded through Cloudinary using Multer storage.",
  "Product create and edit can receive product fields and images in one request.",
];

const frontendSummary = [
  "The client is built with React, TypeScript, Vite, and Tailwind CSS.",
  "React Router handles the public page, login page, home page, and products page.",
  "The login page validates email or phone number before sending OTP.",
  "The OTP screen supports six digit input, resend timer, and verification.",
  "The JWT token is saved in localStorage and used for protected API calls.",
  "Protected routes block dashboard access when the user is not logged in.",
  "The dashboard has a sidebar, topbar, home section, and products section.",
  "Products can be added, edited, deleted, published, and unpublished from the UI.",
  "The product form validates required fields, prices, stock, category, and images.",
];

function SummaryCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[28px] border border-[#E6EAF5] bg-white p-6 shadow-[0_24px_80px_rgba(20,31,72,0.08)] md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-[#2B33F6]" />
        <h2 className="m-0 text-[22px] font-semibold tracking-[-0.02em] text-[#111652]">
          {title}
        </h2>
      </div>

      <ul className="m-0 space-y-3 p-0">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 rounded-2xl bg-[#F7F9FF] px-4 py-3 text-[14px] leading-6 text-[#475467]"
          >
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#98A2B3]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function App() {
  return (
    <main className="min-h-screen bg-[#F4F6FB] px-5 py-8 text-[#111652] md:px-10 md:py-12">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-white bg-white/70 shadow-[0_30px_120px_rgba(17,22,82,0.12)]">
        <section className="relative overflow-hidden bg-[#111652] px-6 py-12 text-white md:px-12 md:py-16">
          <div className="absolute right-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-[#FFDF5D]/30 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[-80px] h-[260px] w-[260px] rounded-full bg-[#2B33F6]/40 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-medium text-white/80">
              Productr created by Raj
            </p>
            <h1 className="m-0 text-[42px] font-semibold leading-[1.05] tracking-tighter md:text-[72px]">
              Productr backend and frontend overview
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-7 text-white/72 md:text-[18px]">
              A simple technical summary of what the current Productr app does,
              how the backend works, and what the frontend includes.
            </p>

            <Link
              to="/login"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-[#111652] shadow-[0_14px_36px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#FFF8B7]"
            >
              Test Now
            </Link>
            <p className="mt-4 text-[14px] text-[#9CA3AF]">
              Note: SMS OTP requires DLT registration. Use email for OTP during evaluation.
            </p>
          </div>
        </section>

        <section className="grid gap-6 px-5 py-6 md:grid-cols-2 md:px-8 md:py-8">
          <SummaryCard title="Backend Summary" items={backendSummary} />
          <SummaryCard title="Frontend Summary" items={frontendSummary} />
        </section>
      </section>
    </main>
  );
}

export default App;
