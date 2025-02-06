import {JwtPayload} from 'jsonwebtoken'
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