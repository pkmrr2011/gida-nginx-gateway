/**
 * Generates a random 4-digit OTP.
 * @returns The generated OTP.
 */
export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}
