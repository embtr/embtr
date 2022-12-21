import PillarDao from 'src/firebase/firestore/pillar/PillarDao';
import { PillarModel } from 'src/model/PillarModel';
import { UserModel } from '../user/UserController';

class PillarController {
    public static async create(pillar: PillarModel) {
        const result = await PillarDao.create(pillar);
        pillar.id = result.id;

        return pillar;
    }

    public static async get(user: UserModel, id: string) {
        // 1 - if pillar was already migrated - get it by id
        let pillar = await this.getById(id);
        if (pillar) {
            return pillar;
        }

        // 2 - if pillar was migrated but we still look at its old key
        pillar = await this.getByDeprecatedKey(user.uid, id);
        return pillar;
    }

    public static async getPillars(user: UserModel) {
        let pillars: PillarModel[] = await this.getPillarObjects(user);
        return pillars;
    }

    public static async update(pillar: PillarModel) {
        PillarDao.update(pillar);
    }

    public static async archive(pillar: PillarModel) {
        pillar.active = false;
        await this.update(pillar);
    }

    private static async getPillarObjects(user: UserModel) {
        const pillars: PillarModel[] = [];
        const results = await PillarDao.getPillars(user.uid);
        results.docs.forEach((doc) => {
            const pillar: PillarModel = doc.data() as PillarModel;
            pillar.id = doc.id;
            pillars.push(pillar);
        });

        return pillars;
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
}

export default PillarController;
