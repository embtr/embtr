import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { VERSIONS } from 'src/util/FeatureVersions';
import PillarController from '../pillar/PillarController';
import UserController, { UserModel } from '../user/UserController';

class MigrationController {
    public static async handleMigrations(user: UserModel) {
        await this.handlePillarMigration(user);
    }

    public static requiresMigration(user: UserModel) {
        return user.feature_versions?.pillar !== VERSIONS.PILLAR;
    }

    private static async handlePillarMigration(user: UserModel) {
        await PillarController.migrateDeprecatedPillars(getCurrentUid());
        await UserController.updateFeatureVersion(user, 'pillar', VERSIONS.PILLAR);
    }
}

export default MigrationController;
