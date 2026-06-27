export interface TransactionOtpPayload {
  email: string
  fullName?: string
  transaction: {
    transferType: string
    amount: number
    currency: string
    recipientName: string
    recipientAccount: string
  }
  forceResend?: boolean
}

export interface OtpVerificationResponse {
  verified: boolean
  message?: string
}

const otpApiEndpoint = import.meta.env.VITE_OTP_API_ENDPOINT ?? '/api/otp/resend'
const otpVerifyEndpoint = import.meta.env.VITE_OTP_VERIFY_ENDPOINT ?? '/api/otp/verify'

async function fetchJson<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = (body && (body.message || body.error)) ?? response.statusText
    throw new Error(message)
  }

  return response.json()
}

export async function requestTransactionOtp(payload: TransactionOtpPayload) {
  if (!import.meta.env.VITE_OTP_API_ENDPOINT) {
    return {
      message: '',
      challengeId: undefined,
    }
  }

  return fetchJson<{ message: string; challengeId?: string }>(otpApiEndpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function verifyTransactionOtp(code: string, challengeId?: string): Promise<OtpVerificationResponse> {
  if (!import.meta.env.VITE_OTP_VERIFY_ENDPOINT) {
    throw new Error('OTP verification endpoint is not configured.')
  }

  return fetchJson<OtpVerificationResponse>(otpVerifyEndpoint, {
    method: 'POST',
    body: JSON.stringify({ code, challengeId }),
  })
}
