
import { Resend } from "resend";
import { ENV } from "./env.js";

/*
  Validate Resend configuration
*/
const hasResendConfig =
  ENV.RESEND_API_KEY &&
  ENV.EMAIL_FROM &&
  ENV.EMAIL_FROM_NAME;

let resendClient;

/*
  If config is missing:
  - In development → use dummy client
  - In production → warn loudly
*/
if (!hasResendConfig) {
  console.warn(
    "⚠️ Resend config missing — email sending disabled"
  );

  // Dummy client (prevents crashes)
  resendClient = {
    emails: {
      send: async () => {
        console.warn(
          "📧 Email skipped (Resend not configured)"
        );
        return { id: "dummy-email-id" };
      },
    },
  };
} else {
  resendClient = new Resend(ENV.RESEND_API_KEY);
}

/*
  Sender info with safe fallbacks
*/
export const sender = {
  email: ENV.EMAIL_FROM || "no-reply@example.com",
  name: ENV.EMAIL_FROM_NAME || "App",
};

export { resendClient };
