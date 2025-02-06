import { Router } from "express";
import {
  followController,

} from "../controllers/user.controllers";
import { followValidator, AccessTokenValidator, verifiedUserValidator } from "../middlewares/users.middlewares";
import { wrapAsync } from '../utils/handler'
const usersRouter = Router()




/**
 * Description: follow someone
 * Path: /follow
 * method: post
 * body: {user_id: string}
 * Header: {followed_user_id: string}
 */
usersRouter.post('/follow', AccessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(followController))



export default usersRouter
