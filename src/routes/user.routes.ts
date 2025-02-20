import { Router } from "express";
import {
  followController,
  emailVerifyController,
  forgotPasswordController,
  resendVerifyEmailController,
  resetPasswordController,
  VerifyForgotPasswordController,
  refreshTokenController

} from "../controllers/user.controllers";
import {
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  RefreshTokenValidator,
  followValidator,
  AccessTokenValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from "../middlewares/users.middlewares";
import { wrapAsync } from '../utils/handler'
const usersRouter = Router()



/**
 * Description: refresh token
 * Path: /refresh-token
 * method: POST
 * Header: {refresh_token: string}
 */
usersRouter.post('/refresh-token', RefreshTokenValidator, wrapAsync(refreshTokenController))

usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))
usersRouter.post('/resend-verify-email', AccessTokenValidator, wrapAsync(resendVerifyEmailController))
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(VerifyForgotPasswordController)
)

usersRouter.post('/reset-password', resetPasswordValidator, wrapAsync(resetPasswordController))



/**
 * Description: follow someone
 * Path: /follow
 * method: post
 * body: {user_id: string}
 * Header: {followed_user_id: string}
 */
usersRouter.post('/follow', AccessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(followController))



export default usersRouter
