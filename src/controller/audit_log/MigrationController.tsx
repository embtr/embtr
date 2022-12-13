import { VERSIONS } from 'src/util/FeatureVersions';
import PillarController from '../pillar/PillarController';
import PlannedDayController from '../planning/PlannedDayController';
import PlannedTaskController from '../planning/PlannedTaskController';
import DailyResultController from '../timeline/daily_result/DailyResultController';
import UserController, { UserModel } from '../user/UserController';

class MigrationController {
    public static async update() {
        //await PlannedDayController.migrateAllDeprecated();
        //DailyResultController.migrate();
    }

    public static async handleMigrations(user: UserModel) {
        await this.handlePillarMigration(user);
        await this.handlePlannedTaskMigration(user);
    }

    public static requiresMigration(user: UserModel) {
        return this.requiresPillarMigration(user) || this.requiresPlannedTaskMigration(user);
    }

    public static requiresPillarMigration(user: UserModel) {
        return user.feature_versions?.pillar !== VERSIONS.PILLAR;
    }

    public static requiresPlannedTaskMigration(user: UserModel) {
        return user.feature_versions?.planned_task !== VERSIONS.PLANNED_TASK;
    }

    private static async handlePillarMigration(user: UserModel) {
        if (!this.requiresPillarMigration(user)) {
            return;
        }

        await PillarController.migrateDeprecatedPillars();
        await UserController.updateFeatureVersion(user, 'pillar', VERSIONS.PILLAR);
    }

    private static async handlePlannedTaskMigration(user: UserModel) {
        if (!this.requiresPlannedTaskMigration(user)) {
            return;
        }

        await PlannedDayController.migrateAllDeprecated(user);
        //await UserController.updateFeatureVersion(user, 'planned_task', VERSIONS.PLANNED_TASK);
    }
}

export default MigrationController;
