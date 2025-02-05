import { MediaTypeQuery } from './enums'

export const USERS_MESSAGES = {


    // reset-password, verify-email, resend-verify-email,forgot-password
    EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
    EMAIL_VERIFY_SUCCESS: 'Email verify success',
    RESEND_VERIFY_EMAIL_SUCCESS: 'Resent email verify success',
    CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
    FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
    VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
    FORGOT_PASSWORD_TOKEN_INVALID: 'Forgot password token invalid',
    RESET_PASSWORD_SUCCESS: 'Reset password success',
} as const