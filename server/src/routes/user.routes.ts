import { Router } from "express";
import {
  followController,
  unFollowController,
  getFollowersController,
  getFollowingController

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

/**
 * Description: un follow someone
 * Path: /un_follow
 * method: delete
 * body: {user_id: string}
 * Header: {followed_user_id: string}
 */
usersRouter.delete('/un-follow', AccessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(unFollowController))


/**
 * Description: get followers
 * Path: /followers
 * method: get
 * body: {user_id: string}
 */
usersRouter.get('/followers', AccessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(getFollowersController))

/**
 * Description: get following
 * Path: /following
 * method: get
 * body: {user_id: string}
 */
usersRouter.get('/following', AccessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(getFollowingController))


export default usersRouter
