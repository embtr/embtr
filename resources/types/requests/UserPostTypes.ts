import { UserPost} from "../../schema";
import { Response } from "./RequestTypes";

export interface CreateUserPostRequest {
  userPost: UserPost
}

export interface CreateUserPostResponse extends Response {
  userPost?: UserPost
}

export interface GetUserPostResponse extends Response {
  userPost?: UserPost;
}

export interface GetAllUserPostResponse extends Response {
  userPosts?: UserPost[]
}

export interface UpdateUserPostRequest {
  userPost: UserPost
}

export interface UpdateUserPostResponse extends Response {
  userPost?: UserPost
}

export interface GetUserPostsCountResponse extends Response {
  userPosts?: number
}
