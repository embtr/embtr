import { User } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';

export class UserPropertyUtil {
    public static isAway(user: User) {
        if (!user.properties) {
            return false;
        }

        const awayProperty = this.getProperty(user, Constants.UserPropertyKey.AWAY_MODE);
        return !!awayProperty && awayProperty.value === Constants.AwayMode.ENABLED;
    }

    public static isSocialBlacklisted(user: User) {
        if (!user.properties) {
            return false;
        }

        const socialBlacklistProperty = this.getProperty(
            user,
            Constants.UserPropertyKey.SOCIAL_BLACKLIST
        );

        return (
            !!socialBlacklistProperty &&
            socialBlacklistProperty.value === Constants.BooleanState.ENABLED
        );
    }

    public static hasStartedTutorialIsland(user: User) {
        if (!user.properties) {
            return false;
        }

        const tutorialCompletedProperty = this.getProperty(
            user,
            Constants.UserPropertyKey.TUTORIAL_COMPLETED
        );

        return !!tutorialCompletedProperty;
    }

    private static getProperty(user: User, key: Constants.UserPropertyKey) {
        if (!user.properties) {
            return undefined;
        }

        for (const property of user.properties) {
            if (property.key === key) {
                return property;
            }
        }

        return undefined;
    }
}
