"use server"

// Server-side admin authentication utilities
export async function validateAdminSecretKey(secretKey: string): Promise<boolean> {
  // In production, this would validate against a secure server-side environment variable
  // For demo purposes, we'll accept any non-empty key or skip validation
  const isDemoMode = process.env.NODE_ENV === "development" || process.env.DEMO_MODE === "true"

  if (isDemoMode) {
    // In demo mode, accept any non-empty key or allow empty for testing
    return true
  }

  // In production, validate against server-side environment variable
  const adminSecret = process.env.ADMIN_SECRET_KEY // Note: No NEXT_PUBLIC_ prefix
  return adminSecret ? secretKey === adminSecret : false
}

export async function createAdminAccount(formData: {
  email: string
  password: string
  fullName: string
  secretKey: string
}) {
  "use server"

  // Validate admin secret key on server side
  const isValidSecret = await validateAdminSecretKey(formData.secretKey)

  if (!isValidSecret && process.env.NODE_ENV === "production") {
    throw new Error("Invalid admin secret key")
  }

  // Return validation result
  return {
    isValid: isValidSecret,
    canProceed: true,
  }
}
