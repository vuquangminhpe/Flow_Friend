import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { FollowReqBody, TokenPayload, RefreshTokenReqBody, VerifyEmailReqBody, ForgotPasswordReqBody } from "../models/request/User.request";
import { config } from "dotenv";
import { envConfig } from "../constants/config";
import usersService from "../services/users.services";
import databaseService from '~/services/database.services'
import { USERS_MESSAGES } from "../constants/messages";
import HTTP_STATUS from '~/constants/httpStatus'
import { WithId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'

config();


export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { user_id, verify } = req.decoded_refresh_token as TokenPayload
  const { refresh_token } = req.body
  const result = await usersService.refreshToken(user_id, verify, refresh_token)
  res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result: result
  })
}
export const emailVerifyController = async (req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  // đã verify rồi thì sẽ ko báo lỗi => return 200 luôn + msg: verify trước đó rồi
  if ((user as WithId<User>).email_verify_token === '') {
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  const result = await usersService.verifyEmail(user_id)
  res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}
export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user?.verify === UserVerifyStatus.Verified) {
    res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await usersService.resendVerifyEmail(user_id)
  res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  const { _id, verify } = req.user as User
  const user = await databaseService.users.findOne({ _id: new ObjectId(_id) })

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  const result = await usersService.forgotPassword({
    user_id: new ObjectId(_id).toString(),
    verify: verify
  })
  res.json(result)
}
export const VerifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response
) => {
  res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decode_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(new ObjectId(user_id).toString(), password)
  res.json({ message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS, result })
}

export const followController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await usersService.follow(user_id, followed_user_id)
  res.json(result)
}

export const unFollowController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await usersService.unFollow(user_id, followed_user_id)
  res.json(result)
}
 
export const getFollowingController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await usersService.getFollowing(user_id)
  res.json({
    message: USERS_MESSAGES.GET_FOLLOWING_SUCCESSFULLY,
    result: result
  })
}

export const getFollowersController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await usersService.getFollowers(user_id)
  res.json({
    message: USERS_MESSAGES.GET_FOLLOWERS_SUCCESSFULLY,
    result: result
  })
}