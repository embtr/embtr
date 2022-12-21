import PillarController from '../pillar/PillarController';
import UserController, { UserModel } from '../user/UserController';

class MigrationController {
    public static async update() {
        //await PlannedDayController.migrateAllDeprecated();
        //DailyResultController.migrate();
    }

    public static async handleMigrations() {
        //const users = await UserController.getAll();
        //for (const user of users) {
        //    console.log('migrating user: ' + user.email);
        //    await PillarController.migrateDeprecatedPillars(user);
        //}
    }
}

export default MigrationController;
