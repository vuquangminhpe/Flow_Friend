import { hashPassword } from '../utils/crypto'
import Follower from '../models/schemas/Follower.schema'
import axios from 'axios'
import { config } from 'dotenv'
import { envConfig } from '../constants/config'
import { ObjectId } from 'bson'
import { USERS_MESSAGES } from '../constants/messages'
import databaseService from './database.services'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { verifyEmail as sendVerifyEmail, verifyEmail, verifyForgotPassword } from '~/utils/sendmail'

config()

class UserService {

  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        user_type: TokenType.AccessToken,
        verify
      },
      privateKey: envConfig.privateKey_access_token as string,
      optional: {
        expiresIn: envConfig.expiresIn_access_token
      }
    })
  }

  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        user_type: TokenType.RefreshToken,
        verify
      },
      privateKey: envConfig.privateKey_refresh_token as string,

      optional: {
        expiresIn: envConfig.expiresIn_refresh_token
      }
    })
  }

  async refreshToken(user_id: string, verify: UserVerifyStatus, refresh_token: string) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify }),
      databaseService.refreshToken.deleteOne({
        token: refresh_token
      })
    ])
    await databaseService.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: new_refresh_token })
    )
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async follow(user_id: string, followed_user_id: string) {
    const user_follower = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })

    if (user_follower) {
      return {
        message: USERS_MESSAGES.CANNOT_FOLLOW_DUPLICATES
      }
    }
    await databaseService.followers.insertOne(
      new Follower({ user_id: new ObjectId(user_id), followed_user_id: new ObjectId(followed_user_id) })
    )
    return {
      message: USERS_MESSAGES.FOLLOWER_SUCCESS
    }
  }

  async unFollow(user_id: string, followed_user_id: string) {
    const user_follower = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (!user_follower) {
      return {
        message: USERS_MESSAGES.NO_FOLLOW_USER
      }
    }
    await databaseService.followers.deleteOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    return {
      message: USERS_MESSAGES.UN_FOLLOWER_SUCCESS

    }
  }

  async getFollowing(user_id: string) {
    const result = await databaseService.followers.find({ user_id: new ObjectId(user_id) }).toArray()

    return result
  }

  async getFollowers(user_id: string) {
    const result = await databaseService.followers.find({ followed_user_id: new ObjectId(user_id) }).toArray()

    return result
  }

  async verifyEmail(user_id: string) {
    //cật nhật giá trị có thể dùng $$NOW => ném vào [] mới sử dụng được hoặc $curentDate
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: '',
          verify: UserVerifyStatus.Verified
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify: UserVerifyStatus.Verified
    })
    return {
      access_token,
      refresh_token
    }
  }
  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })

    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    }
  }

  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.forgotPasswordToken({ user_id, verify: verify })
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    verifyForgotPassword(user?.email as string, forgot_password_token)
    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }

}

const usersService = new UserService()
export default usersService
