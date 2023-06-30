import { ChallengeRequirement } from 'resources/schema';
import { UnitUtility } from '../UnitUtility';

export class ChallengeUtility {
    public static getChallengeRequirementProgressString(
        challengeRequirement: ChallengeRequirement
    ): string {
        const unit = challengeRequirement.unit;
        const amount = challengeRequirement.custom.completionData.amountComplete;
        const required = challengeRequirement.custom.completionData.amountRequired;

        if (unit) {
            const unitPretty = UnitUtility.getReadableUnit(unit, required);
            return `${amount} of ${required} ${unitPretty}`;
        }

        return '';
    }
}
