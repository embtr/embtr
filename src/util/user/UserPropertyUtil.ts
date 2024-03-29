import { Property, User } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';

export class UserPropertyUtil {
    public static getTimeZone = (user: User) => {
        const property = Constants.UserPropertyKey.TIME_ZONE;
        return this.getProperty(property, user);
    };

    public static getNewUserChecklistDismissed = (user: User) => {
        const property = Constants.UserPropertyKey.NEW_USER_CHECKLIST_DISMISSED;
        return this.getProperty(property, user);
    };

    public static getNewUserChecklistCompleted = (user: User) => {
        const property = Constants.UserPropertyKey.NEW_USER_CHECKLIST_COMPLETED;
        return this.getProperty(property, user);
    };

    private static getProperty = (property: Constants.UserPropertyKey, user: User) => {
        const properties: Property[] = user.properties || [];
        const userProperty = properties.find((p) => p.key === property);

        return userProperty?.value;
    };
}
