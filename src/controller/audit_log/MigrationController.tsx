import { getCurrentUid } from 'src/session/CurrentUserProvider';
import PillarController from '../pillar/PillarController';

class MigrationController {
    public static async handleMigrations() {
        await PillarController.migrateDeprecatedPillars(getCurrentUid());
    }
}

export default MigrationController;
