import { Timestamp } from 'firebase/firestore';
import LevelDao from 'src/firebase/firestore/level/LevelDao';

export interface LevelModel {
    id?: string;
    levelMap: Map<string, boolean>;
    levelCompressed: string;
    added: Timestamp;
    modified: Timestamp;
}

class LevelController {
    public static async get(uid: string): Promise<LevelModel> {
        const result = await LevelDao.get(uid);
        let level: LevelModel = result.data() as LevelModel;
        const map = new Map<string, boolean>(Object.entries(level.levelMap));
        level.levelMap = map;
        level.id = result.id;

        return level;
    }

    public static calculateLevel(level: LevelModel): number {
        if (!level) {
            return -1;
        }

        const levelMap: Map<string, boolean> = level.levelMap;
        let calculatedLevel = 0;
        levelMap.forEach((value, key) => {
            calculatedLevel += value ? 1 : -1;
        });

        return calculatedLevel;
    }
}

export default LevelController;
