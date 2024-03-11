import { Property } from 'resources/schema';
import { UserPropertyController } from 'src/controller/user/UserPropertyController';
import { UserProperty } from 'src/util/user/UserPropertyUtil';

export class UserPropertyService {
  public static async createTimeZone(value: string) {
    const property: Property = {
      key: UserProperty.TIME_ZONE,
      value: value,
    };

    UserPropertyController.create(property);
  }
}
