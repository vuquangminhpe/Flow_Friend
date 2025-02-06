import { checkSchema, ParamSchema } from "express-validator";
import { USERS_MESSAGES } from "../constants/messages";
import { validate } from "../utils/validation";
import { ObjectId } from "bson";
import { ErrorWithStatus } from "../models/Errors";
import HTTP_STATUS from "../constants/httpStatus";
import databaseService from "../services/database.services";
import { NextFunction, RequestHandler } from "express";
import { TokenPayload } from "../models/request/User.request";
import { UserVerifyStatus } from "../constants/enums";
import  { Request} from'express'
import { verifyAccessToken } from "../utils/common";

export const followValidator = validate(
  checkSchema({
    followed_user_id: {
      custom: {
        options: async (value, { req }) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.INVALID_FOLLOWED_USER_ID,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          const followed_user = await databaseService.users.findOne({
            _id: new ObjectId(value as string)
          })

          if (followed_user === null) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.USER_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
        }
      }
    }
  })
)


export const verifiedUserValidator: RequestHandler = (req: Request, res, next: NextFunction) => {
  const { verify } = (req.decode_authorization as TokenPayload) || {}
  if (verify !== UserVerifyStatus.Verified) {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}


export const AccessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: new ErrorWithStatus({
            message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        },
        custom: {
          options: async (value: string, { req }) => {
            console.log('Authorization Header:', value);
            const access_token = value.split(' ')[1];
            console.log('Extracted Token:', access_token);
            return await verifyAccessToken(access_token, req as Request);
          }
        }
      }
    },
    ['headers']
  )
)