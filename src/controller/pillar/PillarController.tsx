import { Timestamp } from 'firebase/firestore';
import PillarDao from 'src/firebase/firestore/pillar/PillarDao';
import { PillarModel } from 'src/model/PillarModel';

class PillarController {
    public static async create(pillar: PillarModel) {
        const result = await PillarDao.create(pillar);
        pillar.id = result.id;

        return pillar;
    }

    public static async get(uid: string, id: string) {
        // 1 - if pillar was already migrated - get it by id
        let pillar = await this.getById(id);
        if (pillar) {
            return pillar;
        }

        // 2 - if pillar was migrated but we still look at its old key
        pillar = await this.getByDeprecatedKey(uid, id);
        return pillar;
    }

    public static async getPillars(uid: string) {
        let pillars: PillarModel[] = [];
        const results = await PillarDao.getPillars(uid);
        results.docs.forEach((doc) => {
            const pillar: PillarModel = doc.data() as PillarModel;
            pillar.id = doc.id;
            pillars.push(pillar);
        });

        return pillars;
    }

    public static async migrateDeprecatedPillars(uid: string) {
        const result = await PillarDao.getDeprecatedPillars(uid);
        if (result?.docs) {
            for (const document of result.docs) {
                await this.migrateDeprecatedPillar(uid, document.id);
            }
        }

        await this.deleteDeprecatedPillarData(uid);
    }

    public static async update(pillar: PillarModel) {
        PillarDao.update(pillar);
    }

    public static async archive(pillar: PillarModel) {
        pillar.active = false;
        await this.update(pillar);
    }

    private static async getById(id: string) {
        const result = await PillarDao.get(id);

        if (result.exists()) {
            const pillar = result.data() as PillarModel;
            pillar.id = result.id;

            return pillar;
        }

        return undefined;
    }

    private static async getDeprecated(uid: string, id: string) {
        const result = await PillarDao.getDeprecated(uid, id);
        const pillar = result.data() as PillarModel;
        pillar.id = result.id;

        return pillar;
    }

    private static async getByDeprecatedKey(uid: string, key: string) {
        const result = await PillarDao.getByDeprecatedKey(uid, key);

        if (result.docs.length) {
            const pillarData = result.docs[0].data();
            const pillar = pillarData as PillarModel;
            pillar.id = pillarData.id;

            return pillar;
        }

        return undefined;
    }

    private static async migrateDeprecatedPillar(uid: string, id: string) {
        const deprecatedPillar = await this.getDeprecated(uid, id);
        if (deprecatedPillar) {
            const migratedPillar = this.migrateDeprecatedPillarData(uid, deprecatedPillar);
            await this.create(migratedPillar);
        }
    }

    private static async deleteDeprecatedPillarData(uid: string) {
        await PillarDao.deleteDeprecatedPillarData(uid);
    }

    private static migrateDeprecatedPillarData(uid: string, deprecatedPillar: PillarModel) {
        const migratedPillar: PillarModel = {
            name: deprecatedPillar.id ? deprecatedPillar.id : '',
            added: deprecatedPillar.timestamp ? deprecatedPillar.timestamp : Timestamp.now(),
            uid: uid,
            active: true,
            deprecatedKey: deprecatedPillar.id,
        };

        return migratedPillar;
    }
}

export default PillarController;
