import PillarController from '../pillar/PillarController';
import GoalController, { GoalModel } from '../planning/GoalController';
import PlannedTaskController, { PlannedTaskModel } from '../planning/PlannedTaskController';
import UserController, { UserModel } from '../user/UserController';

class MigrationController {
    public static async update() {
        //await PlannedDayController.migrateAllDeprecated();
        //DailyResultController.migrate();
    }

    public static async handleMigrations() {
    }
}

export default MigrationController;
