import { Firestore, doc, deleteDoc, getDocs, collection, getDoc, addDoc, query, where, setDoc } from 'firebase/firestore';
import { getFirebaseConnection } from 'src/firebase/firestore/ConnectionProvider';
import { PillarModel } from 'src/model/PillarModel';

class PillarDao {
    public static async create(pillar: PillarModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'create');
        const result = await addDoc(collection(db, 'pillars'), pillar);

        return result;
    }

    public static async update(pillar: PillarModel) {
        const db: Firestore = getFirebaseConnection(this.name, 'update');
        const result = await setDoc(doc(db, 'pillars', pillar.id!), pillar, { merge: true });

        return result;
    }

    public static async deleteDeprecatedPillarData(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'deleteDeprecatedPillarData');

        const deprecatedActivePillars = await getDocs(collection(db, 'pillars/' + uid + '/active/'));
        for (let deprecatedActivePillar of deprecatedActivePillars.docs) {
            await deleteDoc(doc(db, 'pillars/' + uid + '/active/' + deprecatedActivePillar.id));
        }

        const deprecatedInactivePillars = await getDocs(collection(db, 'pillars/' + uid + '/inactive/'));
        for (let deprecatedInactivePillar of deprecatedInactivePillars.docs) {
            await deleteDoc(doc(db, 'pillars/' + uid + '/active/' + deprecatedInactivePillar.id));
        }
    }

    public static async get(id: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'get');
        const result = await getDoc(doc(db, 'pillars/', id));

        return result;
    }

    public static async getPillars(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getPillars');

        const q = query(collection(db, 'pillars'), where('uid', '==', uid), where('active', '!=', false));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getDeprecated(uid: string, id: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getDeprecated');
        const result = await getDoc(doc(db, 'pillars/' + uid + '/active/' + id));

        return result;
    }

    public static async getByDeprecatedKey(uid: string, key: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getByDeprecatedKey');

        const q = query(collection(db, 'pillars'), where('uid', '==', uid), where('deprecatedKey', '==', key));
        const querySnapshot = await getDocs(q);

        return querySnapshot;
    }

    public static async getDeprecatedPillars(uid: string) {
        const db: Firestore = getFirebaseConnection(this.name, 'getPillars');
        const result = await getDocs(collection(db, 'pillars/' + uid + '/active'));

        return result;
    }
}

export default PillarDao;
