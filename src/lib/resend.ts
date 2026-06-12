import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// Using Resend's shared test domain — swap for a verified domain later (e.g. notifications@bm.com)
export const EMAIL_FROM = 'BM.com <onboarding@resend.dev>'

export function bookingConfirmationEmail(opts: {
  businessName: string
  serviceName: string
  staffName: string
  startTime: string
  cancelUrl: string
  depositPaid?: boolean
  depositCents?: number
}) {
  const when = new Date(opts.startTime).toLocaleString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 32px;">
        <div style="width: 32px; height: 32px; background: #ea580c; border-radius: 8px; display: inline-block;"></div>
        <span style="font-weight: 700; font-size: 16px; color: #1c1917;">${opts.businessName}</span>
      </div>

      <h1 style="font-size: 20px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">Booking confirmed</h1>
      <p style="font-size: 14px; color: #78716c; margin: 0 0 24px;">Here are your appointment details.</p>

      <div style="background: #fafaf9; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.7;">
        <p style="margin: 0;"><span style="color: #a8a29e;">Service:</span> <strong style="color: #1c1917;">${opts.serviceName}</strong></p>
        <p style="margin: 0;"><span style="color: #a8a29e;">With:</span> <strong style="color: #1c1917;">${opts.staffName}</strong></p>
        <p style="margin: 0;"><span style="color: #a8a29e;">When:</span> <strong style="color: #1c1917;">${when}</strong></p>
        ${opts.depositPaid ? `<p style="margin: 0;"><span style="color: #a8a29e;">Deposit paid:</span> <strong style="color: #1c1917;">$${((opts.depositCents ?? 0) / 100).toFixed(2)}</strong></p>` : ''}
      </div>

      <p style="font-size: 13px; color: #a8a29e; margin: 24px 0 0;">
        Need to cancel? <a href="${opts.cancelUrl}" style="color: #ea580c; text-decoration: underline;">Click here</a>
      </p>
    </div>
  `
}
