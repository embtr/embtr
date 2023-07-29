import { ChallengeParticipant } from 'resources/schema';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';

export interface Context {
    activeChallenges: ChallengeParticipant[];
    completedChallenges: ChallengeParticipant[];
}

export enum ContextOptions {
    ACTIVE_CHALLENGES = 'ACTIVE_CHALLENGES',
    COMPLETED_CHALLENGES = 'COMPLETED_CHALLENGES',
}

export const DEFAULT_CONTEXT_OPTIONS: ContextOptions[] = [
    ContextOptions.ACTIVE_CHALLENGES,
    ContextOptions.COMPLETED_CHALLENGES,
];

export const DEFAULT_CONTEXT: Context = {
    activeChallenges: [],
    completedChallenges: [],
};

export class UserUtility {
    public static async fetch(userId: number, options?: ContextOptions[]): Promise<Context> {
        if (!options) {
            options = DEFAULT_CONTEXT_OPTIONS;
        }

        const promises = [
            options.includes(ContextOptions.ACTIVE_CHALLENGES)
                ? ChallengeController.getAllActiveForUser(userId)
                : [],
            options.includes(ContextOptions.COMPLETED_CHALLENGES)
                ? ChallengeController.getAllCompletedForUser(userId)
                : [],
        ];
        const [activeChallenges, completedChallenges] = await Promise.all(promises);

        return {
            activeChallenges,
            completedChallenges,
        };
    }
}
