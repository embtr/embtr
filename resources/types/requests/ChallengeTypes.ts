import { ChallengeParticipant } from "../../schema";
import { ChallengeDto } from "../dto/Challenge";
import { RecentlyJoinedChallenge } from "../dto/RecentlyJoinedChallenge";
import { Response } from "./RequestTypes";

export interface GetChallengesResponse extends Response {
  challenges?: ChallengeDto[];
}

export interface GetChallengeResponse extends Response {
  challenge?: ChallengeDto;
}

export interface GetRecentlyJoinedChallengesResponse extends Response {
  recentlyJoinedChallenges?: RecentlyJoinedChallenge[]
}

export interface GetChallengeParticipationResponse extends Response {
  challengeParticipation?: ChallengeParticipant[];
}

export interface RegisterChallengeRequest {
  challengeId: number;
}
