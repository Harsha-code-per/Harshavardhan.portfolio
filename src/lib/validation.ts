export interface ContactInput {
  name: string;
  email: string;
  message: string;
  botField?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateContactInput(input: ContactInput): ValidationResult {
  // 1. Honeypot check (Spam bot protection)
  if (input.botField && input.botField.trim().length > 0) {
    return { isValid: false, error: "Transmission blocked by spam filter rules." };
  }

  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  // 2. Presence checks
  if (!name || !email || !message) {
    return { isValid: false, error: "All telemetry fields (name, email, message) are required." };
  }

  // 3. Length checks (Security and memory limit protection)
  if (name.length > 100) {
    return { isValid: false, error: "Name must be under 100 characters." };
  }
  if (email.length > 256) {
    return { isValid: false, error: "Email must be under 256 characters." };
  }
  if (message.length > 5000) {
    return { isValid: false, error: "Message payload must be under 5000 characters." };
  }

  // 4. Email format check (RFC 5322 compliant regex)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email routing format." };
  }

  return { isValid: true };
}
