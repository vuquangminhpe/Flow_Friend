import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import {
  FollowReqBody,
  ForgotPasswordReqBody,
  ResetPasswordReqBody,
  VerifyEmailReqBody,
  VerifyForgotPasswordReqBody,
  TokenPayload
} from "../models/request/User.request";
import { config } from "dotenv";
import { envConfig } from "../constants/config";
import usersService from "../services/users.services";
import { USERS_MESSAGES } from "../constants/messages";
import databaseService from '~/services/database.services'
import HTTP_STATUS from '~/constants/httpStatus'
import { ObjectId } from 'bson'
import { WithId } from "mongodb";
import User from "~/models/schemas/User.schema";

config();


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

export const followController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await usersService.follow(user_id, followed_user_id)
  res.json(result)
}



