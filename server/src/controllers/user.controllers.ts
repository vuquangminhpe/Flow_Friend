import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { FollowReqBody, TokenPayload } from "../models/request/User.request";
import { config } from "dotenv";
import { envConfig } from "../constants/config";
import usersService from "../services/users.services";
import { USERS_MESSAGES } from "../constants/messages";

config();

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