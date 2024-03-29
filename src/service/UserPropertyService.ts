import { Property } from 'resources/schema';
import { getTodayKey } from 'src/controller/planning/PlannedDayController';
import { UserPropertyController } from 'src/controller/user/UserPropertyController';
import { UserProperty } from 'src/util/user/UserPropertyUtil';

export class UserPropertyService {
  public static async createTimeZone(value: string) {
    return this.createProperty(UserProperty.TIME_ZONE, value);
  }

  public static async createDismissNewUserChecklist() {
    return this.createProperty(UserProperty.DISMISS_NEW_USER_CHECKLIST, getTodayKey());
  }

  public static async createCompleteNewUserChecklist() {
    return this.createProperty(UserProperty.COMPLETE_NEW_USER_CHECKLIST, getTodayKey());
  }

  private static async createProperty(property: UserProperty, value: string) {
    const p: Property = {
      key: property,
      value: value,
    };

    UserPropertyController.create(p);
  }
}
