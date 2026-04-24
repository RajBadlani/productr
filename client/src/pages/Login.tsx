/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { sendOtp, verifyOtp, resendOtp } from "../api/auth";

const STEPS = {
  IDENTIFIER: "identifier",
  OTP: "otp",
} as const;

type Step = (typeof STEPS)[keyof typeof STEPS];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response as { data?: { message?: string } }
    return response.data?.message || fallback
  }

  return fallback
}

export default function Login() {
  const [step, setStep] = useState<Step>(STEPS.IDENTIFIER);
  const [identifier, setIdentifier] = useState<string>("");
  const [identifierError, setIdentifierError] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/home");
  }, [navigate]);

  const validateIdentifier = (value: string): string => {
    if (!value.trim()) return "This field is required";
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isPhone = /^[6-9]\d{9}$/.test(value);
    if (!isEmail && !isPhone) {
      return "Enter a valid email or 10 digit phone number";
    }
    return "";
  };

  function handleIdentifierBlur(): void {
    setIdentifierError(validateIdentifier(identifier));
  }

  useEffect(() => {
    if (step !== STEPS.OTP) return;

    setResendTimer(30);
    setCanResend(false);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  function handleOtpChange(index: number, value: string): void {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setOtpError("");
    setServerError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    setServerError("");

    if (step === STEPS.IDENTIFIER) {
      const error = validateIdentifier(identifier);
      if (error) {
        setIdentifierError(error);
        return;
      }

      setLoading(true);
      try {
        await sendOtp(identifier);
        setStep(STEPS.OTP);
      } catch (error) {
        setServerError(getErrorMessage(error, "Something went wrong"));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === STEPS.OTP) {
      const code = otp.join("");
      if (code.length < 6) {
        setOtpError("Enter all 6 digits");
        return;
      }

      setLoading(true);
      try {
        const data = await verifyOtp(identifier, code);
        localStorage.setItem("token", data.token);
        navigate("/home");
      } catch (error) {
        setOtpError(getErrorMessage(error, "Invalid or expired OTP"));
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleResend(): Promise<void> {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setServerError("");
    setLoading(true);

    try {
      await resendOtp(identifier);
      setStep(STEPS.OTP);
    } catch (error) {
      setServerError(getErrorMessage(error, "Failed to resend OTP"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen w-screen bg-white">
      {/* LEFT IMAGE SECTION */}
      <section className="hidden h-full px-[33px] py-[32px] md:block">
        <img src="/assets/left-panel.png" alt="left-panel" className="h-full" />
      </section>

      {/* RIGHT LOGIN SECTION */}
      <section className="relative flex h-full w-full justify-center bg-white/90 px-6 pt-[120px] md:w-[725px] md:px-[120px] md:pt-[170px]">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[380px] flex-col items-start text-[#111364]"
        >
          {step === STEPS.IDENTIFIER && (
            <>
              <h2 className="text-2xl font-semibold">
                Login to your Productr Account
              </h2>

              <label
                htmlFor="login-identifier"
                className="mt-[58px] text-sm font-medium text-black"
              >
                Email or Phone number
              </label>

              <Input
                id="login-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="Enter email or phone number"
                value={identifier}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setIdentifier(e.target.value);
                  setIdentifierError("");
                  setServerError("");
                }}
                onBlur={handleIdentifierBlur}
                className="mt-2"
              />
              {identifierError && (
                <p className="mt-1 text-xs text-red-500">{identifierError}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-6"
              >
                {loading ? "Please wait..." : "Login"}
              </Button>
            </>
          )}

          {step === STEPS.OTP && (
            <>
              <h2 className="text-2xl font-semibold">Verify your account</h2>

              <p className="mt-3 text-sm text-[#98A2B3]">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-[#111652]">{identifier}</span>
              </p>

              <div className="mt-10 flex w-full gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleOtpChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="h-12 w-full rounded-lg border border-[#D4D4D4] text-center text-lg font-semibold text-[#111652] outline-none focus:border-[#071074]"
                  />
                ))}
              </div>
              {otpError && (
                <p className="mt-2 text-xs text-red-500">{otpError}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-6"
              >
                {loading ? "Please wait..." : "Verify OTP"}
              </Button>

              <div className="mt-4 flex w-full items-center justify-center gap-1">
                <p className="text-sm text-[#98A2B3]">
                  Didn&apos;t receive the code?
                </p>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm font-medium text-[#071074]"
                    disabled={loading}
                  >
                    Resend
                  </button>
                ) : (
                  <p className="text-sm font-medium text-[#98A2B3]">
                    Resend in {resendTimer}s
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(STEPS.IDENTIFIER);
                  setOtp(["", "", "", "", "", ""]);
                  setOtpError("");
                  setServerError("");
                }}
                className="mt-3 w-full text-center text-sm text-[#98A2B3] underline"
              >
                Change email / phone
              </button>
            </>
          )}

          {serverError && (
            <p className="mt-2 w-full text-center text-xs text-red-500">
              {serverError}
            </p>
          )}
        </form>

        {/* SIGNUP BOX */}
        <section className="absolute bottom-[60px] left-1/2 flex w-[245px] -translate-x-1/2 flex-col items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white py-[14px] md:bottom-[110px]">
          <p className="text-[12px] leading-[18px] text-[#98A2B3]">
            Don&apos;t have a Productr Account
          </p>
          <Link
            to="/signup"
            className="mt-[2px] text-[12px] font-medium leading-[18px] text-[#071074] no-underline"
          >
            SignUp Here
          </Link>
        </section>
      </section>
    </main>
  );
}
