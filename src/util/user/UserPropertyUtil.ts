import { Property, User } from 'resources/schema';

export enum UserProperty {
    TIME_ZONE = 'TIME_ZONE',
}

export class UserPropertyUtil {
    public static getTimeZone = (user: User) => {
        const property = UserProperty.TIME_ZONE;
        return this.getProperty(property, user);
    };

    private static getProperty = (property: UserProperty, user: User) => {
        const properties: Property[] = user.properties || [];
        const userProperty = properties.find((p) => p.key === property);

        return userProperty?.value;
    };
}
