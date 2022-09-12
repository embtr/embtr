import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import LevelDao from 'src/firebase/firestore/level/LevelDao';
import { PlannedDay, plannedDayIsComplete } from '../planning/PlannedDayController';

export interface LevelModel {
    id?: string;
    levelMap: Map<string, LevelElementModel>;
    levelCompressed: string;
    added: Timestamp;
    modified: Timestamp;
}

export interface LevelDbModel {
    id?: string;
    levelMap: {};
    levelCompressed: string;
    added: Timestamp;
    modified: Timestamp;
}

export interface LevelElementModel {
    completed: boolean;
    added: Timestamp;
    modified: Timestamp;
}

class LevelController {
    public static async get(uid: string): Promise<LevelModel | undefined> {
        const result = await LevelDao.get(uid);

        let dbLevel: LevelDbModel = result.data() as LevelDbModel;
        if (!dbLevel) {
            return undefined;
        }

        dbLevel.id = result.id;
        const level: LevelModel = this.dbLevelToLevel(dbLevel);
        return level;

        //const map = new Map<string, LevelElementModel>(Object.entries(level.levelMap));
        //level.levelMap = map;
        //level.id = result.id;
    }

    public static async create(uid: string): Promise<LevelModel> {
        let dbLevel: LevelDbModel = {
            levelMap: {},
            levelCompressed: '',
            added: Timestamp.now(),
            modified: Timestamp.now(),
        };

        await LevelDao.create(uid, dbLevel);
        let level = this.dbLevelToLevel(dbLevel);
        level.id = uid;

        return level;
    }

    public static async getOrCreate(uid: string): Promise<LevelModel> {
        const existingLevel = await this.get(uid);
        if (existingLevel) {
            return existingLevel;
        }

        const newLevel: LevelModel = await this.create(uid);
        return newLevel;
    }

    public static calculateLevel(level: LevelModel): number {
        if (!level || !level.levelMap) {
            return -1;
        }

        let calculatedLevel = 0;
        level.levelMap.forEach((value, key) => {
            calculatedLevel += value.completed ? 1 : -1;
        });

        return calculatedLevel;
    }

    public static async handlePlannedDayStatusChange(plannedDay: PlannedDay) {
        let level: LevelModel = await this.getOrCreate(getAuth().currentUser!.uid);

        let levelElement: LevelElementModel = this.createOrUpdateLevelElement(level, plannedDay);
        level.levelMap.set(plannedDay.id!, levelElement);

        let levelCompressed = this.createOrUpdateLevelCompressed(level, plannedDay);
        level.levelCompressed = levelCompressed;

        const dbLevel: LevelDbModel = this.levelToDbLevel(level); 
        LevelDao.update(getAuth().currentUser!.uid, dbLevel);
    }

    private static createOrUpdateLevelElement(level: LevelModel, plannedDay: PlannedDay) {
        let levelElement: LevelElementModel | undefined = level.levelMap.get(plannedDay.id!);
        if (levelElement) {
            levelElement.modified = Timestamp.now();
            levelElement.completed = plannedDayIsComplete(plannedDay);
        } else {
            levelElement = {
                completed: plannedDayIsComplete(plannedDay),
                added: Timestamp.now(),
                modified: Timestamp.now(),
            };

            level.levelCompressed = level.levelCompressed.substring(0, level.levelCompressed.length - 1);
        }

        return levelElement;
    }

    private static createOrUpdateLevelCompressed(level: LevelModel, plannedDay: PlannedDay): string {
        let levelCompressed = level.levelCompressed;
        if (level.levelMap.size === level.levelCompressed.length) {
            levelCompressed = levelCompressed.substring(0, levelCompressed.length - 1);
        }

        levelCompressed = plannedDayIsComplete(plannedDay) ? '1' : '0';
        return levelCompressed;
    }

    private static dbLevelToLevel(dbLevel: LevelDbModel): LevelModel {
        let level: LevelModel = {
            id: dbLevel.id,
            levelMap: new Map<string, LevelElementModel>(),
            levelCompressed: dbLevel.levelCompressed,
            added: dbLevel.added,
            modified: dbLevel.modified,
        };

        for (const [key, value] of Object.entries(dbLevel.levelMap)) {
            const k: string = key;
            const v: LevelElementModel = value as LevelElementModel;

            level.levelMap.set(k, v);
        }

        return level;
    }


    private static levelToDbLevel(level: LevelModel): LevelDbModel {
        let dbLevel: LevelDbModel = {
            id: level.id,
            levelMap: Object.fromEntries(level.levelMap), 
            levelCompressed: level.levelCompressed,
            added: level.added,
            modified: level.modified,
        };

        return dbLevel;
    }
}

export default LevelController;
