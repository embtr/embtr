import PillarDao from "src/firebase/firestore/pillar/PillarDao";
import { PillarModel } from "src/model/PillarModel";

class PillarController {
    public static addPillar(pillar: string, callback: Function) {
        PillarDao.addPillar(pillar, callback);
    }

    public static deletePillar(pillar: string, callback: Function): void {
        PillarDao.deletePillar(pillar, callback);
    }

    public static getPillars(uid: string, callback: Function) {
        let pillars: PillarModel[] = [];

        const result = PillarDao.getPillars(uid);
        result.then(documents => {
            if (documents === undefined) {
                callback([]);
                return;
             }

            documents.forEach(document => {
                let name = document.id;
                let added = document.data()["timestamp"];
                let active = true;
                
                let pillar: PillarModel = {name: name, added: added, active: active};
                pillars.push(pillar);
            });
        }).then(() => {
            callback(pillars);
        }).catch(() => {
            callback(pillars);
        });
    }
}

export default PillarController;