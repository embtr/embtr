import { ChallengeParticipant } from "../../schema";
import { ChallengeDto } from "../dto/Challenge";

export interface RecentlyJoinedChallenge {
    challenge: ChallengeDto;
    participants: ChallengeParticipant[];
    latestParticipant: ChallengeParticipant;
    isParticipant: boolean;
}

export interface ChallengeCompletionData {
    amountComplete: number;
    amountRequired: number;
    percentComplete: number;
    //challengeRequirementCompletionState: ChallengeRequirementCompletionState;
}
