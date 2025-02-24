import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '../../constants/enums'

export interface FollowReqBody {
  followed_user_id: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
}
export interface RefreshTokenReqBody {
  refresh_token: string
}
export interface UserReq {
  email: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}
export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}