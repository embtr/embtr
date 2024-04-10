import { Challenge } from "../../schema";

export interface ChallengeDto {
    challenge: Challenge;
    participantCount: number;
    isPartcipant: boolean;
}
