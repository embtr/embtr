import { User } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';

export class UserPropertyUtil {
    public static isAway(user: User) {
        if (!user.properties) {
            return false;
        }

        for (const property of user.properties) {
            if (
                property.key === Constants.UserPropertyKey.AWAY_MODE &&
                property.value === Constants.AwayMode.ENABLED
            ) {
                return true;
            }
        }

        return false;
    }
}
