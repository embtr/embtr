import { ChallengeCalculationType, ChallengeRequirement } from 'resources/schema';
import { UnitUtility } from '../UnitUtility';

export class ChallengeUtility {
    public static getChallengeRequirementProgressString(
        challengeRequirement: ChallengeRequirement,
        amount: number,
        required: number
    ): string {
        const unit = challengeRequirement.unit;

        const calculationType = challengeRequirement.calculationType;

        if (calculationType === ChallengeCalculationType.TOTAL) {
            if (unit) {
                const unitPretty = UnitUtility.getReadableUnit(unit, required);
                return `${amount} of ${required} ${unitPretty}`;
            }
        } else if (calculationType === ChallengeCalculationType.UNIQUE) {
            if (challengeRequirement.calculationIntervalDays === 1) {
                return `${amount} of ${required} days`;
            } else if (challengeRequirement.calculationIntervalDays === 7) {
                return `${amount} of ${required} weeks`;
            } else if (
                challengeRequirement.calculationIntervalDays === 30 ||
                challengeRequirement.calculationIntervalDays === 31 ||
                challengeRequirement.calculationIntervalDays === 28 ||
                challengeRequirement.calculationIntervalDays === 29
            ) {
                return `${amount} of ${required} months`;
            } else {
                return `${amount} of ${required} intervals`;
            }
        }
        return '';
    }
}
