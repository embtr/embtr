import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { VERSIONS } from 'src/util/FeatureVersions';
import PillarController from '../pillar/PillarController';
import UserController from '../user/UserController';

class MigrationController {
    public static async handleMigrations() {
        await this.handlePillarMigration();
    }

    private static async handlePillarMigration() {
        await PillarController.migrateDeprecatedPillars(getCurrentUid());
        const user = await UserController.getCurrentUser();
        await UserController.updateFeatureVersion(user, 'pillar', VERSIONS.PILLAR);
    }
}

export default MigrationController;
